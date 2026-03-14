import json
import os
from collections import defaultdict

INPUT_FILE = "dataset/tracks_classified.json"
OUTPUT_DIR = "radios/generated"

CHUNK_SIZE = 500

os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_dataset():
    with open(INPUT_FILE, "r") as f:
        return json.load(f)


def write_json(path, data):

    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def main():

    dataset = load_dataset()

    radios = defaultdict(list)

    for track in dataset:

        instrument = track.get("instrument")

        if not instrument or instrument == "unknown":
            continue

        for url in track.get("audio_urls", []):

            radios[instrument].append({
                "title": track.get("title", ""),
                "url": url
            })

    categories = []

    for instrument, tracks in radios.items():

        print("Generating radio:", instrument)

        cat_dir = os.path.join(OUTPUT_DIR, instrument)

        os.makedirs(cat_dir, exist_ok=True)

        total = len(tracks)

        pages = (total // CHUNK_SIZE) + 1

        for p in range(pages):

            start = p * CHUNK_SIZE
            end = start + CHUNK_SIZE

            chunk = tracks[start:end]

            if not chunk:
                continue

            filename = os.path.join(cat_dir, f"{p+1}.json")

            write_json(filename, chunk)

        categories.append({
            "id": instrument,
            "name": instrument.replace("_", " ").title()
        })

        print("Tracks:", total)

    write_json(
        os.path.join(OUTPUT_DIR, "categories.json"),
        {"categories": categories}
    )

    print("Radio generation complete")


if __name__ == "__main__":
    main()