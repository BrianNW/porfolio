import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true" || process.env.STATIC_EXPORT === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPagesRepo = repositoryName.endsWith(".github.io");
const customDomain = process.env.PAGES_CUSTOM_DOMAIN?.trim() ?? "";
const shouldUseRepoBasePath =
  isGitHubPagesBuild && repositoryName && !isUserOrOrgPagesRepo && !customDomain;
const basePath = shouldUseRepoBasePath ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isGitHubPagesBuild
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
