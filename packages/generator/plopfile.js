/**
 * @param {import('plop').NodePlopAPI} plop
 * @returns {void}
 */
export default function (plop) {
  plop.setGenerator("vite", {
    description: "Create a vite project",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Project name",
        default: "my-vite-project",
      },
      {
        type: "list",
        name: "type",
        message: "Project type",
        choices: [
          { name: "App", value: "apps" },
          { name: "Package", value: "packages" },
        ],
        default: "apps",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "../../{{type}}/{{name}}",
        base: "templates/vite",
        templateFiles: ["templates/vite/**/*", "templates/vite/**/.*"],
        // path: "tmp/{{name}}",
        verbose: true,
      },
      plop.renderString(
        "Run `pnpm i` to install dependencies and initialize the project."
      ),
      // {
      //   type: "add",
      //   destination: "tmp/{{name}}/package.json",
      //   templateFile: "templates/vite/package.json.hbs",
      //   path: "tmp/{{name}}",
      // },
    ],
  });
}
