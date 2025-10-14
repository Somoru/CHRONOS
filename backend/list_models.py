import httpx
import asyncio
import json


async def list_models():
    api_key = "AIzaSyBvmquoah8c8g1TfEbXlIN6VAAbkxkiCHU"
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        
        print("Available Gemini Models:")
        print("=" * 60)
        
        if "models" in data:
            for model in data["models"]:
                name = model.get("name", "").replace("models/", "")
                methods = model.get("supportedGenerationMethods", [])
                
                if "generateContent" in methods:
                    print(f"✅ {name}")
        else:
            print(json.dumps(data, indent=2))


asyncio.run(list_models())
