import os
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from fastapi_sso.sso.google import GoogleSSO
from fastapi_sso.sso.github import GithubSSO
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.model.user import User
from app.core.auth import create_access_token
from app.core.security import hash_password # Fallback password
import secrets

router = APIRouter()

# Initialize SSO instances (Replace these with env variables or standard config)
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET", "")

google_sso = GoogleSSO(
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET, 
    "http://localhost:8000/auth/google/callback"
)

github_sso = GithubSSO(
    GITHUB_CLIENT_ID, 
    GITHUB_CLIENT_SECRET, 
    "http://localhost:8000/auth/github/callback"
)

@router.get("/google/login")
async def google_login():
    if not GOOGLE_CLIENT_ID:
        # Prevent crash if keys not set, redirect to frontend with error
        return RedirectResponse(f"http://localhost:5173/login?error=Google_OAuth_Keys_Missing")
    with google_sso:
        return await google_sso.get_login_redirect(params={"prompt": "consent", "access_type": "offline"})

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        with google_sso:
            user_info = await google_sso.verify_and_process(request)
    except Exception as e:
        return RedirectResponse(f"http://localhost:5173/login?error=Authentication_Failed")
        
    if not user_info:
        return RedirectResponse(f"http://localhost:5173/login?error=Authentication_Failed")
        
    return handle_social_login(user_info, db)


@router.get("/github/login")
async def github_login():
    if not GITHUB_CLIENT_ID:
        return RedirectResponse(f"http://localhost:5173/login?error=Github_OAuth_Keys_Missing")
    with github_sso:
        return await github_sso.get_login_redirect()

@router.get("/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    try:
        with github_sso:
            user_info = await github_sso.verify_and_process(request)
    except Exception as e:
        return RedirectResponse(f"http://localhost:5173/login?error=Authentication_Failed")
        
    if not user_info:
        return RedirectResponse(f"http://localhost:5173/login?error=Authentication_Failed")
        
    return handle_social_login(user_info, db)

def handle_social_login(user_info, db: Session):
    # Fetch or create user
    email = user_info.email or f"{user_info.id}@social.mock"
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create a new user for the social login
        user = User(
            username=user_info.display_name or user_info.email.split('@')[0],
            email=email,
            hashed_password=hash_password(secrets.token_urlsafe(32)), # Random unusable password
            role="user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWT
    access_token = create_access_token({"sub": user.email, "role": user.role})
    
    # Redirect to the frontend Dashboard with the access token in the URL or set cookie
    # Since we are using Bearer tokens primarily, appending to URL or local temp path is standard for SPAs
    # The frontend will grab it from the URL hash and save it to LocalStorage
    redirect_url = f"http://localhost:5173/oauth-callback#token={access_token}"
    
    response = RedirectResponse(redirect_url)
    return response
