import aiosqlite
import json
import time
import os
from typing import List, Dict, Any, Optional
from ..core.config import settings


class DatabaseManager:
    """
    Manages SQLite database connections and persistence for incident history
    and real-time agent telemetry logs.
    """

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or settings.DATABASE_PATH
        # Ensure parent directory exists if path includes directories
        dirname = os.path.dirname(self.db_path)
        if dirname:
            os.makedirs(dirname, exist_ok=True)

    async def init_db(self):
        """Initialize database schema with incidents and telemetry tables."""
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS incidents (
                    id TEXT PRIMARY KEY,
                    timestamp REAL NOT NULL,
                    title TEXT NOT NULL,
                    error_log TEXT,
                    code_snippet TEXT,
                    status TEXT NOT NULL,
                    resolution_diff TEXT,
                    latency_ms INTEGER,
                    tokens_used INTEGER,
                    fast_model TEXT,
                    high_model TEXT,
                    cost_reduction_percent REAL
                )
            """)

            await db.execute("""
                CREATE TABLE IF NOT EXISTS telemetry_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    incident_id TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    timestamp REAL NOT NULL,
                    FOREIGN KEY(incident_id) REFERENCES incidents(id)
                )
            """)
            await db.commit()

    async def save_incident(self, data: Dict[str, Any]):
        """Persist or update an incident record."""
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT OR REPLACE INTO incidents (
                    id, timestamp, title, error_log, code_snippet,
                    status, resolution_diff, latency_ms, tokens_used,
                    fast_model, high_model, cost_reduction_percent
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data["id"],
                data.get("timestamp", time.time()),
                data.get("title", "Incident Triage"),
                data.get("error_log", ""),
                data.get("code_snippet", ""),
                data.get("status", "completed"),
                data.get("resolution_diff", ""),
                data.get("latency_ms", 0),
                data.get("tokens_used", 0),
                data.get("fast_model", settings.NEBIUS_FAST_MODEL),
                data.get("high_model", settings.NEBIUS_HIGH_MODEL),
                data.get("cost_reduction_percent", 84.6)
            ))
            await db.commit()

    async def log_telemetry_event(self, incident_id: str, event_type: str, payload: Dict[str, Any]):
        """Persist a streaming telemetry event associated with an incident."""
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO telemetry_logs (incident_id, event_type, payload, timestamp)
                VALUES (?, ?, ?, ?)
            """, (
                incident_id,
                event_type,
                json.dumps(payload),
                time.time()
            ))
            await db.commit()

    async def get_recent_incidents(self, limit: int = 15) -> List[Dict[str, Any]]:
        """Retrieve the most recent incidents."""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT * FROM incidents ORDER BY timestamp DESC LIMIT ?
            """, (limit,))
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    async def get_incident_by_id(self, incident_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve details for a single incident along with its telemetry."""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
            row = await cursor.fetchone()
            if not row:
                return None
            
            incident = dict(row)
            
            # Fetch telemetry logs
            cursor = await db.execute("""
                SELECT event_type, payload, timestamp FROM telemetry_logs
                WHERE incident_id = ? ORDER BY timestamp ASC
            """, (incident_id,))
            telemetry_rows = await cursor.fetchall()
            incident["telemetry"] = [
                {
                    "event_type": r["event_type"],
                    "payload": json.loads(r["payload"]),
                    "timestamp": r["timestamp"]
                }
                for r in telemetry_rows
            ]
            return incident


db_manager = DatabaseManager()
