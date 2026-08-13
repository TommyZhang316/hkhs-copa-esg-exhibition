import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const outputDirectory = join(process.cwd(), "dist", "client");
const basePath = "/hkhs-copa-esg-exhibition";
const textExtensions = new Set([".css", ".html", ".js", ".json", ".rsc"]);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );
  return nested.flat();
}

function addBasePath(source) {
  return source
    .replaceAll("/_next/", `${basePath}/_next/`)
    .replaceAll("/brand/", `${basePath}/brand/`)
    .replaceAll("/media/", `${basePath}/media/`)
    .replaceAll('href="/en"', `href="${basePath}/en"`)
    .replaceAll('href="/zh-cn"', `href="${basePath}/zh-cn"`)
    .replaceAll('href="/zh-hk"', `href="${basePath}/zh-hk"`)
    .replaceAll('href="/"', `href="${basePath}/"`);
}

const files = await listFiles(outputDirectory);
await Promise.all(
  files
    .filter((file) => textExtensions.has(extname(file)))
    .map(async (file) => {
      const source = await readFile(file, "utf8");
      const updated = addBasePath(source);
      if (updated !== source) await writeFile(file, updated);
    }),
);

await writeFile(join(outputDirectory, ".nojekyll"), "");
console.log(`Prepared ${outputDirectory} for GitHub Pages at ${basePath}.`);
