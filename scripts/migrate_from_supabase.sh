#!/bin/bash
set -e

SUPABASE_URL="https://iqshcfyoebtvdpdpoxrv.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxc2hjZnlvZWJ0dmRwZHBveHJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ5Nzk1OCwiZXhwIjoyMDg5MDczOTU4fQ.placeholder"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxc2hjZnlvZWJ0dmRwZHBveHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTc5NTgsImV4cCI6MjA4OTA3Mzk1OH0.NoP5zUkA6oHCBrHQhv84yEZJLAfHFA0Zq0LQ8nk8jjY"
LOCAL_DB_CONTAINER="db-o425knxgyusqx43rmiy6sh07"
LOCAL_DB_USER="postgres"
LOCAL_DB_NAME="postgres"

TABLES=("Brand" "Model" "Variant" "EvaluationRule" "City" "User" "Rider" "Order" "EmailMessage")

echo "========================================="
echo "  Fonzkart: Supabase -> Local Migration  "
echo "========================================="

fetch_table() {
  local table=$1
  local offset=0
  local limit=1000
  local all_rows="[]"

  echo -n "  Fetching $table... "

  while true; do
    RESPONSE=$(curl -sf \
      "${SUPABASE_URL}/rest/v1/${table}?select=*&limit=${limit}&offset=${offset}" \
      -H "apikey: ${ANON_KEY}" \
      -H "Authorization: Bearer ${ANON_KEY}" \
      -H "Prefer: count=exact" 2>&1)
    
    if [ $? -ne 0 ]; then
      echo "FAILED (curl error: $RESPONSE)"
      return 1
    fi
    
    ROW_COUNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d))" 2>/dev/null || echo 0)
    
    if [ "$ROW_COUNT" -eq 0 ]; then
      break
    fi
    
    if [ "$offset" -eq 0 ]; then
      all_rows="$RESPONSE"
    else
      all_rows=$(python3 -c "import sys,json; a=json.loads('$all_rows'); b=json.loads('$RESPONSE'); a.extend(b); print(json.dumps(a))")
    fi
    
    if [ "$ROW_COUNT" -lt "$limit" ]; then
      break
    fi
    
    offset=$((offset + limit))
  done
  
  TOTAL=$(echo "$all_rows" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo 0)
  echo "$TOTAL rows"
  echo "$all_rows"
}

import_table() {
  local table=$1
  local data=$2
  
  ROW_COUNT=$(echo "$data" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo 0)
  
  if [ "$ROW_COUNT" -eq 0 ]; then
    echo "  [SKIP] $table is empty"
    return 0
  fi
  
  # Generate COPY-style SQL using Python
  python3 << PYEOF
import json, sys

data = json.loads("""$data""")
table = "$table"

if not data:
    sys.exit(0)

cols = list(data[0].keys())
col_list = ', '.join(['"' + c + '"' for c in cols])

# print TRUNCATE first
print(f'TRUNCATE TABLE public."{table}" RESTART IDENTITY CASCADE;')

# Build INSERT statements
for row in data:
    values = []
    for col in cols:
        v = row[col]
        if v is None:
            values.append('NULL')
        elif isinstance(v, bool):
            values.append('TRUE' if v else 'FALSE')
        elif isinstance(v, (int, float)):
            values.append(str(v))
        elif isinstance(v, list):
            # PostgreSQL array format
            if len(v) == 0:
                values.append("'{}'")
            else:
                arr_items = ','.join(['"' + str(x).replace('"', '\\"') + '"' for x in v])
                values.append("ARRAY[" + ','.join(["'" + str(x).replace("'", "''") + "'" for x in v]) + "]")
        else:
            # String - escape single quotes
            escaped = str(v).replace("'", "''")
            values.append(f"'{escaped}'")
    
    val_str = ', '.join(values)
    print(f'INSERT INTO public."{table}" ({col_list}) VALUES ({val_str}) ON CONFLICT DO NOTHING;')
PYEOF
}

echo ""
echo "Step 1: Fetching data from Supabase Cloud..."
echo ""

for table in "${TABLES[@]}"; do
  DATA=$(fetch_table "$table")
  if [ $? -eq 0 ]; then
    echo "  Importing $table into local DB..."
    import_table "$table" "$DATA" | docker exec -i "$LOCAL_DB_CONTAINER" psql -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" -q 2>&1 | head -5
    echo "  ✓ $table done"
    echo ""
  fi
done

echo "========================================="
echo "  Migration Complete!"
echo "========================================="
