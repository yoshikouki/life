import { Settings } from "frontity/types";

const settings: Settings = {
  "name": "life",
  "state": {
    "frontity": {
      "url": "https://yoshikouki.com/",
      "title": "yoshikouki.life",
      "description": "yoshikouki というIDであちこち出没しています。",
    },
  },
  "packages": [
    {
      "name": "life",
      "state": {
        "theme": {
          "menu": [
            ["Home", "/"],
            ["Works", "/works/"],
            ["Personality", "/personality/"],
          ],
          "featured": {
            "showOnList": false,
            "showOnPost": false,
          },
        },
      },
    },
    {
      "name": "@frontity/wp-source",
      "state": {
        "source": {
          "url": "https://yoshikouki.main.jp",
          "homepage": "/home",
        },
      },
    },
    "@frontity/tiny-router",
    "@frontity/html2react",
  ],
};

export default settings;
