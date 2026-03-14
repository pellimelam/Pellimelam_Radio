from fastapi import FastAPI
import json
import os
import random

app = FastAPI(title="Pellimelam Music Radio API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RADIO_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "radios", "generated"))


@app.get("/")
def root():
    return {"status": "radio api running"}


@app.get("/radio")
def list_radios():

    radios = []

    for file in os.listdir(RADIO_DIR):
        if file.endswith(".json"):
            radios.append(file.replace(".json", ""))

    return {"radios": radios}


def load_radio(name):

    path = os.path.join(RADIO_DIR, f"{name}.json")

    if not os.path.exists(path):
        return None

    with open(path) as f:
        return json.load(f)


@app.get("/radio/{name}")
def get_radio(name: str, limit: int = 20, offset: int = 0):

    data = load_radio(name)

    if not data:
        return {"error": "radio not found"}

    sliced = data[offset:offset + limit]

    return {
        "radio": name,
        "count": len(data),
        "tracks": sliced
    }


@app.get("/radio/{name}/shuffle")
def shuffle_radio(name: str, limit: int = 20):

    data = load_radio(name)

    if not data:
        return {"error": "radio not found"}

    tracks = random.sample(data, min(limit, len(data)))

    return {
        "radio": name,
        "mode": "shuffle",
        "tracks": tracks
    }


@app.get("/radio/{name}/stream")
def radio_stream(name: str):

    data = load_radio(name)

    if not data:
        return {"error": "radio not found"}

    track = random.choice(data)

    return track
