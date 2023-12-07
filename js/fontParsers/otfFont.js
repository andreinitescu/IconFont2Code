import { readFileAsArrayBuffer } from '../utils/asyncFileReader.js';
import EnhancedFile from '../utils/enhancedFile.js';


export class OpenTypeFontFactory {
    async createFontAsync(file) {
        try {
            const fontArrayBuffer = await OpenTypeFontFactory._getUncompressedArrayBufferAsync(file);
            const font = opentype.parse(fontArrayBuffer);

            return new OpenTypeFont(file.name, font);
        }
        catch (ex) {
            alert('Unable to open the font file.\nConsider opening an issue in the GitHub repo with information how to reproduce the issue.');
            throw (ex);
        }
    }

    static async _getUncompressedArrayBufferAsync(fontFile) {
        const fontArrayBuffer = await readFileAsArrayBuffer(fontFile);

        const isWoff2FontFile = new EnhancedFile(fontFile).hasExtension('woff2');
        if (isWoff2FontFile) {
            const uint8Array = await Module.decompress(fontArrayBuffer);

            return Uint8Array.from(uint8Array).buffer;
        }
        else {
            return fontArrayBuffer;
        }
    }
}

class OpenTypeFont {
    constructor(fileName, font) {
        this.fileName = fileName;
        this.name = () => font.fontFamily ? font.fontFamily["en"] : font.names.fontFamily["en"];
        this.uniqueID = () => font.uniqueID ? font.uniqueID["en"] : font.names.uniqueID["en"];
        this.glyphs = parseGlyphs(font);
        this.renderer = new OpenTypeFontRenderer();

        function parseGlyphs(font) {
            //var x = parseLigatures(font);
            const glyphs = [];
            for (let i = 0; i < font.glyphs.length; i++) {
                const glyph = font.glyphs.get(i);
                if (glyph.unicode)
                    glyphs.push(glyph);
            }
            return () => glyphs;
        }

        /*
        function parseLigatures(font) {
            var glyphIndexMap = font.tables.cmap.glyphIndexMap;
            var reverseGlyphIndexMap = {};
            Object.keys(glyphIndexMap).forEach(function (key) {
                var value = glyphIndexMap[key];
                reverseGlyphIndexMap[value] = key;
            });

            font.tables.gsub.lookups.forEach(function (lookup) {
                lookup.subtables.forEach(function (subtable) {
                    subtable.ligatureSets.forEach(function (set) {
                        set.forEach(function (ligature) {
                            ligature.components = ligature.components.map(function (component) {
                                component = reverseGlyphIndexMap[component];
                                component = parseInt(component);
                                return String.fromCharCode(component);
                            });

                            if (subtable.coverage.format == 1) {
                                var firstGlyph = subtable.coverage.glyphs;
                            }else{
                                var firstGlyph = 'Format 2';          	
                            }

                            console.log(firstGlyph, ligature.components.join(''), ligature.ligGlyph, reverseGlyphIndexMap[ligature.ligGlyph]);
                        });
                    });
                });
            });
        }*/

        // "e87c":{"name":"Face"} //59516
        // ace 783
    }
}

class OpenTypeFontRenderer {
    constructor() {
        this.render = function (parentElement, glyph) {
            const canvas = document.createElement('canvas');
            canvas.setAttribute("width", "33px");
            canvas.setAttribute("height", "33px");
            const ctx = canvas.getContext('2d');
            glyph.draw(ctx, 0, 30, 30);
            parentElement.appendChild(canvas);
        };
    }
}
