import json

INPUT="dataset/tracks.json"
OUTPUT="dataset/tracks_cleaned.json"

KEYWORDS=[

"nadaswaram",
"nagaswaram",
"nadhaswaram",

"shehnai",

"mridangam",

"saxophone",
"carnatic sax",
"kadri gopalnath",

"thavil",
"dolu",

"chenda",
"melam",

"veena",

"temple",
"mangala vadyam",

"carnatic",
"instrumental"

]

def text(v):

    if isinstance(v,list):
        return " ".join(v)

    return str(v)

data=json.load(open(INPUT))

clean=[]

for t in data:

    if "audio_urls" not in t:
        continue

    s=(text(t.get("title"))+" "+text(t.get("creator"))).lower()

    for u in t.get("audio_urls",[]):
        s+=" "+u.lower()

    # filter relevant traditional music
    if not any(k in s for k in KEYWORDS):
        continue

    # special filter for saxophone (remove western sax)
    if "sax" in s:

        if not any(k in s for k in [
            "carnatic",
            "kadri",
            "ragam",
            "raga",
            "kriti",
            "varnam"
        ]):
            continue

    clean.append(t)

json.dump(clean,open(OUTPUT,"w"),indent=2)

print("cleaned tracks:",len(clean))
