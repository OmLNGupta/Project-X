import os
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "Project X - Autonomous Incident Triage & Self-Healing Agent"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Nebius Token Factory AI Config
    NEBIUS_BASE_URL: str = os.getenv("NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1/")
    NEBIUS_API_KEY: str = os.getenv("NEBIUS_API_KEY", "mock_dev_key")
    
    # NVIDIA Nemotron Models
    NEBIUS_FAST_MODEL: str = os.getenv("NEBIUS_FAST_MODEL", "nvidia/nemotron-mini-4b-instruct")
    NEBIUS_HIGH_MODEL: str = os.getenv("NEBIUS_HIGH_MODEL", "nvidia/Llama-3.1-Nemotron-70B-Instruct")
    
    # Tavily Search API
    TAVILY_API_KEY: Optional[str] = os.getenv("TAVILY_API_KEY", "")
    
    # Database Config (Uses /tmp on Vercel to support serverless read-only filesystem)
    DATABASE_PATH: str = os.getenv(
        "DATABASE_PATH",
        "/tmp/project_x.db" if os.getenv("VERCEL") else "project_x.db"
    )
    
    # Server Host & Port
    HOST: str = os.getenv("HOST", "0.0.0.0")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    
    @property
    def is_mock_mode(self) -> bool:
        key = (self.NEBIUS_API_KEY or "").strip()
        return key in ["", "mock_dev_key", "mock", "placeholder", "your_nebius_api_key_here"]

    @property
    def is_tavily_mock_mode(self) -> bool:
        key = (self.TAVILY_API_KEY or "").strip()
        return key in ["", "mock", "placeholder", "your_tavily_api_key_here"]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
