import { nanoid } from 'nanoid';

const virtualMod = 'simple:scope';
const resolvedVirtualMod = '\0' + virtualMod;

/** @returns {import('vite').Plugin} */
export function simpleScope() {
    return {
        name: 'simple:scope',
        resolveId(id, importer) {
            if (id === virtualMod) {
                return `${resolvedVirtualMod}?importer=${encodeURIComponent(importer)}`;
            }
        },
        async load(id) {
            if (!id.startsWith(resolvedVirtualMod)) return;

            const scopedId = nanoid(8);

            return `const scopedId = ${JSON.stringify(scopedId)};
            export function scope(id) {
                if (!id) return scopedId;

                return id + '-' + scopedId;
            }`
        }
    }
}
