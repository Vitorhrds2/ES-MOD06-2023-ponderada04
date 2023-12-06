import httpx
from typing import Optional

async def generate_story_part(prompt: str) -> Optional[str]:
    url = "https://api.inferkit.com/v1/models/standard/generate?useDemoCredits=true"
    headers = {"Content-Type": "application/json", "accept": "application/json"}

    data = {
        "prompt": {"text": prompt,
                   "isContinuation": True,
                   "promptType": "user",
                   "numTokens": 100,
                   "maxTokens": 100},
        "length": 200
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=data, timeout=30)
        except httpx.ReadTimeout:
            print("A requisição excedeu o tempo limite. Verifique a conexão com a API.")
        except httpx.RequestError as e:
            print(f"Erro na requisição: {e}")
        except Exception as e:
            print(f"Erro inesperado: {e}")


    try:
        response_data = response.json().get("data", {})
        return response_data.get("text", "").strip()
    except Exception as e:
        print(f"Erro ao processar resposta da API: {e}")
        return None