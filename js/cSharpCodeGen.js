import { toUnicodeString } from './utils/stringUtils.js';

export function generateCsharpCode(glyphs, prefix, csharpClassName, importedCSharpFieldMappings, isSorted) {
    if (!csharpClassName) {
        csharpClassName = "IconFont";
    }

    let s = `static class ${csharpClassName}\n{`;
    autoGenFieldNamesCount = 0;

    if (!isSorted) {
        for (let i = 0; i < glyphs.length; ++i) {
            s += `\n\tpublic const string ${getCSharpFieldNameWithMappings(glyphs[i], prefix, importedCSharpFieldMappings)} = "${toUnicodeString(glyphs[i].unicode)}";`;
        }
    } else {
        let fieldNames = [];

        let fields = {};
        for (let i = 0; i < glyphs.length; ++i) {
            let fieldName = getCSharpFieldNameWithMappings(glyphs[i], prefix, importedCSharpFieldMappings);
            fieldNames.push(fieldName);
            fields[fieldName] = `\n\tpublic const string ${fieldName} = "${toUnicodeString(glyphs[i].unicode)}";`;
        }

        fieldNames.sort();

        for (let i = 0; i < glyphs.length; ++i) {
            let fieldName = fieldNames[i];
            s += fields[fieldName];
        }
    }

    s += "\n}";

    return s;
}

let autoGenFieldNamesCount = 0;

function getCSharpFieldNameWithMappings(glyph, prefix, importedCSharpFieldMappings) {
    if (importedCSharpFieldMappings && importedCSharpFieldMappings[glyph.unicode] !== undefined)
        return importedCSharpFieldMappings[glyph.unicode];
    else
        return getCSharpFieldName(glyph.name, prefix);
}

function getCSharpFieldName(name, prefix) {
    if (typeof name !== 'string' || name.length === 0) {
        name = `Icon${++autoGenFieldNamesCount}`;
        return name;
    }

    name = name.replace(/ /g, "");

    // Leave single letter names unprocessed
    if (name.length == 1)
        return name;

    name = toCamelCase(name);

    if (prefix) {
        let prefixes = prefix.split(",");
        let i = 0;
        while (i < prefixes.length) {
            if (name.toLowerCase().startsWith(prefixes[i].toLowerCase())) {
                name = name.substr(prefixes[i].length);
                i = 0;
                continue;
            }
            ++i;
        }
    }

    return name;
}

function toCamelCase(name) {
    let s = "";
    let toUpper = true;
    for (let i = 0; i < name.length; ++i) {
        let c = name[i];
        if (c == '-') {
            toUpper = true;
        }
        else {
            s += toUpper ? c.toUpperCase() : c;
            toUpper = false;
        }
    }
    return s;
}

function generateXAMLCode(fontName, fontFileName) {
    const s = `<OnPlatform x:Key="IconsFontFamily"\n            x:TypedArguments="x:String"\n            Android=\"${fontFileName}#${fontName}\"\n            iOS="${fontName}" />`;
    return htmlEncode(s);
}