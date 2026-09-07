# app/schemas/auth.py

from typing import Literal, Optional
from pydantic import BaseModel, Field


class SignupRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    password: str
    role: Literal["customer", "driver", "company_admin"]


class LoginRequest(BaseModel):
    phone: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class OTPVerifyRequest(BaseModel):
    phone: str
    otp_code: str = Field(pattern=r"^\d{6}$", description="Must be exactly 6 digits")