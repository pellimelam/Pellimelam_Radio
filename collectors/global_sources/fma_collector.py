import requests
import json
import os

OUTPUT_FILE = "dataset/tracks.json"

SEARCH_TERMS = [
    "carnatic",
    "indian classical",
    "instrumental",
    "traditional"
]


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

        url = f"https://freemusicarchive.org/api/get/tracks.json?search={term}"

        r = requests.get(url)

        if r.status_code != 200:
            continue

        data = r.json()

        for track in data.get("dataset", []):

            identifier = "fma_" + str(track["track_id"])

            if identifier in existing_ids:
                continue

            audio_url = track.get("track_file")

            if not audio_url:
                continue

            item = {
                "identifier": identifier,
                "title": track.get("track_title", ""),
                "creator": track.get("artist_name", ""),
                "source": "free_music_archive",
                "audio_urls": [audio_url]
            }

            new_tracks.append(item)
            existing_ids.add(identifier)

    dataset.extend(new_tracks)

    save_dataset(dataset)

    print("FMA collector added", len(new_tracks), "tracks")


if __name__ == "__main__":
    main()
