export function generateCsharpCode(glyphs, prefix, csharpClassName) {
    if (!csharpClassName) {
        csharpClassName = "IconFont";
    }

    var s = `static class ${csharpClassName}\n{\n`;
    autoGenFieldNamesCount= 0;

    for (var i = 0; i < glyphs.length; ++i) {
        if (s[s.length - 1] !== '\n') {
            s += '\n';
        }

        s += `\tpublic const string ${getCSharpFieldName(glyphs[i].name, prefix)} = "\\u${glyphs[i].unicode.toString(16)}";`;
    }

    s += "\n}";

    return s;
}

var autoGenFieldNamesCount = 0;

function getCSharpFieldName(name, prefix) {
    if(typeof name !== 'string' || name.length === 0) {
        name = `Icon${++autoGenFieldNamesCount}`;
        return name;
    }

    var name = toCamelCase(name);

    if (prefix) {
        var prefixes = prefix.split(",");
        var i = 0;
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
    var s = "";
    var toUpper = true;
    for (var i = 0; i < name.length; ++i) {
        var c = name[i];
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
    var s = `<OnPlatform x:Key="IconsFontFamily"\n            x:TypedArguments="x:String"\n            Android=\"${fontFileName}#${fontName}\"\n            iOS="${fontName}" />`;
    return htmlEncode(s);
}