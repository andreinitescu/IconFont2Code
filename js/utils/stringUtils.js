export function toUnicodeString(unicode) {
    let unicodeString = unicode.toString(16);

    let prefix;
    if(unicodeString.length <= 4) {
        unicodeString = unicodeString.padStart(4, "0");
        prefix = "u";
    } else {
        unicodeString = unicodeString.padStart(8, "0");
        // Using codepoints from the upper bit planes (codes >= 0x10000) require a capital U to get properly encoded into a string literal
        prefix = "U";
    }

    return `\\${prefix}${unicodeString}`;
}