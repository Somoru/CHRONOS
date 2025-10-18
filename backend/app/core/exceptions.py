"""
Custom exceptions for the Chronos backend.

This module defines a set of custom exception classes to handle specific
error scenarios in a structured way. Using custom exceptions allows for
more precise error handling and clearer API responses.
"""

class ChronosException(Exception):
    """Base exception class for the application."""
    def __init__(self, detail: str):
        self.detail = detail
        super().__init__(self.detail)

class ReconstructionError(ChronosException):
    """Raised when the AI reconstruction process fails."""
    pass

class SearchError(ChronosException):
    """Raised when the contextual search process fails."""
    pass

class DatabaseError(ChronosException):
    """Raised for database-related errors."""
    pass

class InvalidInputError(ChronosException):
    """Raised for invalid user input."""
    pass
