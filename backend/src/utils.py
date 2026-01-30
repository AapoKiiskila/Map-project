import pwdlib

password_hash = pwdlib.PasswordHash.recommended()

def hash_password(password: str):
  return password_hash.hash(password)
