import { FontGlyph } from '../FontGlyph.js'

export class CssFontFactory {
    constructor() {

        this.createFont = function (file, onFontLoaded) {
            loadFile(file, function (fileContent) {
                //var s = new CSSJSON.toJSON(fileContent);
                //debugger;

                function ensureCssFontIsLoaded(url) {
                    //var doc = document.implementation.createHTMLDocument("");
                    //var styleElement = document.createElement("style");
                    //styleElement.textContent = styleContent;
                    // the style will only be parsed once it is added to a document
                    //document.head.appendChild(styleElement);
                    var link = document.createElement('link');
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.href = url;
                    var headScript = document.querySelector('script');
                    headScript.parentNode.insertBefore(link, headScript);
                }

                var rulesForCssText = function (styleContent) {
                    var doc = document.implementation.createHTMLDocument(""),
                        styleElement = document.createElement("style");

                    styleElement.textContent = styleContent;
                    // the style will only be parsed once it is added to a document
                    doc.body.appendChild(styleElement);

                    return styleElement.sheet.cssRules;
                };

                var cssDefs = Array.from(rulesForCssText(fileContent));
                cssDefs = cssDefs.filter(cssDef => cssDef.style && cssDef.style.length == 1 && cssDef.style[0] == 'content');

                var glyphs = cssDefs.map(cssDef => {
                    var t = cssDef.selectorText;
                    var unicode = getCSSRuleContent(cssDef);
                    return new FontGlyph(t.substr(1, t.indexOf('::') - 1), unicode);
                });

                function getCSSRuleContent(cssDef) {
                    var s = cssDef.style.content;
                    s = s.substr(1, s.length - 2);
                    if (s[0] == '\\') {
                        // Edge
                        return parseInt(s.substr(1), 16);
                    } else {
                        // Chrome, Firefox
                        return s.charCodeAt(0);
                    }
                }

                //ensureCssFontIsLoaded(url);
                onFontLoaded(new CssFont(glyphs));
            });
        };

        function loadFile(file, onFileLoaded) {
            //loadFileFromUrl(url, onFileLoaded);
            loadFileFromFileObject(file, onFileLoaded);
        }

        function loadFileFromUrl(url, onFileLoaded) {
            var oReq = new XMLHttpRequest();
            oReq.onload = function (e) {
                var arraybuffer = oReq.responseText; // not responseText
                onFileLoaded(oReq.responseText);
            }
            oReq.open("GET", url);
            oReq.send();

        }

        function loadFileFromFileObject(file, onFileLoaded) {
            var fr = new FileReader();
            fr.onload = function () {
                onFileLoaded(fr.result);
            };

            if (file) {
                fr.readAsText(file);
            }
        }
    }
}

function CssFont(glyphs) {
    this.glyphs = function () {
        return glyphs;
    }

    this.createRenderer = function () {
        return new CssFontRenderer();
    };
}


function CssFontRenderer() {
    this.render = function (parentElement, glyph) {
        var ns = 'http://www.w3.org/2000/svg';
        var e = document.createElement('span');
        e.setAttribute("class", glyph.name);
        parentElement.appendChild(e);
    };
}