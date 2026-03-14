import json

INPUT_FILE = "dataset/tracks_cleaned.json"
OUTPUT_FILE = "dataset/tracks_classified.json"

INSTRUMENT_MAP = {

    "nadaswaram": [
        "nadaswaram",
        "nagaswaram",
        "nadhaswaram"
    ],

    "shehnai": [
        "shehnai"
    ],

    "indian_saxophone": [
        "carnatic sax",
        "kadri gopalnath",
        "kadri",
        "ragam sax",
        "raga sax",
        "saxophone carnatic"
    ],

    "mridangam": [
        "mridangam"
    ],

    "thavil": [
        "thavil",
        "dolu"
    ],

    "chenda": [
        "chenda",
        "melam"
    ],

    "veena": [
        "veena"
    ],

    "temple_music": [
        "temple",
        "mangala vadyam"
    ],

    "carnatic_instrumental": [
        "carnatic",
        "instrumental"
    ]

}

def load_dataset():
    with open(INPUT_FILE, "r") as f:
        return json.load(f)

def save_dataset(data):
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)

def detect_instrument(track):

    text = (
        str(track.get("title", "")) +
        str(track.get("creator", ""))
    ).lower()

    # special detection for Carnatic sax
    if "sax" in text:
        if any(k in text for k in [
            "carnatic",
            "kadri",
            "ragam",
            "raga",
            "kriti",
            "varnam"
        ]):
            return "indian_saxophone"

    for instrument, keywords in INSTRUMENT_MAP.items():

        for keyword in keywords:

            if keyword in text:
                return instrument

    return "unknown"

def main():

    dataset = load_dataset()

    for track in dataset:

        instrument = detect_instrument(track)

        track["instrument"] = instrument

    save_dataset(dataset)

    print("Classification complete")
    print("Tracks processed:", len(dataset))

if __name__ == "__main__":
    main()
