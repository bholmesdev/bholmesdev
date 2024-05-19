import { createHash } from "node:crypto";

export function getVisitorId({
  request,
}: {
  request: Request;
}): string | undefined {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip) return undefined;

  return createHash("sha256").update(ip).digest("hex");
}
