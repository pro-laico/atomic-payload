export const extractSvgContent = (svgString) => svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)?.[1] || svgString;
export const extractSvgProps = (svgString) => {
    const match = svgString.match(/<svg([^>]*)>/i);
    if (!match)
        return {};
    const props = {};
    for (const [, key, value] of match[1].matchAll(/(\w+)="([^"]*)"/g))
        props[key] = value;
    return props;
};
//# sourceMappingURL=extractSVG.js.map