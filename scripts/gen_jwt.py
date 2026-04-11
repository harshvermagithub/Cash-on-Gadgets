import base64, json, hmac, hashlib

def b64url(data):
    if isinstance(data, str):
        data = data.encode()
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

secret = 'skillhancer_jwt_secret'

for role in ['anon', 'service_role']:
    header = b64url(json.dumps({'alg':'HS256','typ':'JWT'}))
    payload = b64url(json.dumps({'iss':'supabase','ref':'local','role':role,'iat':1700000000,'exp':2100000000}))
    sig = hmac.new(secret.encode(), f'{header}.{payload}'.encode(), hashlib.sha256).digest()
    token = f'{header}.{payload}.{b64url(sig)}'
    print(f'{role}: {token}')
