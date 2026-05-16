/** Merge Tags */
export function mt(stringArray) {
    let returnString = '';
    if (stringArray.length === 0)
        return returnString;
    else
        returnString = stringArray.filter((part) => part != null && part !== '').join(':');
    return returnString;
}
//# sourceMappingURL=mergeTags.js.map