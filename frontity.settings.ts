import Theme from "@frontity/mars-theme-typescript/types";
import WpSource from "@frontity/wp-source/types";
import { Settings } from "frontity/types";

const settings: Settings<Theme | WpSource> = {
  "name": "life",
  "state": {
    "frontity": {
      "url": "https://test.frontity.org",
      "title": "Test Frontity Blog",
      "description": "WordPress installation for Frontity development",
    },
  },
  "packages": [
    {
      "name": "@frontity/twentytwenty-theme",
      "state": {
        "theme": {
          "menu": [
            ["Home", "/"],
            ["Nature", "/category/nature/"],
            ["Travel", "/category/travel/"],
            ["Japan", "/tag/japan/"],
            ["About Us", "/about-us/"],
          ],
          "colors": {
            "primary": "#E6324B",
            "headerBg": "#ffffff",
            "footerBg": "#ffffff",
            "bodyBg": "#f5efe0",
          },
          "showSearchInHeader": true,
          "showAllContentOnArchive": false,
          "featuredMedia": {
            "showOnArchive": true,
            "showOnPost": true,
          },
          "autoPreFetch": "hover",
          "fontSets": "us-ascii",
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
