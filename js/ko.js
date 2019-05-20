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
        let callback = valueAccessor();
        $(element).keypress(function (event) {
            let keyCode = (event.which ? event.which : event.keyCode);
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
        bindingContext.$parent.font().renderer.render(element, glyph);
    },
    update: function (element, valueAccessor) {
    }
};


ko.observableArray.fn.pushAll = function (valuesToPush) {
    let underlyingArray = this();
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
		let language = allBindings.get('language');
		if (language) {
			element.className += language;
		}

	},
	update: function (element, valueAccessor) {
		let value = ko.unwrap(valueAccessor());

		if (value !== undefined) { // allows highlighting static code
			element.innerHTML = value;
		}

		window.Prism.highlightElement(element);
	}
};

ko.bindingHandlers.fieldBtn = {
    init: function (element, valueAccessor, allBindings) {
        let field = $(valueAccessor().selector);
        field.keypress(function (e) {
            if(e.which == 13)
            {
                $(element).click();
                return false;
            }
        });
        
        $(element).click(function () {
            const v = $(valueAccessor().selector).val();
            valueAccessor().setter(v);
        });
    },
    update: function (element, valueAccessor) {
    }
};


//wrapper for a computed observable that can pause its subscriptions
ko.pauseableComputed = function(evaluatorFunction, evaluatorFunctionTarget) {
    let _cachedValue = "";
    let _isPaused = ko.observable(false);

    //the computed observable that we will return
    let result = ko.computed(function() {
        if (!_isPaused()) {
            //call the actual function that was passed in
            return evaluatorFunction.call(evaluatorFunctionTarget);
        }
        return _cachedValue;
    }, evaluatorFunctionTarget);

    //keep track of our current value and set the pause flag to release our actual subscriptions
    result.pause = function() {
        _cachedValue = this();
        _isPaused(true);
    }.bind(result);

    //clear the cached value and allow our computed observable to be re-evaluated
    result.resume = function() {
        _cachedValue = "";
        _isPaused(false);
    }

    return result;
};