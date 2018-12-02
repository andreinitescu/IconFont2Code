import { OpenTypeFontFactory } from './fontParsers/otfFont.js';
import { CssFontFactory } from './fontParsers/cssFont.js';
import { generateCsharpCode } from './cSharpCodeGen.js';

export class MainViewModel {
    constructor() {
        const _this = this;

        this.font = ko.observable();

        this.code = ko.computed(() => {
            if (!_this.font()) {
                return "";
            }

            return generateCsharpCode(
                _this.selectedGlyphs().length ? _this.selectedGlyphs() : _this.font().glyphs(),
                _this.cSharpCodeGenOptions.prefix(),
                _this.cSharpCodeGenOptions.className());
        });

        this.selectedGlyphs = ko.observableArray([]);

        this.cSharpCodeGenOptions = {
            className: ko.observable(),
            prefix: ko.observable(),
        };

        this.uploadFontFile = async (file) => {
            if (!file) {
                return;
            }

            if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
                alert('Please select a TrueType Font (.ttf) or an OpenType Font (.otf) file');
                return;
            }

            setFont(await new OpenTypeFontFactory().createFont(file));
        };

        this.uploadMappingFile = async (file) => {
            if (!file) {
                return;
            }

            if (!file.name.endsWith('.css')) {
                alert('Please select a CSS (.css) file');
                return;
            }

            const cssFont = await new CssFontFactory().createFont(file);

            // For each glyph in CSS, try to find the glyph in the current font by unicode
            // If found, set the glyph name
            cssFont.glyphs().forEach(cssFontGlyph => {
                const fontGlyph = _this.font().glyphs().find(g => g.unicode == cssFontGlyph.unicode);
                if (fontGlyph) {
                    fontGlyph.name = cssFontGlyph.name;
                }
            });

            // Reload font
            const f = _this.font();
            const selectedGlyphs = _this.selectedGlyphs();
            setFont(null);

            setFont(f);
            _this.selectedGlyphs(selectedGlyphs);
        };

        this.clearSelectedGlyphs = () => _this.selectedGlyphs.removeAll();
        this.hasGlyphsWithNames = ko.computed(() => _this.font() && _this.font().glyphs().some(g => g.name));

        function setFont(font) {
            _this.font(font);
            _this.selectedGlyphs.removeAll();
        }
    }
}


