module.exports = {
  //config to generate your manifest json
  manifest: {
    name: "Notifme",
    description: "Extension description here",
    version: "1.0",
    manifest_version: 3,
    background: {
      service_worker: "background.js",
    },
    content_scripts: [
      {
        matches: [
          "<all_urls>"
        ],
        js: [
          "node_modules/@webcomponents/custom-elements/custom-elements.min.js",
          "medium-highlighter.js",
          "content.js",
        ],
      },
    ],
    permissions: ['storage', 'activeTab', 'declarativeContent','tabs'],
    action: {
      default_popup: "index.html",
    },
  },
  //setting your main,background,content or whatever files
  entry: {
    main: "./src/main.js",
    background: "./src/background.js",
    content: "./src/content.js",
  },
};