export class MainViewController {
    constructor() {
        initSelectionHandling();
        initClipboard();
        initDragAndDrop();

        $(document).on('click', '.expand-glyphs-panel', function () {
            $('.csharp-panel').toggle();
            $('.options-panel').toggle();
            $(this).find('>:first-child').toggleClass('fa-expand-arrows-alt').toggleClass('fa-compress-arrows-alt');
        });

        $(document).on('hidden.bs.modal', '#fontwithoutglyphs-dialog', function () {
            let dontAskAgain = $("input[name=dismiss]", this).is(":checked");
            if (dontAskAgain) {
                Cookies.set('fontwithoutglyphs-dontremind', true);
            }
        });
    }
}

function initSelectionHandling() {
    const vm = ko.dataFor(document.body);

    // Subscribe to glyph selection changes in view-model
    vm.selectedGlyphs.subscribe(function (changes) {
        changes.forEach(function (change) {
            if (change.status == 'added' || change.status == 'deleted') {
                onGlyphSelectionChanged(change.value, change.status == 'added');
            } else {
                throw new Error("Unexpected value");
            }
        });
    }, null, 'arrayChange');

    // Subscribe to click events on glyph elements
    $(document).on('click', '.icons-glyphs .icon', onGlyphClicked);

    function onGlyphSelectionChanged(glyph, isSelected) {
        let $glyphElem = getGlyphElem(glyph);
        if (isSelected) {
            $glyphElem.addClass('icon-selected');
        } else {
            $glyphElem.removeClass('icon-selected');
        }
    }

    let _$lastSelected;
    function onGlyphClicked(ev) {
        const $ge = $(ev.currentTarget);

        if (!_$lastSelected) {
            _$lastSelected = $ge;
            toggleGlyphSelectionInViewModel($ge);
            return;
        }

        const $glyphElems = $('.icon');

        if (ev.shiftKey) {
            const start = $glyphElems.index($ge);
            const end = $glyphElems.index(_$lastSelected);
            selectGlyphsInViewModel($glyphElems.slice(Math.min(start, end), Math.max(start, end) + 1), isGlyphElemSelected(_$lastSelected));
        }
        else {
            toggleGlyphSelectionInViewModel($ge);
        }

        _$lastSelected = $ge;
    }

    function getGlyphElem(g) {
        return $('.icon').filter((_, e) => ko.dataFor(e) === g);
    }

    function isGlyphElemSelected($ge) {
        return $ge.hasClass('icon-selected');
    }

    function toggleGlyphSelectionInViewModel($glyphElems) {
        $glyphElems.each((_, ge) => {
            const $ge = $(ge);
            if (isGlyphElemSelected($ge)) {
                selectGlyphsInViewModel($ge, false);
            } else {
                selectGlyphsInViewModel($ge, true);
            }
        });
    }

    function selectGlyphsInViewModel($glyphElems, select) {
        const glyphs = $.map($glyphElems, (ge) => ko.dataFor(ge));
        if (select) {
            var newGlyphsToAdd = glyphs.filter(g => vm.selectedGlyphs.indexOf(g) == -1);
            vm.selectedGlyphs.pushAll(newGlyphsToAdd);
        } else {
            vm.selectedGlyphs.removeAll(glyphs);
        }
    };
}

function initClipboard() {
    const clipboard = new ClipboardJS('#btn-copy-gen-code');

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

function initDragAndDrop() {
    document.querySelector("body").addEventListener("dragover", function (ev) {
        ev.preventDefault();
    });

    document.querySelector("body").addEventListener("drop", function (ev) {
        ev.preventDefault();

        let fileToOpen = null;
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            // If dropped items aren't files, reject them
            const dtItem = ev.dataTransfer.items[0];
            if (dtItem.kind === 'file') {
                fileToOpen = dtItem.getAsFile();
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            fileToOpen = ev.dataTransfer.files[0];
        }

        const vm = ko.dataFor(ev.currentTarget);
        vm.openFile(fileToOpen);
    });
}