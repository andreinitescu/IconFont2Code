import { OpenTypeFontFactory } from './fontParsers/otfFont.js';
import { toUnicodeString } from './utils/stringUtils.js';

import { parseCSharpCode } from './parsers/cSharpCodeParser.js';
import { generateCsharpCode } from './cSharpCodeGen.js';
import { isMappingFile, getMapper, getNameMapperFromFile, applyNameMapper } from './mapper.js';

export class MainViewModel {
    constructor() {
        const _this = this;
        let _importedCSharpFieldMappings;

        this.isLoading = ko.observable(false);

        this.font = ko.observable();
        this.code = ko.observable();

        this.code = ko.pauseableComputed(() => {
            if (!_this.font())
                return "";

            return generateCsharpCode(
                _this.selectedGlyphs().length ? _this.selectedGlyphs() : _this.font().glyphs(),
                _this.cSharpCodeGenOptions.prefix(),
                _this.cSharpCodeGenOptions.className(),
                _importedCSharpFieldMappings);
        });

        this.selectedGlyphs = ko.observableArray([]);

        this.cSharpCodeGenOptions = {
            className: ko.observable(),
            prefix: ko.observable(),
        };

        this.isFontFile = (file) => file.name.endsWith('.ttf') || file.name.endsWith('.otf');
        this.isCsharpFile = (file) => file.name.endsWith('.cs');

        this.openFile = async (fileToOpen) => {
            if (fileToOpen !== null) {
                if (this.isFontFile(fileToOpen))
                    this.openFontFile(fileToOpen);
                else if (isMappingFile(fileToOpen.name))
                    this.openMappingFile(fileToOpen);
                else if (this.isCsharpFile(fileToOpen))
                    this.openCSharpFile(fileToOpen);
            }
        };

        this.openFontFile = async (file) => {
            if (!file)
                return;

            if (!this.isFontFile(file)) {
                alert('Please select a TrueType Font (.ttf) or an OpenType Font (.otf) file');
                return;
            }

            _this.isLoading(true);

            const font = await new OpenTypeFontFactory().createFont(file);
            const mapper = getMapper(font, file.name);

            if (mapper) {
                /*const $dialog = $('#modal-confirm-known-mapping');
                var vm = { mappingUrl: mapperInfo.mappingUrl };
                ko.applyBindings(vm, $dialog[0]);
                //$dialog.find('.modal-body__text').attr('data-bind', 'text: mappingUrl');
                $dialog.modal();
                
                $dialog.one('hidden.bs.modal', async function (e) {
                   
                })*/
                _this.code.pause();

                setTimeout(async () => {
                    setFont(font);
                    await mapper.applyNameMapper(font);
                    _this.cSharpCodeGenOptions.prefix(mapper.prefix);
                    _this.code.resume();
                    _this.isLoading(false);
                });
            } else {
                _this.isLoading(true);
                setTimeout(() => {
                    setFont(font);
                    _this.isLoading(false);
                }, 100);
            }
        };

        this.openMappingFile = async (file) => {
            if (!file || !this.font())
                return;

            if (!isMappingFile(file.name)) {
                alert('Please select a CSS (.css) or a IJMAP (.ijmap) file');
                return;
            }

            const nameMapper = await getNameMapperFromFile(file);
            if (nameMapper)
                applyNameMapper(nameMapper, _this.font());
            reloadFont();
        };

        this.openCSharpFile = async (file) => {
            if (!file || !this.font())
                return;

            if (!this.isCsharpFile(file)) {
                alert('Please select a C# (.cs) file');
                return;
            }

            const parseResult = await parseCSharpCode(file);
            _this.cSharpCodeGenOptions.className(parseResult.ClassName);
            _importedCSharpFieldMappings = parseResult.GlyphMappings;

            // Update selected glyphs
            const selectedGlyphs = _this.font().glyphs().filter(g => _importedCSharpFieldMappings[g.unicode] !== undefined);
            this.selectedGlyphs.pushAll(selectedGlyphs);
        };

        this.clearSelectedGlyphs = () => _this.selectedGlyphs.removeAll();
        this.hasGlyphsWithNames = ko.computed(() => _this.font() && _this.font().glyphs().some(g => g.name));
        this.toUnicodeString = toUnicodeString;

        /*
        function setFontAsync(font) {
            _this.isLoading(true);
            return new Promise((resolve) => {
                setTimeout(() => {

                    resolve();
                }, 100);
            });
        }*/

        function setFont(font) {
            _this.cSharpCodeGenOptions.prefix(null);
            _this.cSharpCodeGenOptions.className(null);
            _this.font(font);
            _this.selectedGlyphs.removeAll();
        }

        function reloadFont() {
            const f = _this.font();
            const selectedGlyphs = _this.selectedGlyphs();
            setFont(null);

            setFont(f);
            _this.selectedGlyphs(selectedGlyphs);
        }
    }
}
