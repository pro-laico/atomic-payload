import 'server-only';
export default function revalidationLogger(tags) {
    if (process?.env?.LOGS === 'true')
        console.log('\x1b[38;5;226m%s\x1b[0m', `[Revalidate] - Tags | ${tags.join(' | ')}`);
}
//# sourceMappingURL=log.js.map