import CSharpField from "./CSharpField.js";
import { toUnicodeString } from '../utils/stringUtils.js';
import getCSharpFieldName from "./CSharpFieldNameGen.js";

/**
 * Generate the field info array with {name, value}
 * @param {object[]} glyphs
 * @param {object} importedCSharpFieldMappings
 * @param {object} settings
 * @returns {CSharpField[]}
 */
export default function generateCSharpFields(glyphs, importedCSharpFieldMappings, settings) {
    const ctx = {
        generatedFieldNames: []
    };

    return glyphs.map((glyph) => generateCSharpField(glyph, settings.prefix, importedCSharpFieldMappings, ctx));
}

function generateCSharpField(glyph, prefixToRemove, importedCSharpFieldMappings, ctx) {
    return new CSharpField({
        name: getCSharpFieldName(glyph, prefixToRemove, importedCSharpFieldMappings, ctx),
        value: toUnicodeString(glyph.unicode)
    });
}