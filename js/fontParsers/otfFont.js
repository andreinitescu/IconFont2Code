import { readFileAsArrayBuffer } from '../utils/asyncFileReader.js';


export class OpenTypeFontFactory {
    constructor() {
        this.createFont = function (file) {
            return new Promise(async (resolve, reject) => {
                try {
                    const fileContent = await readFileAsArrayBuffer(file);
                    resolve(new OpenTypeFont(file.name, opentype.parse(fileContent)));
                }
                catch (ex) {
                    alert('Unable to open the font file.\nConsider opening an issue in the GitHub repo with information how to reproduce the issue.');
                    reject(ex);
                }
            });
        };
    }
}

class OpenTypeFont {
    constructor(fileName, font) {
        this.fileName = fileName;
        this.name = () => font.names.fullName["en"] || Object.values(font.names.fullName)[0];
        this.uniqueID = () => font.names.uniqueID["en"] || Object.values(font.names.uniqueID)[0];
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
