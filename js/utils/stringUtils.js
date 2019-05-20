export function toUnicodeString(unicode) {
    let unicodeString = unicode.toString(16);

    if(unicodeString.length <= 4) {
        unicodeString = unicodeString.padStart(4, "0");
    } else {
        unicodeString = unicodeString.padStart(8, "0");
    }

    return `\\u${unicodeString}`;
}
