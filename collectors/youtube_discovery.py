import yt_dlp
import json
import os

OUTPUT_FILE="dataset/tracks.json"

SEARCH_TERMS=[
"nadaswaram temple music",
"shehnai instrumental",
"carnatic instrumental concert",
"temple festival nadaswaram",
"chenda melam temple"
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

    opts={
        "skip_download":True,
        "extract_flat":True
    }

    with yt_dlp.YoutubeDL(opts) as ydl:

        info=ydl.extract_info(
            f"ytsearch50:{term}",
            download=False
        )

        return info["entries"]


def main():

    dataset=load_dataset()

    existing={x.get("identifier") for x in dataset}

    new_tracks=[]

    for term in SEARCH_TERMS:

        results=search(term)

        for r in results:

            vid=r["id"]

            if vid in existing:
                continue

            track={
                "identifier":vid,
                "title":r.get("title",""),
                "creator":r.get("channel",""),
                "source":"youtube",
                "audio_urls":[f"https://youtube.com/watch?v={vid}"]
            }

            new_tracks.append(track)
            existing.add(vid)

    dataset.extend(new_tracks)

    save_dataset(dataset)

    print("YouTube tracks added:",len(new_tracks))


if __name__=="__main__":
    main()