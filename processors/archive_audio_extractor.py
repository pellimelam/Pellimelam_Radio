import requests
import json
import time

DATASET_FILE = "dataset/tracks.json"


def load_dataset():
    with open(DATASET_FILE, "r") as f:
        return json.load(f)


def save_dataset(data):
    with open(DATASET_FILE, "w") as f:
        json.dump(data, f, indent=2)


def get_archive_metadata(identifier):

    url = f"https://archive.org/metadata/{identifier}"

    try:
        r = requests.get(url)
        return r.json()
    except:
        return None


def extract_audio_files(metadata):

    files = metadata.get("files", [])

    audio_urls = []

    for f in files:

        name = f.get("name", "")

        if name.endswith(".mp3") or name.endswith(".ogg") or name.endswith(".flac"):

            url = f"https://archive.org/download/{metadata['metadata']['identifier']}/{name}"

            audio_urls.append(url)

    return audio_urls


def main():

    dataset = load_dataset()

    processed = 0

    for track in dataset:

        if "audio_urls" in track:
            continue

        identifier = track["identifier"]

        print("Processing:", identifier)

        metadata = get_archive_metadata(identifier)

        if not metadata:
            continue

        audio_files = extract_audio_files(metadata)

        if audio_files:
            track["audio_urls"] = audio_files

        processed += 1

        time.sleep(1)

    save_dataset(dataset)

    print("Audio extraction complete")


if __name__ == "__main__":
    main()
