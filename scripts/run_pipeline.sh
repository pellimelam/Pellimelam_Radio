#!/bin/bash

cd /opt/pellimelam-music-infrastructure
source venv/bin/activate

echo "Starting music pipeline..."

python collectors/archive_discovery.py
python collectors/archive_collection_harvester.py

python processors/archive_audio_extractor.py
python processors/dataset_cleaner.py
python processors/instrument_classifier.py

python radios/generate_radios.py

echo "Music pipeline completed."
