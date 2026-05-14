import manualLogger from '../utilities/manualLogger';
import generatePreflights from './generatePreflights';
function processTokenString(input) {
    if (!input)
        return {};
    return input.reduce((acc, item) => {
        if (item.name && item.value)
            acc[item.name] = item.value;
        return acc;
    }, {});
}
function processTokenStringArray(input) {
    if (!input)
        return {};
    return input.reduce((acc, item) => {
        if (item.name && Array.isArray(item.values)) {
            const values = item.values.map((val) => val.value).filter((val) => val !== undefined);
            acc[item.name] = values;
        }
        return acc;
    }, {});
}
function processProperty(input) {
    if (!input)
        return {};
    return input.reduce((acc, item) => {
        if (item.name && Array.isArray(item.values)) {
            const values = item.values.map((val) => val.value).filter((val) => val !== undefined);
            acc[item.name] = values.join(',');
        }
        return acc;
    }, {});
}
function generateUnoFonts(fonts) {
    if (!fonts)
        return {};
    return { mono: `var(--font-setMono)`, sans: `var(--font-setSans)`, serif: `var(--font-setSerif)`, display: `var(--font-setDisplay)` };
}
function generateUnoAnimation(input) {
    if (!input)
        return {};
    return {
        category: input.reduce((acc, i) => {
            if (i.name && i.category)
                acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.category;
            return acc;
        }, {}),
        keyframes: input.reduce((acc, i) => {
            if (i.name && i.keyframes)
                acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.keyframes;
            return acc;
        }, {}),
        durations: input.reduce((acc, i) => {
            if (i.name && i.duration)
                acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.duration;
            return acc;
        }, {}),
        timingFns: input.reduce((acc, i) => {
            if (i.name && i.timingFns)
                acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.timingFns;
            return acc;
        }, {}),
        counts: input.reduce((acc, i) => {
            if (i.name && i.counts)
                acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.counts;
            return acc;
        }, {}),
    };
}
function processColors(input) {
    if (!input)
        return {};
    return input.reduce((acc, color) => {
        if (!color?.name)
            return acc;
        acc[color.name] = `var(--${color.name})`;
        return acc;
    }, {});
}
function processAria(input) {
    if (!input)
        return {};
    return input.reduce((acc, item) => {
        if (item.value)
            acc[item.value] = `${item.value}="${item.value}"`;
        return acc;
    }, {});
}
function processProseColor(input) {
    if (!input)
        return {};
    return Object.entries(input).reduce((acc, [name, item]) => {
        acc[name] = [item.light, item.dark];
        return acc;
    }, {});
}
function processProseTagStyles(input) {
    if (!input)
        return {};
    return input.reduce((acc, { tag, psuedoClass, values }) => {
        if (!values || !tag)
            return acc;
        const fullTag = psuedoClass ? `${tag}${psuedoClass}` : tag;
        acc[fullTag] ??= {};
        for (const { cssSelector, value } of values)
            acc[fullTag][cssSelector] = value;
        return acc;
    }, {});
}
const processDesignSet = (ds) => {
    const animationRows = (ds?.animation ?? null);
    const tokenStorage = {
        colors: processColors(ds.colors || []),
        variables: {
            spacing: ds.defaults?.spacing || '0.25rem',
            radius: ds.defaults?.radius || '0.625rem',
            ...processTokenString(ds?.variables),
        },
        ease: processTokenString(ds?.ease),
        animation: generateUnoAnimation(animationRows),
        property: processProperty(ds?.property),
        aria: processAria(ds?.aria),
        blur: processTokenString(ds?.blur),
        media: processTokenString(ds?.media),
        supports: processTokenString(ds?.supports),
        perspective: processTokenString(ds?.perspective),
        shadow: processTokenStringArray(ds?.shadow),
        textShadow: processTokenStringArray(ds?.textShadow),
        dropShadow: processTokenStringArray(ds?.dropShadow),
        insetShadow: processTokenStringArray(ds?.insetShadow),
        radius: processTokenString(ds?.radius),
        spacing: processTokenString(ds?.spacing),
        container: processTokenString(ds?.container),
        breakpoint: processTokenString(ds?.breakpoint),
        font: generateUnoFonts(ds?.font),
        leading: processTokenString(ds?.leading),
        tracking: processTokenString(ds?.tracking),
        fontWeight: processTokenString(ds?.fontWeight),
        textStrokeWidth: processTokenString(ds?.textStrokeWidth),
    };
    const preflightStorage = generatePreflights({ ds });
    ds.proseColorStorage = processProseColor(ds.proseColors);
    const proseStyles = ds?.proseStyles;
    ds.proseDefaultStorage = processProseTagStyles(proseStyles?.default);
    ds.prosesmStorage = processProseTagStyles(proseStyles?.sm);
    ds.proseBaseStorage = processProseTagStyles(proseStyles?.base);
    ds.proselgStorage = processProseTagStyles(proseStyles?.lg);
    ds.tokenStorage = tokenStorage;
    ds.preflightStorage = preflightStorage;
    ds.updatedAt = new Date().toISOString();
    manualLogger(`[STORE] - Design Set - ${ds?.title}`);
};
export default processDesignSet;
//# sourceMappingURL=index.js.map