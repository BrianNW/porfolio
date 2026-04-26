import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true" || process.env.STATIC_EXPORT === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPagesRepo = repositoryName.endsWith(".github.io");
const customDomain = process.env.PAGES_CUSTOM_DOMAIN?.trim() ?? "";
const shouldUseRepoBasePath =
  isGitHubPagesBuild && repositoryName && !isUserOrOrgPagesRepo && !customDomain;
// REPO_BASEPATH is explicitly set by the CI workflow and takes priority over
// the auto-detected value, so a stale PAGES_CUSTOM_DOMAIN variable can never
// accidentally zero-out the base path.
const basePath =
  process.env.REPO_BASEPATH ||
  (shouldUseRepoBasePath ? `/${repositoryName}` : "");

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
