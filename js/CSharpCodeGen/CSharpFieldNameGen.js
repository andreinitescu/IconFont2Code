import CSharpFieldName from "./CSharpFieldName.js";

export default function getCSharpFieldName(glyph, prefixToRemove, importedCSharpFieldMappings, ctx) {
    if (importedCSharpFieldMappings && importedCSharpFieldMappings[glyph.unicode] !== undefined)
        return importedCSharpFieldMappings[glyph.unicode];
    else
        return generateFieldName(glyph.name, prefixToRemove, ctx);
}

function generateFieldName(name, prefixToRemove, ctx) {
    if (typeof name !== 'string' || name.length == 0)
        return autoGenerateFieldName(ctx);

    name = name.replace(/ /g, "");
    name = removePrefix(name, prefixToRemove);
    name = toCamelCase(name);
    name = CSharpFieldName.tryMakeValidName(name);
    name = makeNameUnique(name, ctx.generatedFieldNames);

    if (typeof name !== 'string' || name.length == 0)
        name = autoGenerateFieldName(ctx);

    ctx.generatedFieldNames.push(name);

    return name;

    function removePrefix(name, prefixToRemove) {
        if (!name || !prefixToRemove)
            return name;

        let prefixes = prefixToRemove.split(",");
        let i = 0;
        while (i < prefixes.length) {
            if (name.toLowerCase().startsWith(prefixes[i].toLowerCase())) {
                name = name.substr(prefixes[i].length);
                i = 0;
                continue;
            }
            ++i;
        }
        return name;
    }

    function toCamelCase(name) {
        // Leave single letter names unprocessed
        if (name.length == 1)
            return name;

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

    function autoGenerateFieldName(ctx) {
        if (!ctx.autoGenFieldNamesCount)
            ctx.autoGenFieldNamesCount = 0;

        return `Icon${++ctx.autoGenFieldNamesCount}`;
    }

    // Check and save the generated field names to enfore uniquness
    function makeNameUnique(suggestedName, otherNames) {
        if (typeof suggestedName !== 'string' || !suggestedName)
            return suggestedName;

        if (otherNames.includes(suggestedName)) {
            let index = 0;
            let newName = "";
            do {
                newName = `${suggestedName}_${++index}`;
            } while (otherNames.includes(newName));

            suggestedName = newName;
        }
        else
            return suggestedName;
    }
}