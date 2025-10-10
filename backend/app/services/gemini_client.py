import json
import re
import httpx
import logging
from typing import Dict, Any, Optional
from ..core.config import get_settings

logger = logging.getLogger(__name__)


class GeminiClient:
    def __init__(self):
        self.settings = get_settings()
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def reconstruct_fragment(self, fragment: str) -> Dict[str, Any]:
        """
        Reconstruct text fragment using Gemini with strict JSON output
        """
        if self.settings.demo_mode:
            return await self._get_mock_response(fragment)
        
        try:
            prompt = self._build_prompt(fragment)
            response = await self._call_gemini(prompt)
            parsed_response = self._parse_json_response(response)
            return parsed_response
            
        except Exception as e:
            logger.error(f"Gemini reconstruction failed: {str(e)}")
            # Fallback to mock response
            return await self._get_mock_response(fragment)
    
    def _build_prompt(self, fragment: str) -> str:
        """Build the Gemini prompt with few-shot examples"""
        return f"""SYSTEM: You are Chronos, an AI archeologist. Given a fragment of historical internet text, reconstruct it, list missing words, provide keywords for web search, and guess the era. Respond with a single valid JSON object and nothing else.

Example 1:
Fragment: "smh at the top 8 drama. ppl need to chill. g2g, ttyl."
Output:
{{
 "reconstructed_text": "Shaking my head at the drama around the 'Top 8' friends list on MySpace. People need to calm down. I have to go — talk to you later.",
 "explanation": "'Top 8' refers to MySpace friends list in the mid-2000s; abbreviations are common messaging slang.",
 "missing_words": ["Shaking my head","Top 8","talk to you later"],
 "keywords": ["MySpace top 8","smh meaning","g2g ttyl"],
 "era_guess": {{"label":"mid-2000s","confidence":0.92}},
 "confidence": 0.9
}}

Example 2:
Fragment: "brb, connecting via dialup—phone's busy lol"
Output:
{{
 "reconstructed_text": "Be right back, connecting to the internet via dial-up connection — the phone line is busy, laugh out loud",
 "explanation": "Dial-up internet was common in the late 1990s and required a phone line, often causing conflicts with phone usage.",
 "missing_words": ["Be right back","dial-up connection","laugh out loud"],
 "keywords": ["dial-up internet","1990s internet","phone line busy"],
 "era_guess": {{"label":"late-1990s","confidence":0.95}},
 "confidence": 0.85
}}

Now reconstruct the following fragment. Fragment: "{fragment}"
"""

    async def _call_gemini(self, prompt: str) -> str:
        """Make async HTTP call to Gemini API"""
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
        
        headers = {
            "Content-Type": "application/json",
        }
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        response = await self.client.post(
            f"{url}?key={self.settings.gemini_api_key}",
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"Gemini API error: {response.status_code} - {response.text}")
        
        result = response.json()
        if not result.get("candidates"):
            raise Exception("No response from Gemini")
            
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        return text
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Extract and parse JSON from Gemini response"""
        try:
            # Try to parse the entire response as JSON first
            return json.loads(response.strip())
        except json.JSONDecodeError:
            # Look for JSON block within the response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass
            
            # If all else fails, create a basic response
            logger.warning(f"Failed to parse JSON from Gemini response: {response}")
            return {
                "reconstructed_text": "Unable to reconstruct fragment",
                "explanation": "Response parsing failed",
                "missing_words": [],
                "keywords": ["text fragment", "reconstruction"],
                "era_guess": {"label": "unknown", "confidence": 0.1},
                "confidence": 0.1
            }
    
    async def _get_mock_response(self, fragment: str) -> Dict[str, Any]:
        """Return mock response for demo mode"""
        mock_responses = {
            "smh at the top 8 drama": {
                "reconstructed_text": "Shaking my head at the drama around the 'Top 8' friends list on MySpace. People need to calm down.",
                "explanation": "'Top 8' refers to MySpace friends list in the mid-2000s; abbreviations are common messaging slang.",
                "missing_words": ["Shaking my head", "Top 8"],
                "keywords": ["MySpace top 8", "smh meaning", "social media drama"],
                "era_guess": {"label": "mid-2000s", "confidence": 0.92},
                "confidence": 0.9
            },
            "brb dialup": {
                "reconstructed_text": "Be right back, connecting to the internet via dial-up connection — the phone line is busy, laugh out loud",
                "explanation": "Dial-up internet was common in the late 1990s and required a phone line, often causing conflicts with phone usage.",
                "missing_words": ["Be right back", "dial-up connection", "laugh out loud"],
                "keywords": ["dial-up internet", "1990s internet", "phone line busy"],
                "era_guess": {"label": "late-1990s", "confidence": 0.95},
                "confidence": 0.85
            }
        }
        
        # Find best matching mock response
        fragment_lower = fragment.lower()
        for key, response in mock_responses.items():
            if any(word in fragment_lower for word in key.split()):
                return response
        
        # Default mock response
        return {
            "reconstructed_text": f"[DEMO MODE] Reconstructed version of: {fragment}",
            "explanation": "This is a demo response. In production, Gemini would analyze and reconstruct the fragment.",
            "missing_words": ["demo", "mode"],
            "keywords": ["demo", "reconstruction", "text fragment"],
            "era_guess": {"label": "unknown", "confidence": 0.5},
            "confidence": 0.7,
            "tokens_used": 150
        }