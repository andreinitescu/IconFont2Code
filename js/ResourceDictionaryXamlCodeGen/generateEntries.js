import getCSharpFieldName from "../CSharpCodeGen/CSharpFieldNameGen.js";
import Entry from "./Entry.js";

/**
 * 
 * @param {Array} glyphs 
 * @param {*} importedCSharpFieldMappings 
 * @param {*} settings 
 * @returns Entry[]
 */
export default function generateEntries(glyphs, importedCSharpFieldMappings, settings) {
    const ctx = {
        generatedFieldNames: []
    };

    return glyphs.map((glyph) => generateEntry({
        glyph,
        importedCSharpFieldMappings,
        settings,
        ctx
    }));
}

function generateEntry({ glyph, importedCSharpFieldMappings, settings, ctx }) {
    return new Entry({
        key: generateEntryKey({ glyph, importedCSharpFieldMappings, settings, ctx }),
        value: generateEntryValue(glyph.unicode)
    });
}

function generateEntryKey({ glyph, settings, importedCSharpFieldMappings, ctx }) {
    const v = getCSharpFieldName(glyph, settings.prefix, importedCSharpFieldMappings, ctx);

    return `${settings.keyPrefix}${v}`;
}

function generateEntryValue(unicode) {
    let unicodeString = unicode.toString(16);
    return `&#x${unicodeString};`;
}
