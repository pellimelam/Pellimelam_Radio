import subprocess

COLLECTORS=[

"collectors/archive_discovery.py",
"collectors/archive_collection_harvester.py",
"collectors/youtube_discovery.py",
"collectors/wikimedia_discovery.py"

]

def main():

    for c in COLLECTORS:

        print("Running:",c)

        subprocess.run(["python",c])


if __name__=="__main__":
    main()