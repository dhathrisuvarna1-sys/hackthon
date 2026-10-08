import os

class Settings:
    APP_NAME: str = "Suraksha Shield API"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:4173",
    ]
    MAX_IMAGE_SIZE_BYTES: int = 5 * 1024 * 1024 # 5 MB
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./suraksha.db")
    RATE_LIMIT_PER_MINUTE: int = 60

settings = Settings()
