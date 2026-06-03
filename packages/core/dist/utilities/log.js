import 'server-only';
// Exported both named and default so `@pro-laico/core/logger` works with either
// `import revalidationLogger from …` and `import { revalidationLogger } from …`.
export function revalidationLogger(tags) {
    if (process?.env?.LOGS === 'true')
        console.log('\x1b[38;5;226m%s\x1b[0m', `[Revalidate] - Tags | ${tags.join(' | ')}`);
}
export default revalidationLogger;
//# sourceMappingURL=log.js.map