import requests
import json
import os

API="https://commons.wikimedia.org/w/api.php"

OUTPUT_FILE="dataset/tracks.json"

SEARCH_TERMS=[
"nadaswaram",
"shehnai",
"mridangam",
"chenda",
"veena",
"carnatic instrumental"
]


def load_dataset():

    if not os.path.exists(OUTPUT_FILE):
        return []

    with open(OUTPUT_FILE,"r") as f:
        return json.load(f)


def save_dataset(data):

    with open(OUTPUT_FILE,"w") as f:
        json.dump(data,f,indent=2)


def search(term):

    params={
        "action":"query",
        "list":"search",
        "srsearch":term+" filetype:ogg",
        "format":"json"
    }

    r=requests.get(API,params=params)

    return r.json()["query"]["search"]


def main():

    dataset=load_dataset()

    existing={x.get("identifier") for x in dataset}

    new_tracks=[]

    for term in SEARCH_TERMS:

        results=search(term)

        for r in results:

            identifier=r["title"]

            if identifier in existing:
                continue

            track={
                "identifier":identifier,
                "title":identifier,
                "creator":"",
                "source":"wikimedia"
            }

            new_tracks.append(track)
            existing.add(identifier)

    dataset.extend(new_tracks)

    save_dataset(dataset)

    print("Wikimedia tracks added:",len(new_tracks))


if __name__=="__main__":
    main()