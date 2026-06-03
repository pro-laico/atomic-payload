// Lazy `*?` so a (valid) nested `<svg>` doesn't make the match run to the outer
// document's last `</svg>` and swallow the inner closing tag.
export const extractSvgContent = (svgString) => svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1] || svgString;
export const extractSvgProps = (svgString) => {
    const match = svgString.match(/<svg([^>]*)>/i);
    if (!match)
        return {};
    const props = {};
    // Allow namespaced/hyphenated attribute names (`xmlns:xlink`, `fill-rule`,
    // `xml:space`, `stroke-width`) and both single- and double-quoted values.
    for (const [, key, dq, sq] of match[1].matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))
        props[key] = dq ?? sq ?? '';
    return props;
};
//# sourceMappingURL=extractSVG.js.map