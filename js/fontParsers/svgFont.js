function SvgFontFactory() {
    this.createFont = function (file, onFontLoaded) {
        var fr = new FileReader();
        fr.onload = function () {
            //var fragment = document.createDocumentFragment();
            //fragment.appendChild()
            var doc = new DOMParser().parseFromString(fr.result, "application/xml");
            onFontLoaded(new SvgFont(doc));
        };

        if (file) {
            fr.readAsText(file);
        }
    };
}

function SvgFont(doc) {
    this.glyphs = function () {
        var glyphElems = Array.from(doc.getElementsByTagName('glyph')).filter(ge => ge.getAttribute('unicode'));
        return glyphElems.map(ge => {
            return {
                glyph: ge,
                name: ge.getAttribute('glyph-name'),
                unicode: parseInt(ge.getAttribute('unicode'), 16)
            }
        });
    };

    this.createRenderer = function () {
        return new SvgFontRenderer();
    };
}

function SvgFontRenderer() {
    this.render = function (parentElement, glyph) {
        var ns = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(ns, 'svg');
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        var path = document.createElementNS(ns, 'path');
        path.setAttribute('d', glyph.glyph.getAttribute('d'));
        path.setAttribute('fill', 'black');

        svg.appendChild(path);
        parentElement.appendChild(svg);

        var clientrect = path.getBBox();
        var viewBox = clientrect.x + ' ' + clientrect.y + ' ' + clientrect.width + ' ' + clientrect.height;
        svg.setAttribute('viewBox', viewBox);
    };
}
