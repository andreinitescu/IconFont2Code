import { readFileAsText } from '../utils/asyncFileReader.js';

/**
 * 
 * @param {File} file ijmap (IconJar) file to parse
 * @returns {GlyphNameMapper} mapper
 */
export function parseGlyphMappingsFromIconJar(fileContent) {
    return new Promise(async (resolve, reject) => {
        try {
            const icons = JSON.parse(fileContent).icons;
            
            const map = (unicode) => {
                const m = icons[unicode.toString("16")];
                return m !== undefined ? m.name : undefined;
            };

            resolve(map);
        }
        catch (ex) {
            alert("Unable to read the ijmap file. Make sure its format is valid.");
            reject(ex);
        }
    });
}


export class GlyphNameMapper {
    constructor(mappings) {
        this._mappings = mappings;
    }
    getName(unicode) {
        if (unicode === undefined || unicode === null)
            return;
            
        const m = this._mappings[unicode.toString("16")];
        return m !== undefined ? m.name : undefined;
    }
}