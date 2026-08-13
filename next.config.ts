import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "1";
const githubBasePath = process.env.GITHUB_PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages && githubBasePath ? githubBasePath : undefined,
  assetPrefix: isGitHubPages && githubBasePath ? githubBasePath : undefined,
  trailingSlash: false,
};

export default nextConfig;
