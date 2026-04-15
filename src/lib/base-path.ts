const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

export function withBasePath(path: string) {
  if (!path) {
    return configuredBasePath || "/";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${configuredBasePath}${normalizedPath}`;
}