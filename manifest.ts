import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Youtube auto bookmark",
  version: packageJson.version,
  description: packageJson.description,
  options_ui: { page: "src/pages/options/index.html", open_in_tab: false },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["https://*.youtube.com/*"],
      js: ["src/pages/content/index.js"],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png",
      ],
      matches: ["*://*/*"],
    },
  ],
  permissions: ["storage", "unlimitedStorage"],
};

export default manifest;
