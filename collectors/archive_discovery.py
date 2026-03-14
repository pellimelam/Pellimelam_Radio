import requests
import json
import os
import time

API_URL = "https://archive.org/advancedsearch.php"

SEARCH_TERMS = [
    "nadaswaram",
    "nagaswaram",
    "shehnai",
    "thavil",
    "mridangam",
    "chenda melam",
    "carnatic instrumental",
    "temple music india",
    "south indian temple music",
    "indian classical instrumental"
]

ROWS = 200

OUTPUT_FILE = "dataset/tracks.json"


def search_archive(term):

    query = f'(mediatype:audio) AND ({term}) AND (collection:opensource_audio OR collection:audio_music)'

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


def load_dataset():

    if not os.path.exists(OUTPUT_FILE):
        return []

    with open(OUTPUT_FILE, "r") as f:
        return json.load(f)


def save_dataset(data):

    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)


def main():

    dataset = load_dataset()

    existing_ids = {x["identifier"] for x in dataset}

    new_tracks = []

    for term in SEARCH_TERMS:

        print("Searching:", term)

        results = search_archive(term)

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

    print("Added", len(new_tracks), "new archive items")


if __name__ == "__main__":
    main()
