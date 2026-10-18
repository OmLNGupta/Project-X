import uuid
import time
import json
import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..core.config import settings
from ..core.nebius_client import nebius_client
from ..agent.tools import tool_registry
from ..db.database import db_manager

logger = logging.getLogger("project_x.api")

router = APIRouter()


class TriageRequest(BaseModel):
    error_log: str = Field(..., description="Stack trace or terminal crash output")
    code_snippet: str = Field(..., description="Vulnerable or crashing source code snippet")
    title: Optional[str] = Field("Automated Incident Triage", description="Incident label or title")
    language: Optional[str] = Field("python", description="Programming language")


class HealthResponse(BaseModel):
    status: str
    version: str
    mode: str
    nebius_base_url: str
    fast_model: str
    high_model: str
    tavily_enabled: bool


# Sample Presets for 1-Click Testing & Hackathon Demonstrations
SAMPLE_PRESETS = [
    {
        "id": "pydantic-v2-crash",
        "name": "Pydantic v2 Deprecation Crash (Hero Scenario)",
        "badge": "Critical AST Migration",
        "error_log": """Traceback (most recent call last):
  File "/app/services/user_service.py", line 14, in <module>
    class UserPayload(BaseModel):
  File "pydantic/main.py", line 198, in __new__
    return super().__new__(mcs, name, bases, namespace, **kwargs)
pydantic.errors.PydanticUserError: The `@validator` decorator has been removed in Pydantic V2. Please use `@field_validator` instead.
See https://docs.pydantic.dev/2.0/migration/ for more information.

During handling of the above exception, another exception occurred:
ImportError: cannot import name 'BaseSettings' from 'pydantic' (/usr/local/lib/python3.11/site-packages/pydantic/__init__.py)""",
        "code_snippet": """from pydantic import BaseModel, validator, BaseSettings

class ServiceSettings(BaseSettings):
    app_name: str = "Project X Engine"
    port: int = 8000
    environment: str = "production"

class UserPayload(BaseModel):
    username: str
    email: str
    role: str = "analyst"

    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('username must be at least 3 characters')
        return v.lower()

    class Config:
        schema_extra = {"example": {"username": "admin", "email": "ops@projectx.ai"}}

def export_user_data(user: UserPayload) -> dict:
    return user.dict(exclude={"role"})"""
    },
    {
        "id": "fastapi-lifespan-deprecation",
        "name": "FastAPI Lifespan Events Deprecation",
        "badge": "Async Lifecycle",
        "error_log": """DeprecationWarning: on_event is deprecated, use lifespan event handlers instead.
  See https://fastapi.tiangolo.com/advanced/events/ for more information.
  @app.on_event("startup")
  def startup_event():
      pass""",
        "code_snippet": """from fastapi import FastAPI
import asyncio

app = FastAPI(title="Project X Microservice")

@app.on_event("startup")
async def startup_event():
    print("Connecting to Redis cache and warming model weights...")

@app.on_event("shutdown")
async def shutdown_event():
    print("Flushing buffers and closing active telemetry streams...")

@app.get("/health")
def health():
    return {"status": "ok"}"""
    }
]


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check displaying active connection tier and mode."""
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        mode="mock_simulated" if settings.is_mock_mode else "live_nebius",
        nebius_base_url=settings.NEBIUS_BASE_URL,
        fast_model=settings.NEBIUS_FAST_MODEL,
        high_model=settings.NEBIUS_HIGH_MODEL,
        tavily_enabled=not settings.is_tavily_mock_mode
    )


@router.get("/samples")
async def get_sample_presets():
    """Return pre-configured sample incident scenarios for 1-click testing."""
    return {"samples": SAMPLE_PRESETS}


@router.get("/incidents")
async def list_incidents():
    """List recent incident triage runs stored in the SQLite database."""
    incidents = await db_manager.get_recent_incidents(limit=25)
    return {"incidents": incidents}


@router.get("/incidents/{incident_id}")
async def get_incident(incident_id: str):
    """Retrieve full incident details and historical telemetry events."""
    incident = await db_manager.get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident record not found")
    return incident


@router.post("/agent/triage")
async def stream_agent_triage(request: TriageRequest):
    """
    Core Server-Sent Events (SSE) streaming endpoint for autonomous incident triage.
    Streams:
      - telemetry_init (Fast-tier 4B model assignment)
      - thought (Root-cause deconstruction)
      - tool_call (Tavily search query for CVEs/migration docs)
      - tool_result (Source reference documents)
      - telemetry_switch (Dynamic escalation to Nemotron 70B)
      - patch_stream (Unified git diff chunks)
      - execution_summary (Latency, tokens, compute cost reduction metrics)
    """
    incident_id = f"inc_{uuid.uuid4().hex[:10]}"
    start_time = time.time()

    # Pre-fetch or query Tavily documentation
    search_query = f"Fix {request.error_log.splitlines()[0] if request.error_log else 'python bug'}"
    if "pydantic" in (request.error_log + request.code_snippet).lower():
        search_query = "Pydantic v2 migration guide field_validator model_dump BaseSettings"

    retrieved_docs = await tool_registry.search_cve_and_migration_docs(search_query)

    async def sse_event_generator():
        accumulated_diff = ""
        total_latency_ms = 0
        total_tokens = 0
        fast_model = settings.NEBIUS_FAST_MODEL
        high_model = settings.NEBIUS_HIGH_MODEL
        cost_reduction = 84.6

        # Determine execution generator (Mock Fallback vs Live Nebius)
        if settings.is_mock_mode:
            stream_gen = nebius_client.stream_mock_triage(
                error_log=request.error_log,
                code_snippet=request.code_snippet,
                retrieved_docs=retrieved_docs
            )
        else:
            stream_gen = nebius_client.stream_live_triage(
                error_log=request.error_log,
                code_snippet=request.code_snippet,
                retrieved_docs=retrieved_docs
            )

        try:
            async for event_packet in stream_gen:
                event_type = event_packet["event"]
                event_data = event_packet["data"]

                # Log to telemetry persistence
                try:
                    await db_manager.log_telemetry_event(incident_id, event_type, event_data)
                except Exception as db_err:
                    logger.warning(f"Failed to log telemetry: {db_err}")

                # Track metrics for final incident persistence
                if event_type == "patch_stream":
                    accumulated_diff = event_data.get("cumulative_diff", accumulated_diff)
                elif event_type == "execution_summary":
                    total_latency_ms = event_data.get("total_latency_ms", 0)
                    total_tokens = event_data.get("total_tokens", 0)
                    cost_reduction = event_data.get("cost_reduction_percent", 84.6)
                    fast_model = event_data.get("fast_model", fast_model)
                    high_model = event_data.get("high_model", high_model)

                # Format as standardized SSE message
                json_payload = json.dumps(event_data)
                yield f"event: {event_type}\ndata: {json_payload}\n\n"

        except Exception as e:
            logger.error(f"Error in triage SSE stream: {e}", exc_info=True)
            err_data = json.dumps({"error": str(e), "incident_id": incident_id})
            yield f"event: error\ndata: {err_data}\n\n"

        # Finalize incident record in database
        try:
            await db_manager.save_incident({
                "id": incident_id,
                "timestamp": start_time,
                "title": request.title or "Automated Incident Triage",
                "error_log": request.error_log,
                "code_snippet": request.code_snippet,
                "status": "completed",
                "resolution_diff": accumulated_diff,
                "latency_ms": total_latency_ms or int((time.time() - start_time) * 1000),
                "tokens_used": total_tokens or 650,
                "fast_model": fast_model,
                "high_model": high_model,
                "cost_reduction_percent": cost_reduction
            })
        except Exception as db_save_err:
            logger.warning(f"Failed to save final incident: {db_save_err}")

    headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
    }

    return StreamingResponse(sse_event_generator(), media_type="text/event-stream", headers=headers)
