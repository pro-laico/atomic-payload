export default function manualLogger(message) {
    // Match tags case-insensitively — callers emit upper-case (`[ERROR]`, `[STORE]`)
    // while older code used title-case (`[Error]`), so normalize before comparing.
    const m = message.toUpperCase();
    let color;
    if (m.includes('[INFO]') || m.includes('[STORE]') || m.includes('[UPDATE]') || m.includes('[GENERATE]'))
        color = '\x1b[38;5;117m%s\x1b[0m';
    if (m.includes('[WARNING]'))
        color = '\x1b[38;5;208m%s\x1b[0m';
    if (m.includes('[ERROR]'))
        color = '\x1b[38;5;196m%s\x1b[0m';
    if (m.includes('[PREVIEW]'))
        color = '\x1b[38;5;226m%s\x1b[0m';
    if (process?.env?.LOGS === 'true')
        console.log(color, message);
}
//# sourceMappingURL=manualLogger.js.map