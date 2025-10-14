"""
Quick test script to verify API keys are working
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import get_settings
from app.services.gemini_client import GeminiClient
from app.services.search_client import SearchClient


async def test_gemini():
    """Test Gemini API"""
    print("\n🔍 Testing Gemini API...")
    print("-" * 50)
    
    settings = get_settings()
    print(f"API Key (first 10 chars): {settings.gemini_api_key[:10]}...")
    print(f"Model: {settings.gemini_model}")
    print(f"Demo Mode: {settings.demo_mode}")
    
    try:
        client = GeminiClient()
        result = await client.reconstruct_fragment("brb, mom's on the phone")
        
        print("\n✅ Gemini API is WORKING!")
        print(f"Reconstructed: {result.get('reconstructed_text', '')[:100]}...")
        print(f"Confidence: {result.get('confidence', 0)}")
        print(f"Keywords: {result.get('keywords', [])[:3]}")
        
        return True
    except Exception as e:
        print(f"\n❌ Gemini API FAILED: {str(e)}")
        return False


async def test_google_search():
    """Test Google Custom Search API"""
    print("\n🔍 Testing Google Custom Search API...")
    print("-" * 50)
    
    settings = get_settings()
    print(f"API Key (first 10 chars): {settings.google_api_key[:10]}...")
    print(f"CX ID: {settings.google_cx}")
    
    try:
        client = SearchClient()
        results = await client.search_sources(["dial-up internet", "1990s"], max_results=3)
        
        print("\n✅ Google Search API is WORKING!")
        print(f"Found {len(results)} results:")
        for i, result in enumerate(results[:2], 1):
            print(f"\n  {i}. {result.title[:60]}...")
            print(f"     {result.url[:70]}...")
        
        return True
    except Exception as e:
        print(f"\n❌ Google Search API FAILED: {str(e)}")
        return False


async def main():
    print("=" * 50)
    print("🚀 Project Chronos - API Keys Test")
    print("=" * 50)
    
    gemini_ok = await test_gemini()
    search_ok = await test_google_search()
    
    print("\n" + "=" * 50)
    print("📊 RESULTS SUMMARY")
    print("=" * 50)
    print(f"Gemini API:        {'✅ WORKING' if gemini_ok else '❌ FAILED'}")
    print(f"Google Search API: {'✅ WORKING' if search_ok else '❌ FAILED'}")
    print("=" * 50)
    
    if gemini_ok and search_ok:
        print("\n🎉 ALL APIs are working! You're ready to rock! 🚀")
        return 0
    else:
        print("\n⚠️  Some APIs failed. Check the errors above.")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
