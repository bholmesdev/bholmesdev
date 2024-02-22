export function isMatch(urlPath: string, linkPath: string) {
  if (linkPath === "/") return urlPath === "/";
  return urlPath.startsWith(linkPath);
}
