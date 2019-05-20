/**
 * 
 * @param {File} file 
 * @returns {object} mappings
 */
export function parseGlyphMappingsFromCss(fileContent) {
    return new Promise(async (resolve, reject) => {
        const cssDefs = Array.from(getCssRulesForCssText(fileContent))
            .filter(cssDef => cssDef.style && cssDef.style.length == 1 && cssDef.style[0] == 'content');

        let mappings = {};
        cssDefs.forEach(cssDef => {
            let t = cssDef.selectorText;
            t = t.substr(1, t.indexOf('::') - 1);
            const unicode = getCSSRuleContent(cssDef);
            mappings[unicode] = t;
            console.log(unicode, t);
        });

        let mappingFunc;
        if (Object.keys(mappings).length > 0) {
            mappingFunc = (unicode) => mappings[unicode];
        }

        resolve(mappingFunc);
    });
}

function getCssRulesForCssText(styleContent) {
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
        return s.codePointAt(0);
        //return s.charCodeAt(0);
    }
}
