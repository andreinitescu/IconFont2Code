export function toUnicodeString(unicode) {
    let unicodeString = unicode.toString(16);

    let prefix;
    if(unicodeString.length <= 4) {
        unicodeString = unicodeString.padStart(4, "0");
        prefix = "u";
    } else {
        unicodeString = unicodeString.padStart(8, "0");
        prefix = "U";
    }

    return `\\${prefix}${unicodeString}`;
}