import requests
import json
import os
import time

API_URL = "https://archive.org/advancedsearch.php"

COLLECTIONS = [
    "audio_music",
    "opensource_audio",
    "78rpm"
]

ROWS = 200

OUTPUT_FILE = "dataset/tracks.json"


def load_dataset():
    if not os.path.exists(OUTPUT_FILE):
        return []

    with open(OUTPUT_FILE, "r") as f:
        return json.load(f)


def save_dataset(data):
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)


def search_collection(collection):

    query = f'(collection:{collection}) AND (mediatype:audio)'

    params = {
        "q": query,
        "fl[]": ["identifier", "title", "creator"],
        "rows": ROWS,
        "output": "json"
    }

    r = requests.get(API_URL, params=params)

    if r.status_code != 200:
        return []

    data = r.json()

    return data.get("response", {}).get("docs", [])


def main():

    dataset = load_dataset()
    existing_ids = {x["identifier"] for x in dataset}

    new_tracks = []

    for collection in COLLECTIONS:

        print("Scanning collection:", collection)

        results = search_collection(collection)

        for item in results:

            identifier = item["identifier"]

            if identifier in existing_ids:
                continue

            track = {
                "identifier": identifier,
                "title": item.get("title", ""),
                "creator": item.get("creator", ""),
                "source": "archive_org"
            }

            new_tracks.append(track)
            existing_ids.add(identifier)

        time.sleep(1)

    dataset.extend(new_tracks)

    save_dataset(dataset)

    print("Added", len(new_tracks), "collection items")


if __name__ == "__main__":
    main()
