"""
Global exception handlers for the FastAPI application.

This module defines handlers that catch custom exceptions and convert
them into appropriate HTTP responses. This centralizes error handling
logic and ensures consistent error formats across the API.
"""

import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.exceptions import (
    ChronosException,
    ReconstructionError,
    SearchError,
    DatabaseError,
    InvalidInputError,
)

logger = logging.getLogger(__name__)

async def chronos_exception_handler(request: Request, exc: ChronosException):
    """Handles generic Chronos exceptions."""
    logger.error(f"Chronos error on {request.url.path}: {exc.detail}")
    
    status_code = 500
    if isinstance(exc, InvalidInputError):
        status_code = 400
    elif isinstance(exc, (ReconstructionError, SearchError)):
        status_code = 502  # Bad Gateway, as we depend on external services
    elif isinstance(exc, DatabaseError):
        status_code = 503  # Service Unavailable
        
    return JSONResponse(
        status_code=status_code,
        content={"detail": exc.detail},
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handles FastAPI's built-in HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """Handles all other unhandled exceptions."""
    logger.critical(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal server error occurred."},
    )

def add_exception_handlers(app):
    """Adds all custom exception handlers to the FastAPI app."""
    app.add_exception_handler(ChronosException, chronos_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
