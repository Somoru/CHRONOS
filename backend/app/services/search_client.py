import httpx
import logging
from typing import List, Dict, Any, Set
from urllib.parse import quote_plus
from ..core.config import get_settings
from ..models.schemas import ContextualSource

logger = logging.getLogger(__name__)


class SearchClient:
    def __init__(self, settings):
        self.settings = settings
        self.client = httpx.AsyncClient(timeout=15.0)
        self.cache = {}  # Simple in-memory cache
        
    async def search_sources(self, keywords: List[str], max_results: int = 5) -> List[ContextualSource]:
        """
        Search for contextual sources using Google Custom Search
        """
        if self.settings.demo_mode:
            return self._get_mock_sources(keywords, max_results)
        
        try:
            all_results = []
            seen_domains = set()
            
            for keyword in keywords[:3]:  # Limit to first 3 keywords
                cache_key = f"search_{keyword}_{max_results}"
                if cache_key in self.cache:
                    results = self.cache[cache_key]
                else:
                    results = await self._search_google(keyword)
                    self.cache[cache_key] = results
                
                # Add unique results (avoid domain duplication)
                for result in results:
                    domain = self._extract_domain(result['url'])
                    if domain not in seen_domains and len(all_results) < max_results:
                        all_results.append(ContextualSource(
                            title=result['title'],
                            url=result['url'],
                            snippet=result['snippet']
                        ))
                        seen_domains.add(domain)
            
            return all_results[:max_results]
            
        except Exception as e:
            logger.error(f"Search failed: {str(e)}")
            return self._get_mock_sources(keywords, max_results)
    
    async def _search_google(self, query: str) -> List[Dict[str, Any]]:
        """Call Google Custom Search API"""
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": self.settings.google_api_key,
            "cx": self.settings.google_cx,
            "q": quote_plus(query),
            "num": 5
        }
        
        response = await self.client.get(url, params=params)
        
        if response.status_code != 200:
            raise Exception(f"Google Search API error: {response.status_code}")
        
        data = response.json()
        results = []
        
        for item in data.get('items', []):
            results.append({
                'title': item.get('title', ''),
                'url': item.get('link', ''),
                'snippet': item.get('snippet', '')
            })
        
        return results
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL for deduplication"""
        try:
            from urllib.parse import urlparse
            return urlparse(url).netloc.lower()
        except:
            return url
    
    def _get_mock_sources(self, keywords: List[str], max_results: int) -> List[ContextualSource]:
        """Return mock sources for demo mode"""
        mock_sources = [
            ContextualSource(
                title="The History of Internet Slang and Abbreviations",
                url="https://example.com/internet-slang-history",
                snippet="Comprehensive guide to understanding internet abbreviations and their evolution through different eras of online communication."
            ),
            ContextualSource(
                title="MySpace and Early Social Media Culture",
                url="https://example.com/myspace-culture",
                snippet="An in-depth look at MySpace's impact on social media, including the famous 'Top 8' friends feature that defined early 2000s social networking."
            ),
            ContextualSource(
                title="Dial-up Internet: The Early Days of Online Connection",
                url="https://example.com/dialup-internet",
                snippet="Exploring the era of dial-up internet connections, phone line conflicts, and the unique challenges of early internet access."
            ),
            ContextualSource(
                title="Evolution of Digital Communication",
                url="https://example.com/digital-communication",
                snippet="How online communication has evolved from simple text to complex digital interactions, including the rise and fall of various platforms."
            ),
            ContextualSource(
                title="Linguistics of Internet Culture",
                url="https://example.com/internet-linguistics",
                snippet="Academic analysis of how internet culture has influenced language evolution and the development of digital native communication patterns."
            )
        ]
        
        # Return relevant sources based on keywords
        relevant_sources = []
        for source in mock_sources:
            if any(keyword.lower() in source.snippet.lower() or keyword.lower() in source.title.lower() 
                   for keyword in keywords):
                relevant_sources.append(source)
        
        # Fill with general sources if not enough relevant ones
        while len(relevant_sources) < max_results and len(relevant_sources) < len(mock_sources):
            for source in mock_sources:
                if source not in relevant_sources:
                    relevant_sources.append(source)
                    break
        
        return relevant_sources[:max_results]