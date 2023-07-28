const execSync = require("child_process").execSync;
const jp = require("jsonpath");

module.exports.templateTags = [
  {
    name: "terminalcommand",
    displayName: "Terminal Command",
    description: "Run terminal command.",
    args: [
      {
        displayName: "Command/shell to be executed",
        description:
          'Executes the given command using require("child_process").exec command',
        type: "string",
      },
      {
        displayName: "Type",
        type: "enum",
        options: [
          {
            displayName: "Execute command returning String value",
            value: "string",
          },
          {
            displayName: "Execute command returning JSON value",
            value: "json",
          },
        ],
      },
      {
        displayName: "JSONPath expression(only for JSON return)",
        description: "Filters json input",
        type: "string",
      },
    ],
    async run(context, cmd, returnType, jsonpath) {
      try {
        var resp = execSync(cmd, { encoding: "utf-8" });
      } catch (failed) {
        console.log("Command execution failed with " + failed);
        return failed.stderr;
      }

      if (returnType === "json") {
        let json = JSON.parse(resp.trim());
        if (jsonpath !== "") {
          return jp.query(json, jsonpath);
        }
        return JSON.stringify(json);
      }
      return resp.trim();
    },
  },
];
