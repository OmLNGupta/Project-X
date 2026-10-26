import sys
import os

# Ensure repository root is on sys.path so 'backend' package is discoverable by Vercel Serverless
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app

# Export app for Vercel Serverless Python runtime
__all__ = ["app"]
