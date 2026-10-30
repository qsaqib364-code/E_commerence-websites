from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "E-Commerce API"
    ENV: str = "development"
    DEBUG: bool = True
    
    # Database & Redis
    DATABASE_URL: str
    REDIS_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Pydantic ko batana ke .env file read kare
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# YEH LINE SABSE ZAROORI HAI (Isi ki wajah se error aa raha tha)
settings = Settings()