export function OpenTypeFontFactory() {
    this.createFont = function (file, onFontLoaded) {
        var fr = new FileReader();
        fr.onload = function () {
            try {
                onFontLoaded(new OpenTypeFont(file.name, opentype.parse(fr.result)));
            }
            catch (ex) {
                alert('Unable to open the font file.\nConsider opening an issue in the GitHub repo with information how to reproduce the issue.');
                throw ex;
            }
        };

        if (file) {
            fr.readAsArrayBuffer(file);
        }
    };
}

function OpenTypeFont(fileName, font) {
    this.fileName = fileName;
    this.name = getName(font);
    this.glyphs = parseGlyphs(font);

    this.createRenderer = function () {
        return new OpenTypeFontRenderer();
    };

    function parseGlyphs(font) {
        var glyphs = [];
        for (var i = 0; i < font.glyphs.length; i++) {
            var glyph = font.glyphs.get(i);
            if (glyph.unicode) {
                glyphs.push(glyph);
            }
        }
        return function () {
            return glyphs;
        }
    }

    function getName(font) {
        return function () { return font.names.fullName[Object.keys(font.names.fullName)]; }
    }
}

function OpenTypeFontRenderer() {
    this.render = function (parentElement, glyph) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute("width", "33px");
        canvas.setAttribute("height", "33px");
        var ctx = canvas.getContext('2d');
        glyph.draw(ctx, 0, 30, 30);
        parentElement.appendChild(canvas);
    };
}