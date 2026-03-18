import os
from typing import cast
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv
load_dotenv()
from app.db.session import get_db
from app.model.user import User
from starlette.status import HTTP_401_UNAUTHORIZED
# Load SECRET_KEY from environment, fail fast if missing
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY or not SECRET_KEY.strip():
    raise RuntimeError(
        "SECRET_KEY environment variable is not set or is empty. "
        "Please set SECRET_KEY in your .env file or environment variables."
    )
SECRET_KEY = cast(str, SECRET_KEY)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

from fastapi import Cookie

def decode_token(token: str):
    try:
        payload = jwt.decode(token, cast(str, SECRET_KEY), algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)

def get_current_user(
    access_token: str = Cookie(None),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    actual_token = token or access_token

    if not actual_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(actual_token, cast(str, SECRET_KEY), algorithms=[ALGORITHM])
        email = payload.get("sub")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, cast(str, SECRET_KEY), algorithm=ALGORITHM)

    return encoded_jwt