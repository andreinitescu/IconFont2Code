import { readFileAsText } from '../utils/asyncFileReader.js';


/**
 * Parses C# class which contains field constants for glyphs
 * @param {File} file 
 * @returns {CSharpCodeParserResult} parse result
 */
export function parseCSharpCode(file) {
    return new Promise(async (resolve, reject) => {
        const fileContent = await readFileAsText(file);
        const result = new CSharpCodeParserResult(parseClassName(fileContent), parseGlyphs(fileContent));
        resolve(result);
    });
}

export class CSharpCodeParserResult {
    constructor(className, glyphMappings) {
        this.ClassName = className; // string
        this.GlyphMappings = glyphMappings; // font glyph mappings (integer unicode, string name)
    }
}

function parseClassName(strCode) {
    const regex = /static class ([\w\d]+)\s/gm;
    const m = regex.exec(strCode);
    if (m.length == 2) {
        return m[1];
    }
}

function parseGlyphs(strCode) {
    const regex = /public const string ([\w\d]+)\s*=\s*\"\\u([\w\d]+)\"/gm;
    let m = regex.exec(strCode);

    const mappings = [];
    while ((m = regex.exec(strCode)) !== null) {
        if (m.index === regex.lastIndex)
            regex.lastIndex++;

        if (m.length == 3) {
            mappings[parseInt(m[2], 16)] = m[1];
        }
    }

    return mappings;
}