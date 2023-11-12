import { nanoid } from "nanoid";

const virtualMod = "simple:scope";

/** @returns {import('vite').Plugin} */
export function simpleScope() {
  /** @type {Record<string, string>} */
  const importerToIdMap = {};

  return {
    name: "simple:scope",
    resolveId(id, rawImporter) {
      if (id === virtualMod) {
        const importer = rawImporter?.replace(/\?.*$/, "");
        importerToIdMap[importer] ??= nanoid(8);
        return `${virtualMod}/${importerToIdMap[importer]}`;
      }
    },
    async load(id) {
      const [maybeVirtualMod, scopeId] = id.split("/");
      if (maybeVirtualMod !== virtualMod || !scopeId) return;

      return `const scopeId = ${JSON.stringify(scopeId)};
export function scope(id) {
    if (!id) return scopeId;

    return id + '-' + scopeId;
}`;
    },
  };
}
