import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .core.config import settings
from .api.routes import router as api_router
from .db.database import db_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("project_x")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event to initialize SQLite schema and verify connection parameters."""
    logger.info(f"Initializing {settings.PROJECT_NAME} (v{settings.VERSION})...")
    logger.info(f"Nebius AI Base URL: {settings.NEBIUS_BASE_URL}")
    logger.info(f"Fast-Tier Model: {settings.NEBIUS_FAST_MODEL}")
    logger.info(f"High-Tier Model: {settings.NEBIUS_HIGH_MODEL}")
    
    if settings.is_mock_mode:
        logger.info("⚡ NEBIUS_API_KEY is not set or set to mock. Running in high-fidelity offline simulation mode.")
    else:
        logger.info("🚀 Connected to Nebius AI Token Factory with live NVIDIA Nemotron models.")

    # Initialize SQLite database tables
    await db_manager.init_db()
    logger.info(f"SQLite database initialized at: {settings.DATABASE_PATH}")
    
    yield
    
    logger.info("Shutting down Project X services.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous SRE & DevOps Incident Triage Agent powered by Nebius AI Token Factory and NVIDIA Nemotron models.",
    lifespan=lifespan
)

# Enable CORS for local Vite dev server and external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {
        "project": "Project X",
        "description": "Autonomous Incident Triage & Self-Healing Agent",
        "hackathon": "Nebius x NVIDIA Global AI Hackathon (Best Apps & Agents Track)",
        "docs": "/docs",
        "api_v1": "/api/v1"
    }


if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.BACKEND_PORT,
        reload=True
    )
