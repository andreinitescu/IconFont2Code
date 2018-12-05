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
        this.name = getName(font);
        this.glyphs = parseGlyphs(font);
        this.createRenderer = function () {
            return new OpenTypeFontRenderer();
        };

        function parseGlyphs(font) {
            const glyphs = [];
            for (let i = 0; i < font.glyphs.length; i++) {
                var glyph = font.glyphs.get(i);
                if (glyph.unicode) {
                    glyphs.push(glyph);
                }
            }
            return function () {
                return glyphs;
            };
        }

        function getName(font) {
            return function () { return font.names.fullName[Object.keys(font.names.fullName)]; };
        }
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
