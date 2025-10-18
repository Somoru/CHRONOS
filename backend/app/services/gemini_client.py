import json
import re
import httpx
import logging
from typing import Dict, Any, Optional
from ..core.config import get_settings

logger = logging.getLogger(__name__)


class GeminiClient:
    def __init__(self, settings):
        self.settings = settings
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
        """
        Build highly specific Gemini prompt for reconstruction.
        Focuses on: slang/abbreviations, cultural references, missing words, temporal context
        """
        return f"""SYSTEM ROLE: You are Chronos, a digital archeologist who LIVED through every internet era. You don't just decode text—you FEEL the vibe, understand the inside jokes, and capture the cultural moment. Your reconstructions are vivid, contextual stories that bring fragments back to life.

YOUR RECONSTRUCTION PHILOSOPHY:
1. **Decode WITH SOUL**: Don't just translate "lol" to "laugh out loud"—explain the FEELING behind why someone typed it
2. **Capture the VIBE**: Every era had a distinct energy. Was it optimistic? Ironic? Chaotic? Nostalgic? Convey that mood
3. **Tell the STORY**: Why was this phrase popular? What social dynamics made it meaningful? What was happening culturally?
4. **Be PLAYFUL**: Internet culture is inherently creative and absurd. Match that energy in your explanations
5. **Show, don't tell**: Instead of "this references X", say "this taps into the moment when X was everywhere and everyone was..."

TONE GUIDELINES:
- Write like a friend reminiscing about the old internet, not a Wikipedia article
- Use phrases like "this was the era when...", "everyone was obsessed with...", "you'd see this everywhere..."
- Add cultural context: what platforms, what trends, what emotions defined that moment
- Explain WHY things were funny/cool/meaningful, not just WHAT they were

CRITICAL INSTRUCTIONS:
- Output MUST be a single, valid JSON object only - no markdown, no explanations outside JSON
- Expand abbreviations AND explain their cultural significance
- Identify the FEELING/MOOD of the era, not just dates
- Preserve the original tone while making it comprehensible to someone who wasn't there
- For missing words, infer from context using era-appropriate language patterns
- Provide era detection based on linguistic style, cultural references, and emotional tone
- Keep reconstructed_text CONCISE (2-4 sentences max) - save the storytelling for the explanation field
- Make explanation RICH but readable (150-250 words ideal) - tell the story without overwhelming

OUTPUT FORMAT (strict JSON):
{{
  "reconstructed_text": "<vivid, contextual reconstruction that captures the original vibe and explains the cultural moment>",
  "explanation": "<rich analysis that tells the STORY: why this language? what was the vibe? what made it resonate? bring the era to life>",
  "missing_words": ["<word1>", "<word2>"],
  "keywords": ["<culturally rich search term 1>", "<search term 2>", "<search term 3>"],
  "era_guess": {{"label": "<time period>", "confidence": <0.0-1.0>, "reasoning": "<explain the FEELING and cultural moment, not just dates>"}},
  "confidence": <0.0-1.0>
}}

ERA LABELS (use these exactly):
- "Classical" (pre-1990s: formal text, literature, pre-digital)
- "Early Internet" (1990s-2000: BBS, IRC, dial-up optimism, "surfing the web", web 1.0 wonder)
- "Web 2.0" (2000-2010: MySpace emo culture, early Facebook intimacy, AIM away message poetry, pre-smartphone)
- "Social Media Era" (2010-2015: Twitter snark, Instagram aesthetics, hashtag activism, rage comics, forever alone energy)
- "Modern Internet" (2015-2020: meme density, Discord communities, Vine/TikTok chaos, irony poisoning, "cursed" humor)
- "Contemporary" (2020+: pandemic chronically-online culture, Gen Z linguistics, mental health openness, "unhinged" as compliment)
- "Unknown" (insufficient temporal markers)

EXAMPLE 1 - Doge Meme (IMPROVED):
Fragment: "such wow. very doge. much amaze. so internet. wow."
Output:
{{
  "reconstructed_text": "Such wow. Very doge. Much amaze. So internet. Wow. This is pure Doge meme speak—the intentionally broken English of a confused but delighted Shiba Inu. It's expressing childlike wonder at something cool ('wow, look at this!'), but filtered through a dog's barely-coherent inner monologue. The awkward grammar IS the joke, and also what made it so endearing.",
  "explanation": "Ah, the Doge meme! This exploded around 2013 from a 2010 photo of Kabosu, a Shiba Inu with a bewildered expression. The syntax—'such', 'very', 'much', 'so' + simple nouns—was intentionally bad English in Comic Sans, creating a voice that felt simultaneously stupid and profound. It was EVERYWHERE: Reddit, Tumblr, Twitter. People used it to express genuine amazement while being ironic about how ridiculous it was to communicate like a confused dog. Early 2010s internet loved this kind of warm, absurdist humor—wholesome but self-aware. It even spawned Dogecoin. This fragment is pure internet delight wrapped in maximum doge energy.",
  "missing_words": [],
  "keywords": ["Doge meme 2013 Reddit Tumblr", "Kabosu Shiba Inu wholesome irony", "such wow very doge syntax", "early 2010s absurdist memes", "broken English internet humor"],
  "era_guess": {{"label": "Social Media Era", "confidence": 0.98, "reasoning": "Peak Doge was 2013-2014, the golden age of Reddit/Tumblr meme culture. The wholesome absurdism and intentionally broken syntax defined early 2010s humor before memes got darker and more surreal."}},
  "confidence": 0.97
}}

EXAMPLE 2 - MySpace Emo (IMPROVED):
Fragment: "smh at the top 8 drama. ppl need to chill. g2g, ttyl."
Output:
{{
  "reconstructed_text": "Shaking my head at all the Top 8 drama happening right now. People need to calm down about this. Gotta go, talk to you later.",
  "explanation": "This is peak mid-2000s MySpace emotional labor. The Top 8 was your public declaration of your closest friends—literally ranked 1-8 on your profile for everyone to see. Moving someone up or down, or removing them entirely, was a STATEMENT. Relationships lived and died over Top 8 placement. This person is exhausted by the social politics of it all ('shaking my head', 'people need to chill'), but they're also participating in the drama by talking about it. The casual sign-off ('g2g, ttyl') was how everyone ended conversations on AIM—quick, lowercase, assumedly continuing later. This was the era when your online social life felt as real as IRL, and digital friend hierarchies caused genuine emotional turmoil. MySpace culture was deeply earnest despite the emo aesthetics.",
  "missing_words": ["Shaking my head", "Top 8", "Gotta go, talk to you later"],
  "keywords": ["MySpace Top 8 drama 2000s", "mid-2000s social media friend ranking", "AIM away message culture", "emo internet teenage social politics"],
  "era_guess": {{"label": "Web 2.0", "confidence": 0.96, "reasoning": "MySpace Top 8 was THE social battleground of 2005-2008, before Facebook's friend lists made everyone equal. The abbreviations (smh, g2g, ttyl) and lowercase urgency scream AIM/SMS messaging culture. This is pre-smartphone, when every social interaction was documented and dissected."}},
  "confidence": 0.93
}}

NOW RECONSTRUCT THIS FRAGMENT:
Fragment: "{fragment}"

Remember: Output only the JSON object, nothing else. Be thorough in decoding slang and cultural references."""

    async def _call_gemini(self, prompt: str) -> str:
        """Make async HTTP call to Gemini API"""
        model_name = self.settings.gemini_model
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
        
        headers = {
            "Content-Type": "application/json",
        }
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 3072,
                "responseMimeType": "application/json"
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
        
        # Handle different response structures from Gemini API
        candidate = result["candidates"][0]
        content = candidate.get("content", {})
        
        if isinstance(content, dict) and "parts" in content:
            parts = content["parts"]
            if parts and isinstance(parts, list) and "text" in parts[0]:
                text = parts[0]["text"]
            else:
                raise Exception(f"No text in parts: {parts}")
        else:
            raise Exception(f"Unexpected content structure: {content}")
        
        return text
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Extract and parse JSON from Gemini response"""
        try:
            # Remove markdown code blocks if present
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]  # Remove ```json
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]  # Remove ```
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]  # Remove trailing ```
            cleaned = cleaned.strip()
            
            # Try to parse the cleaned response as JSON
            parsed = json.loads(cleaned)
            
            # Ensure era_guess has reasoning field if it exists
            if "era_guess" in parsed and isinstance(parsed["era_guess"], dict):
                if "reasoning" not in parsed["era_guess"]:
                    # Add default reasoning based on label
                    parsed["era_guess"]["reasoning"] = f"Classified as {parsed['era_guess'].get('label', 'unknown')} based on linguistic and cultural markers."
            
            return parsed
            
        except json.JSONDecodeError:
            # Look for JSON block within the response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                try:
                    parsed = json.loads(json_match.group())
                    
                    # Ensure era_guess has reasoning field
                    if "era_guess" in parsed and isinstance(parsed["era_guess"], dict):
                        if "reasoning" not in parsed["era_guess"]:
                            parsed["era_guess"]["reasoning"] = f"Classified as {parsed['era_guess'].get('label', 'unknown')} based on linguistic and cultural markers."
                    
                    return parsed
                except json.JSONDecodeError:
                    pass
            
            # If all else fails, create a basic response
            logger.warning(f"Failed to parse JSON from Gemini response: {response}")
            return {
                "reconstructed_text": "Unable to reconstruct fragment",
                "explanation": "Response parsing failed",
                "missing_words": [],
                "keywords": ["text fragment", "reconstruction"],
                "era_guess": {
                    "label": "unknown", 
                    "confidence": 0.1,
                    "reasoning": "Insufficient data for era classification"
                },
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
                "era_guess": {
                    "label": "Web 2.0", 
                    "confidence": 0.92,
                    "reasoning": "MySpace Top 8 was iconic 2005-2008; abbreviations match messaging app usage of that era"
                },
                "confidence": 0.9
            },
            "brb dialup": {
                "reconstructed_text": "Be right back, connecting to the internet via dial-up connection — the phone line is busy, laugh out loud",
                "explanation": "Dial-up internet was common in the late 1990s and required a phone line, often causing conflicts with phone usage.",
                "missing_words": ["Be right back", "dial-up connection", "laugh out loud"],
                "keywords": ["dial-up internet", "1990s internet", "phone line busy"],
                "era_guess": {
                    "label": "Early Internet", 
                    "confidence": 0.95,
                    "reasoning": "Dial-up modems were standard 1995-2003; phone line conflicts and 'lol' usage date to this period"
                },
                "confidence": 0.85
            },
            "to be or not to be": {
                "reconstructed_text": "To be or not to be, that is the question.",
                "explanation": "This is the famous opening line from Shakespeare's Hamlet (Act 3, Scene 1). The missing word 'question' completes one of the most recognizable quotes in English literature.",
                "missing_words": ["question"],
                "keywords": ["Hamlet Shakespeare", "to be or not to be full quote", "Elizabethan literature"],
                "era_guess": {
                    "label": "Classical", 
                    "confidence": 0.98,
                    "reasoning": "Shakespearean English from early 17th century (c. 1600); formal iambic pentameter structure"
                },
                "confidence": 0.99
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
            "era_guess": {
                "label": "Unknown", 
                "confidence": 0.5,
                "reasoning": "Demo mode active - actual era detection requires live AI analysis"
            },
            "confidence": 0.7,
            "tokens_used": 150
        }