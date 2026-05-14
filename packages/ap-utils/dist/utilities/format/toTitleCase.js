/** Title-cases icon names and similar identifiers for admin labels. */
export function toTitleCase(input) {
    if (!input)
        return '';
    let s = input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    s = s
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1 $2')
        .replace(/[-_]+/g, ' ')
        .replace(/[.\s]+/g, ' ');
    const words = s.split(/\s+/).filter((word) => word.length > 0);
    if (words.length === 0)
        return '';
    const titleCaseWords = words.map((word) => {
        if (/^[A-Z]+$/.test(word))
            return word;
        if (/^[A-Z][a-z]+$/.test(word))
            return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return titleCaseWords.join(' ').trim();
}
//# sourceMappingURL=toTitleCase.js.map