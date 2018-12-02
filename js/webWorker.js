import {OpenTypeFontFactory} from '.fontParsers/otfFont.js'

self.addEventListener("loadFont", function() {
    var factory = OpenTypeFontFactory;
    new factory().createFont(o, function (font) {
        postMessage();
    });
});
