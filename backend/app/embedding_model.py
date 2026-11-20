from sentence_transformers import SentenceTransformer
from starlette.concurrency import run_in_threadpool

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

async def generate_embeddings(text: str) -> list[float]:
    return (await run_in_threadpool(model.encode, text, normalize_embeddings=True)).tolist()

async def generate_embedding_batch(texts: list[str]) -> list[list[float]]:
    return (await run_in_threadpool(
        model.encode,
        texts,
        normalize_embeddings=True,
        batch_size=64,
    )).tolist()