/*
 * Text slider v1.2
 * Example:
 * http://webfilin.ru/files/notes/textslider/
 *
 * Copyright (c) 2009 Denis Seleznev
 * Dual licensed under the MIT and GPL licenses.
 *
 */

(function ($) {

var isMouseDown = false,
    isMouseMove = false,
    oldValue,
    oldX,
    oldY,
    isIE = $.browser.msie,
    showText = function (el) {
        el.addClass('textslider_show-text_yes')
            .removeClass('textslider_show-text_no');
    },
    hideText = function (el) {
        el.addClass('textslider_show-text_no')
            .removeClass('textslider_show-text_yes');
    };

var TextSlider = function (el, obj) {
    this._input = $(el);
    
    if (!this._input.length) {
        return;
    }
    
    this._insideSpan = $('<span class="textslider__text"></span>');
    this._input.wrap('<span class="textslider textslider_show-text_yes"></span>');
    this._outsideSpan = this._input.parent();
    
    this._value = this._input.removeClass('textslider').val();
    
    this._insideSpan
        .insertBefore(this._input)
        .attr('title', this._input.attr('title'));
        
    this._initPrefs(obj);
    this._initEvents();
    
    this.val(this._value);
    this._input.change();
};

TextSlider.prototype = {
    constructor: TextSlider,
    show: function () {
        return this._insideSpan.click();
    },
    hide: function () {
        return this._insideSpan.blur();
    },
    val: function (value) {
        var p = this._prefs,
            data = {
                span: this._insideSpan,
                min: p.min,
                max: p.max,
                step: p.step
            };

        if (typeof value === 'undefined') {
            return this._value;
        } else {
            this._value = value;
            
            this._insideSpan
                .html(p.filterForValue(value, data))
                .css(p.filterForCSS(value, data));

            this._input.val(value);
            
            return this;
        }
    },
    remove: function () {
        delete this._prefs;
        
        this._delEvents();
    },
    _initPrefs: function (prefs) {
        this._prefs = {
            min: null,
            max: null,
            step: null,
            filterForValue: function (value, data) {
                return value;
            },
            filterForCSS: function (value, data) {
                return {};
            }
        };
        
        var p = this._prefs;
        
        if (typeof prefs === 'object') {
            if (typeof prefs.min !== 'undefined') {
                p.min = prefs.min;
            }
            
            if (typeof prefs.max !== 'undefined') {
                p.max = prefs.max;
            }
            
            if (typeof prefs.step !== 'undefined') {
                p.step = prefs.step;
            }
            
            if (typeof prefs.filterForValue === 'function') {
                p.filterForValue = prefs.filterForValue;
            }

            if (typeof prefs.filterForCSS === 'function') {
                p.filterForCSS = prefs.filterForCSS;
            }
        }
    
        if (p.min !== null && p.max !== null && p.max < p.min) {
            p.min = p.max = null;
        }

        if (p.step === null) {
            if (p.min !== null && p.max !== null) {
                p.step = (p.max - p.min) / 100;
            } else {
                p.step = 1;
            }
        }

        if (p.min !== null && this._value < p.min) {
            this._value = p.min;
        }
        
        if (p.max !== null && this._value > p.max) {
            this._value = p.max;
        }
    },
    _setEvents: function () {
        $(document)
            .on('mousemove.textslider', this._mousemove)
            .on('mouseup.textslider', this._mouseup);
    },
    _delEvents: function () {
        $(document)
            .off('mousemove.textslider', this._mousemove)
            .off('mouseup.textslider', this._mouseup);
    },
    _initEvents: function () {
        var that = this;
        this._insideSpan.click(function (e) {
            if (e.which !== 1) {
                return;
            }
            
            if (isMouseMove && isIE) {
                return;
            }
    
            hideText(that._outsideSpan);
            that._input.focus();
        }).mousedown(function (e) {
            if (e.which !== 1) {
                return;
            }
            
            isMouseMove = false;
            isMouseDown = true;
            
            oldX = e.pageX;
            oldY = e.pageY;
            
            that._input.blur();
            
            oldValue = parseFloat(that._input.val());

            that._outsideSpan.addClass('textslider_change_yes');
            
            that._setEvents();

            return false;
        });

        this._close = function (e) {
            var KEY_ENTER = 13;
            if ((e.type === 'keydown' && e.keyCode === KEY_ENTER) || e.type === 'blur') {
                var value = parseFloat(that._input.val()),
                    min = that._prefs.min,
                    max = that._prefs.max;
                
                if (min !== null && value < min) {
                    value = min;
                }
                
                if (max !== null && value > max) {
                    value = max;
                }

                showText(that._outsideSpan);
                
                that._input
                    .val(value)
                    .change();
            }
        };

        this._mousemove = function (e) {
            if (e.which === 1 && isMouseDown) {
                isMouseMove = true;
                
                var value = Math.floor(oldValue + (e.pageX - oldX + oldY - e.pageY) * that._prefs.step),
                    min = that._prefs.min,
                    max = that._prefs.max;
                    
                if (min !== null && value < min) {
                    value = min;
                }
                if (max !== null && value > max) {
                    value = max;
                }

                that._input
                    .val(value)
                    .change();

                return false;
            }
        };

        this._mouseup = function (e) {
            if (e.which !== 1) {
                return;
            }
        
            isMouseDown = false;
            
            that._outsideSpan.removeClass('textslider_change_yes');
            
            that._delEvents();

            return false;
        };

        this._input.change(function () {
            that.val(this.value);
        }).focus(function () {
            hideText(that._outsideSpan);
        }).blur(this._close).keydown(this._close);
    }
};

$.fn.textSlider = function (prefs) {
    if (!this.length) {
        return;
    }

    this.each(function () {
        new TextSlider(this, prefs);
    });
    
    return this;
};

})(jQuery);
