export class MainViewController {
    constructor(element) {
        this.init = function () {
            const _vm = ko.dataFor(document.body);

            $(element).click(function (ev) {
                var g = ko.dataFor(ev.target);
                if (g.unicode) {
                    var $t = $(ev.target).closest('.icon');
                    $t.toggleClass('icon-selected');
                    _vm.toggleSelectedGlyph(g, $t.hasClass('icon-selected'));
                }
            });

            $('.clear-glyph-selection').click(function () {
                $('.icon-selected').toggleClass('icon-selected');
                _vm.clearSelectedGlyphs();
            });

            initClipboard();
        };
    }
}

function initClipboard() {
    var clipboard = new ClipboardJS('#btn-copy-gen-code');
    clipboard.on('success', function (e) {
        e.clearSelection();
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
    });

    clipboard.on('error', function (e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger);
    });

    function setTooltip(btn, message) {
        $(btn).tooltip('hide')
            .attr('data-original-title', message)
            .tooltip('show');
    }

    function hideTooltip(btn) {
        setTimeout(function () {
            $(btn).tooltip('dispose');
        }, 1000);
    }

    $('[data-toggle="tooltip"]').tooltip();
}