import { OpenTypeFontFactory } from './fontParsers/otfFont.js';
import { CssFontFactory } from './fontParsers/cssFont.js';
import { generateCsharpCode } from './cSharpCodeGen.js';

export class MainViewModel {
    constructor() {
        const _this = this;

        this.font = ko.observable();

        this.fontFileName = ko.computed(function () {
            return _this.font() ? _this.font().fileName : null;
        });

        this.glyphs = ko.computed(function () {
            var f = this.font();
            return f ? f.glyphs() : [];
        }, this);

        this.code = ko.computed(function () {
            if (!_this.font()) {
                return "";
            }

            return generateCsharpCode(
                _this.selectedGlyphs().length ? _this.selectedGlyphs() : _this.glyphs(),
                _this.cSharpCodeGenOptions.prefix(),
                _this.cSharpCodeGenOptions.className());
        });

        this.selectedGlyphs = ko.observableArray([]);

        this.cSharpCodeGenOptions = {
            className: ko.observable(),
            prefix: ko.observable(),
        };

        this.prefix = ko.observable();
        this.csharpClassName = ko.observable();

        this.toggleSelectedGlyph = function (glyph, select) {
            var selectedGlyphs = _this.selectedGlyphs();
            if (select) {
                selectedGlyphs.push(glyph);
            } else {
                selectedGlyphs.splice(selectedGlyphs.indexOf(glyph), 1);
            }
            //selectedGlyphs.sort(function (l, r) { return l.name == r.name ? 0 : (l.name < r.name ? -1 : 1) });
            _this.selectedGlyphs(selectedGlyphs);
        };

        this.uploadFontFile = function (file) {
            if (file === undefined) {
                return;
            }

            if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
                alert('Please select a TrueType Font (.ttf) or an OpenType Font (.otf) file');
                return;
            }

            new OpenTypeFontFactory().createFont(file, onFontLoaded);
        };

        this.uploadMappingFile = function (file) {
            if (file === undefined) {
                return;
            }

            if (!file.name.endsWith('.css')) {
                alert('Please select a CSS (.css) file');
                return;
            }

            new CssFontFactory().createFont(file, function (cssFont) {
                cssFont.glyphs().forEach(cssFontGlyph => {
                    var fontGlyph = _this.font().glyphs().find(g => g.unicode == cssFontGlyph.unicode);
                    if (fontGlyph) {
                        fontGlyph.name = cssFontGlyph.name;
                    }
                });

                // Reload font
                var f = _this.font();
                onFontLoaded(null, true);
                onFontLoaded(f, true);
            });
        };

        this.clearSelectedGlyphs = function () {
            _this.selectedGlyphs.removeAll();
        };

        this.hasGlyphsWithNames = ko.computed(function () {
            return _this.glyphs().some(function (g) {
                return g.name;
            });
        });

        this.setPrefix = function (form) {
            if (form.prefix) {
                this.prefix(form.prefix.value);
            }
        };

        this.setCsharpClassName = function (form) {
            if (form.csharpClassName) {
                this.csharpClassName(form.csharpClassName.value);
            }
        };

        function onFontLoaded(font, keepSelection) {
            _this.font(font);
            if (!keepSelection) {
                _this.selectedGlyphs([]);
            }
        }
    }
}


