#!/usr/bin/env python3
"""
Fonzkart: Supabase Cloud -> Local Postgres Migration
Fetches all data via Supabase REST API and imports into local Docker Postgres.
"""

import json
import subprocess
import sys
import urllib.request
import urllib.error

SUPABASE_URL = "https://iqshcfyoebtvdpdpoxrv.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxc2hjZnlvZWJ0dmRwZHBveHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTc5NTgsImV4cCI6MjA4OTA3Mzk1OH0.NoP5zUkA6oHCBrHQhv84yEZJLAfHFA0Zq0LQ8nk8jjY"
LOCAL_DB_CONTAINER = "db-o425knxgyusqx43rmiy6sh07"
LOCAL_DB_USER = "postgres"
LOCAL_DB_NAME = "postgres"

# Tables in dependency order (parents before children)
TABLES = [
    "Brand",
    "City",
    "User",
    "Model",
    "Variant",
    "Rider",
    "Order",
    "EvaluationRule",
    "EmailMessage",
]


def fetch_table(table):
    """Fetch all rows from a Supabase table via REST API."""
    rows = []
    limit = 1000
    offset = 0

    while True:
        url = f"{SUPABASE_URL}/rest/v1/{table}?select=*&limit={limit}&offset={offset}"
        req = urllib.request.Request(url, headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
        })
        try:
            with urllib.request.urlopen(req) as resp:
                batch = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"    HTTP {e.code} error fetching {table}: {body}")
            return []

        if not batch:
            break
        rows.extend(batch)
        if len(batch) < limit:
            break
        offset += limit

    return rows


def to_pg_literal(value):
    """Convert a Python value to a PostgreSQL literal string."""
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        if not value:
            return "ARRAY[]::text[]"
        items = ", ".join("'" + str(x).replace("'", "''") + "'" for x in value)
        return f"ARRAY[{items}]"
    # Strings
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def generate_sql(table, rows):
    """Generate SQL INSERT statements for the given rows."""
    if not rows:
        return ""

    lines = []
    cols = list(rows[0].keys())
    col_list = ", ".join(f'"{c}"' for c in cols)

    for row in rows:
        vals = ", ".join(to_pg_literal(row[c]) for c in cols)
        lines.append(f'INSERT INTO public."{table}" ({col_list}) VALUES ({vals}) ON CONFLICT DO NOTHING;')

    return "\n".join(lines)


def run_sql(sql):
    """Run SQL against the local Postgres Docker container."""
    result = subprocess.run(
        ["docker", "exec", "-i", LOCAL_DB_CONTAINER,
         "psql", "-U", LOCAL_DB_USER, "-d", LOCAL_DB_NAME, "-q"],
        input=sql.encode(),
        capture_output=True,
    )
    stderr = result.stderr.decode().strip()
    if result.returncode != 0:
        print(f"    ✗ SQL Error: {stderr}")
        return False
    if stderr:
        # Print warnings but don't fail
        for line in stderr.splitlines():
            if "ERROR" in line:
                print(f"    ⚠ {line}")
    return True


def main():
    print()
    print("=" * 55)
    print("  Fonzkart: Supabase Cloud → Local Postgres Migration")
    print("=" * 55)
    print()

    total_rows = 0

    for table in TABLES:
        print(f"  [{table}]")
        sys.stdout.write(f"    Fetching... ")
        sys.stdout.flush()

        rows = fetch_table(table)
        print(f"{len(rows)} rows")

        if not rows:
            print(f"    (skipped - empty)\n")
            continue

        sys.stdout.write(f"    Importing... ")
        sys.stdout.flush()

        sql = generate_sql(table, rows)
        ok = run_sql(sql)

        if ok:
            print(f"✓ done")
            total_rows += len(rows)
        else:
            print(f"✗ failed")

        print()

    print("=" * 55)
    print(f"  Migration complete! {total_rows} total rows imported.")
    print("=" * 55)
    print()


if __name__ == "__main__":
    main()
