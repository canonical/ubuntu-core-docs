#! /usr/bin/env python

import os

import requests


BASE_URL = "https://api.github.com/repos/canonical/documentation-style-guide/contents"


def download_directory(path):
    destination = os.path.join(".sphinx", path)
    os.makedirs(destination, exist_ok=True)
    response = requests.get(f"{BASE_URL}/{path}", timeout=30)
    response.raise_for_status()
    for item in response.json():
        if item["type"] != "file":
            continue
        download = requests.get(item["download_url"], timeout=30)
        download.raise_for_status()
        with open(os.path.join(destination, item["name"]), "wb") as file:
            file.write(download.content)


def main():
    download_directory("styles/Canonical")
    download_directory("styles/config/vocabularies/Canonical")
    download_directory("styles/config/dictionaries")
    config = requests.get(
        "https://raw.githubusercontent.com/canonical/documentation-style-guide/main/vale.ini",
        timeout=30,
    )
    config.raise_for_status()
    with open(".sphinx/vale.ini", "wb") as file:
        file.write(config.content)


if __name__ == "__main__":
    main()
