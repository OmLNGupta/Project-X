import logging
from typing import List, Dict, Any
import httpx
from ..core.config import settings

logger = logging.getLogger("project_x.tools")


class ToolRegistry:
    """
    Registry for tools available to the triage agent.
    Includes Tavily web search integration for CVE and migration documentation lookup,
    with an offline fallback when TAVILY_API_KEY is not configured.
    """

    def __init__(self):
        self.tavily_api_key = settings.TAVILY_API_KEY
        self.is_mock = settings.is_tavily_mock_mode

    async def search_cve_and_migration_docs(self, query: str) -> List[Dict[str, Any]]:
        """
        Search external documentation and vulnerability feeds for migration patterns and CVE fixes.
        If TAVILY_API_KEY is provided, queries the real Tavily Search API.
        Otherwise, returns high-precision curated knowledge bases for instant offline demoing.
        """
        if not self.is_mock and self.tavily_api_key:
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.post(
                        "https://api.tavily.com/search",
                        json={
                            "api_key": self.tavily_api_key,
                            "query": query,
                            "search_depth": "advanced",
                            "include_answer": True,
                            "max_results": 4
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        results = []
                        for item in data.get("results", []):
                            results.append({
                                "title": item.get("title", "External Reference"),
                                "url": item.get("url", "https://tavily.com"),
                                "content": item.get("content", "")[:350],
                                "score": item.get("score", 0.95),
                                "source": "Tavily Live Search"
                            })
                        if results:
                            return results
            except Exception as e:
                logger.warning(f"Tavily live search error, falling back to curated docs: {e}")

        # Curated fallback knowledge base
        q_lower = query.lower()
        if "pydantic" in q_lower or "validator" in q_lower or "model_dump" in q_lower or "basesettings" in q_lower:
            return [
                {
                    "title": "Pydantic V2 Migration Guide - Field Validators & Deprecations",
                    "url": "https://docs.pydantic.dev/latest/migration/#changes-to-validators",
                    "content": "In Pydantic v2, `@validator` is removed and replaced by `@field_validator(mode='after'|'before')` which must be a `@classmethod`. The first parameter is the validated value, and contextual data is provided via `ValidationInfo`.",
                    "score": 0.98,
                    "source": "Official Pydantic v2 Docs"
                },
                {
                    "title": "Pydantic V2 Migration Guide - Exporting Models & Settings",
                    "url": "https://docs.pydantic.dev/latest/migration/#basesettings-has-moved-to-pydantic-settings",
                    "content": "`BaseSettings` has been moved to the standalone `pydantic-settings` library. In addition, `.dict()` has been deprecated in favor of `.model_dump()`, and `.json()` in favor of `.model_dump_json()`.",
                    "score": 0.96,
                    "source": "Pydantic Migration Guide"
                },
                {
                    "title": "Model Configuration in Pydantic v2 (ConfigDict)",
                    "url": "https://docs.pydantic.dev/latest/concepts/config/",
                    "content": "Inner `class Config` is replaced by `model_config = ConfigDict(...)`. To configure schema extras, use `json_schema_extra` instead of `schema_extra`.",
                    "score": 0.94,
                    "source": "Pydantic Documentation"
                }
            ]
        elif "starlette" in q_lower or "lifespan" in q_lower or "fastapi" in q_lower:
            return [
                {
                    "title": "FastAPI Lifespan Events Migration",
                    "url": "https://fastapi.tiangolo.com/advanced/events/#lifespan",
                    "content": "`@app.on_event('startup')` and `@app.on_event('shutdown')` are deprecated. Use the `@asynccontextmanager` lifespan handler on the `FastAPI(lifespan=lifespan)` application constructor.",
                    "score": 0.97,
                    "source": "FastAPI Release Notes"
                }
            ]
        elif "sqlalchemy" in q_lower or "session" in q_lower:
            return [
                {
                    "title": "SQLAlchemy 2.0 Migration - Deprecation of Query API",
                    "url": "https://docs.sqlalchemy.org/en/20/changelog/migration_20.html",
                    "content": "SQLAlchemy 2.0 replaces `session.query(Model)` with the standardized `session.scalars(select(Model))` and `session.execute(select(Model))` 2.0 style syntax.",
                    "score": 0.95,
                    "source": "SQLAlchemy 2.0 Changelog"
                }
            ]
        else:
            return [
                {
                    "title": "Python Exception Diagnostic & Remediation Guidelines",
                    "url": "https://docs.python.org/3/library/exceptions.html",
                    "content": "Standardized runtime exception handling: verify type assertions, ensure null-safety on dictionary indexing via .get(), and wrap unstable external calls in structured try/except blocks.",
                    "score": 0.88,
                    "source": "Python Core Docs"
                }
            ]


tool_registry = ToolRegistry()
