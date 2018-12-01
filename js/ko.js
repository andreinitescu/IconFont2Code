import {MainViewController} from './mainVC.js'

ko.bindingHandlers.fileUpload = {
    init: function (element, valueAccessor, ) {
        $(element).change(function () {
            valueAccessor()(element.files[0]);
        });
    },
    update: function (element, valueAccessor) {
        if (ko.unwrap(valueAccessor()) === null) {
            $(element).wrap('<form>').closest('form').get(0).reset();
            $(element).unwrap();
        }
    }
};

ko.bindingHandlers.enterkey = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var callback = valueAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                callback.call(viewModel);
                return false;
            }   
            return true;
        });
    }
};

ko.bindingHandlers.drawGlyph = {
    init: function (element, valueAccessor, allBindings, glyph, bindingContext) {
        bindingContext.$parent.font().createRenderer().render(element, glyph);
    },
    update: function (element, valueAccessor) {
    }
};


ko.observableArray.fn.pushAll = function (valuesToPush) {
    var underlyingArray = this();
    this.valueWillMutate();
    ko.utils.arrayPushAll(underlyingArray, valuesToPush);
    this.valueHasMutated();
    return this;  //optional
};

ko.bindingHandlers.highlight = {
	init: function (element, valueAccessor, allBindings) {

		if (!window.Prism) {
			throw 'Prism not loaded.';
		}

		// this should only be applied to a code element.
		if (!new RegExp('^code$', 'i').test(element.tagName)) {
			throw 'Please bind to a "code" element';
		}

		// check if we specified a language.
		var language = allBindings.get('language');
		if (language) {
			element.className += language;
		}

	},
	update: function (element, valueAccessor) {
		var value = ko.unwrap(valueAccessor());

		if (value !== undefined) { // allows highlighting static code
			element.innerHTML = value;
		}

		window.Prism.highlightElement(element);
	}
};

ko.bindingHandlers.viewController = {
    init: function (element, valueAccessor, allBindings) {
        var ctor = eval(valueAccessor());
        var vc = new ctor(element);
        $(element).data('vc', vc);
        vc.init();
    },
    update: function (element, valueAccessor) {
    }
};