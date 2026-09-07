from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    VEHICLE_AGE_CAP_YEARS: int = 5
    VERIFICATION_DUE_MONTHS: int = 6

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()