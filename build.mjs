import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const result = await build({
  entryPoints: ["src/app.jsx"],
  loader: { ".jsx": "jsx" },
  minify: true,
  charset: "utf8",
  write: false,
});

const js = result.outputFiles[0].text.replace(/<\/script/g, "<\\/script");
const html = readFileSync("src/template.html", "utf8").replace("/*APP*/", () => js);

mkdirSync("docs", { recursive: true });
writeFileSync("docs/index.html", html);
console.log("docs/index.html généré (" + Math.round(html.length / 1024) + " Ko)");
