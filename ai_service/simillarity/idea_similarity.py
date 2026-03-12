from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embedding(text):

    return model.encode([text])[0]

def compute_similarity(emb1, emb2):

    score = cosine_similarity([emb1], [emb2])[0][0]

    return float(score)