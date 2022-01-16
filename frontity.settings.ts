import WpSource from "@frontity/wp-source/types";
import { Settings } from "frontity/types";
import Theme from "life/types";

const settings: Settings<Theme | WpSource> = {
  "name": "life",
  "state": {
    "frontity": {
      "url": "https://yoshikouki.com/",
      "title": "yoshikouki",
      "description": "yoshikouki というIDであちこち出没しています。",
    },
  },
  "packages": [
    {
      "name": "life",
      "state": {
        "theme": {
          "menu": [
            [
              "Home",
              "/",
            ],
            [
              "Nature",
              "/category/nature/",
            ],
            [
              "Travel",
              "/category/travel/",
            ],
            [
              "Japan",
              "/tag/japan/",
            ],
            [
              "About Us",
              "/about-us/",
            ],
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
          "url": "https://test.frontity.org",
        },
      },
    },
    "@frontity/tiny-router",
    "@frontity/html2react",
  ],
};

export default settings;
