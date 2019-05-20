/*import { FontGlyph } from '../FontGlyph.js';
import { readFileAsText } from '../utils/asyncFileReader.js';

export class CssFontFactory {
    constructor() {
        this.createFont = function (file) {
            return new Promise(async (resolve, reject) => {
                const fileContent = await readFileAsText(file);
                
                const cssDefs = Array.from(GetCssRulesForCssText(fileContent))
                    .filter(cssDef => cssDef.style && cssDef.style.length == 1 && cssDef.style[0] == 'content');
                
                const glyphs = cssDefs.map(cssDef => {
                    let t = cssDef.selectorText;
                    t = t.substr(1, t.indexOf('::') - 1);
                    const unicode = getCSSRuleContent(cssDef);
                    return new FontGlyph(t, unicode);
                });

                //ensureCssFontIsLoaded(url);
                resolve(new CssFont(glyphs));
            });
        };

        /*function loadFileFromUrl(url, onFileLoaded) {
            var oReq = new XMLHttpRequest();
            oReq.onload = function (e) {
                var arraybuffer = oReq.responseText; // not responseText
                onFileLoaded(oReq.responseText);
            }
            oReq.open("GET", url);
            oReq.send();
        }*/
    }
}

/*
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
}*/

/*
function GetCssRulesForCssText(styleContent) {
    const styleElement = document.createElement("style");
    styleElement.textContent = styleContent;

    // the style will only be parsed once it is added to a document
    const doc = document.implementation.createHTMLDocument("");
    doc.body.appendChild(styleElement);

    return styleElement.sheet.cssRules;
};

function getCSSRuleContent(cssDef) {
    let s = cssDef.style.content;
    s = s.substr(1, s.length - 2);
    if (s[0] == '\\') {
        // Edge
        return parseInt(s.substr(1), 16);
    } else {
        // Chrome, Firefox
        return s.charCodeAt(0);
    }
}

class CssFont {
    constructor(glyphs) {
        this.glyphs = () => glyphs;
        this.renderer = new CssFontRenderer();
    }
}

class CssFontRenderer {
    constructor() {
        this.render = function (parentElement, glyph) {
            let e = document.createElement('span');
            e.setAttribute("class", glyph.name);
            parentElement.appendChild(e);
        };
    }
}
*/