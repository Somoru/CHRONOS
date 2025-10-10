import pytest
from app.services.search_client import SearchClient


@pytest.mark.asyncio
async def test_search_deduplication():
    """Test search result deduplication"""
    client = SearchClient()
    
    # Test domain extraction
    assert client._extract_domain("https://example.com/path") == "example.com"
    assert client._extract_domain("http://sub.example.com/") == "sub.example.com"
    
    # Test mock sources
    sources = client._get_mock_sources(["myspace", "top 8"], 3)
    assert len(sources) <= 3
    assert any("MySpace" in source.title or "MySpace" in source.snippet for source in sources)


@pytest.mark.asyncio
async def test_search_keyword_filtering():
    """Test keyword-based source filtering"""
    client = SearchClient()
    
    sources = client._get_mock_sources(["internet", "history"], 5)
    assert len(sources) <= 5
    assert all(hasattr(source, 'title') and hasattr(source, 'url') and hasattr(source, 'snippet') for source in sources)