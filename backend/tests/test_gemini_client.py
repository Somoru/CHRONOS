import pytest
import json
from app.services.gemini_client import GeminiClient


@pytest.mark.asyncio
async def test_gemini_json_parsing():
    """Test JSON parsing robustness"""
    client = GeminiClient()
    
    # Test valid JSON
    valid_response = """
    {
        "reconstructed_text": "Test reconstruction",
        "explanation": "Test explanation",
        "missing_words": ["test"],
        "keywords": ["test", "keyword"],
        "era_guess": {"label": "test-era", "confidence": 0.8},
        "confidence": 0.9
    }
    """
    
    result = client._parse_json_response(valid_response)
    assert result["reconstructed_text"] == "Test reconstruction"
    assert result["confidence"] == 0.9
    
    # Test JSON with extra text
    messy_response = """
    Here's the analysis:
    {
        "reconstructed_text": "Test reconstruction",
        "explanation": "Test explanation", 
        "missing_words": ["test"],
        "keywords": ["test"],
        "era_guess": {"label": "test", "confidence": 0.8},
        "confidence": 0.9
    }
    Additional commentary...
    """
    
    result = client._parse_json_response(messy_response)
    assert result["reconstructed_text"] == "Test reconstruction"
    
    # Test invalid JSON - should return fallback
    invalid_response = "This is not JSON at all"
    result = client._parse_json_response(invalid_response)
    assert "reconstructed_text" in result
    assert result["confidence"] == 0.1


@pytest.mark.asyncio  
async def test_mock_response():
    """Test demo mode responses"""
    client = GeminiClient()
    
    result = await client._get_mock_response("smh at the top 8")
    assert "MySpace" in result["explanation"]
    assert result["era_guess"]["label"] == "mid-2000s"
    
    result = await client._get_mock_response("unknown fragment")
    assert "[DEMO MODE]" in result["reconstructed_text"]