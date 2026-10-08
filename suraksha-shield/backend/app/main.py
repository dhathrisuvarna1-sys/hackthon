from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.database import engine, Base
from app.api import router

# Initialize SQLite database schemas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Vernacular Scam & UPI Fraud Message Shield API (English, Kannada, Hindi)",
    version="1.0.0"
)

# CORS allow-list
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(router)

@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "docs_url": "/docs",
        "official_reporting_resources": {
            "national_cyber_crime_helpline": "1930",
            "portal": "https://cybercrime.gov.in"
        }
    }
