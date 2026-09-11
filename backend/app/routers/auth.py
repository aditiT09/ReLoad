# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, OTPVerifyRequest

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    # Check if a user with this phone already exists
    stmt = select(User).where(User.phone == request.phone)
    existing_user = db.execute(stmt).scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
        
    # Hash password and create new user
    hashed_pw = hash_password(request.password)
    new_user = User(
        role=request.role,
        name=request.name,
        phone=request.phone,
        email=request.email,
        password_hash=hashed_pw
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate JWT
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Look up user by phone
    stmt = select(User).where(User.phone == request.phone)
    user = db.execute(stmt).scalar_one_or_none()
    
    # Generic failure message to prevent user enumeration
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )
    
    if not user:
        raise credentials_exception
        
    if not verify_password(request.password, user.password_hash):
        raise credentials_exception
        
    # Generate JWT
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(access_token=access_token)


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(request: OTPVerifyRequest, db: Session = Depends(get_db)):
    # Accepts any 6-digit code during dev/hackathon demo
    print(f"[MOCK OTP] Phone: {request.phone} | Code: {request.otp_code}")
    
    formatted_phone = request.phone if request.phone.startswith("+") else f"+91{request.phone}"
    stmt = select(User).where(User.phone == formatted_phone)
    user = db.execute(stmt).scalar_one_or_none()
    
    if not user:
        # Create new customer user directly in Supabase Postgres
        hashed_pw = hash_password(request.otp_code)
        user = User(
            role="customer",
            name=f"Shipper {formatted_phone[-4:]}",
            phone=formatted_phone,
            password_hash=hashed_pw
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    access_token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(access_token=access_token)