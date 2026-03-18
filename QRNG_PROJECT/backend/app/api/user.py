from fastapi import APIRouter, Depends, HTTPException , Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.model.user import User
from app.schema.user_schema import UserCreate
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token, get_current_user

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        {"sub": user.email, "role": user.role}
    )

    # Set JWT in HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,     # change to True in production (HTTPS)
        samesite="lax",
        max_age=3600
    )

    return {"message": "Login successful", "access_token": access_token}


@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):

    return {
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role
    }