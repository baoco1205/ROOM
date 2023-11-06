exports.config = {
  specs: [
    // "./test/specs/**/*.js",
    "TestLogin.js",
    // ToDo: define location for spec files here
  ],
  capabilities: [{ browserName: "chrome" }],
  //declare server
  runner: "local",
  hostname: "localhost",
  port: 9515,
  path: "//",
  //Test framework
  framework: "mocha",
  mochaOpts: { ui: "bdd" },
};
