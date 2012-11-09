/*
 * Text slider v1.1
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
		isIE = $.browser.msie;

	var TextSlider = function (el, obj) {
		this._input = $(el);
		
		if (!this._input.length) {
			return;
		}
		
		this._insideSpan = $('<span></span>');
		this._outSideSpan = this._input.wrap('<span class="textslider"></span>');
		 
		this._value = this._input.removeClass('textslider').val();
        
		this._insideSpan.insertBefore(this._input)
			.attr('title', this._input.attr('title'));
			
		this._initPrefs();
		this._initEvents();
		
        this.val(this._value);
		this._input.change();
	};
	
	TextSlider.prototype = {
		constructor: TextSlider,
		show: function () {
			this._insideSpan.click();
		},
		hide: function () {
			this._insideSpan.blur();
		},
		val: function (value) {
            var p = this._prefs,
                data = {
                    span: this._insideSpan,
                    min: p.min,
                    max: p.max,
                    step: p.step
                };
                
			if (typeof value == 'undefined') {
				return this._value;
			} else {
                this._insideSpan.html(p.filterForValue(value, data))
                    .css(p.filterForCSS(value, data));

				this._value = value;
                this._input.val(value);
                this._insideSpan.html(value);
                
                return this;
			}
		},		
		_css: {
			reset: {
				position: '',
				left: ''
			},
			outside: {
				position: 'absolute',
				left: '-10000px'
			},
			unselectable: {
				'user-select': 'none',
				'-moz-user-select': 'none',
				'-webkit-user-select': 'none',
				'-o-user-select': 'none'
			}
		},
		_prefs: {
			min: null,
			max: null,
			step: null,
			filterForValue: function (value, data) {
                return value;
            },
			filterForCSS: function (value, data) {
				return {};
            }
		},
		_unselectable: function (elem) {
			elem.css(this._css.unselectable);
			isIE && elem.attr('unselectable', 'on');
		},
		_initPrefs: function (prefs) {
			var p = this._prefs;
			if (typeof prefs == 'object') {
				if (typeof prefs.min != 'undefined') {
					p.min = prefs.min;
				}
				
				if (typeof prefs.max != 'undefined') {
					p.max = prefs.max;
				}
				
				if (typeof prefs.step != 'undefined') {
					p.step = prefs.step;
				}
				
				if (typeof prefs.filterForValue == 'function') {
					p.filterForValue = prefs.filterForValue;
				}
	
				if (typeof prefs.filterForCSS == 'function') {
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
		_initEvents: function () {
			var that = this;
			this._insideSpan.click(function () {
				if (isMouseMove && isIE) {
					return;
				}
		
				that._insideSpan.hide();
				that._input.css(that._css.reset).focus();
			}).mousedown(function (e) {
				isMouseMove = false;
				isMouseDown = true;
				
                oldX = e.pageX;
				oldY = e.pageY;
                
				that._input.blur();
                
				oldValue = parseFloat(that._input.val());
	
				$(document).bind('mousemove.textslider', that._mousemove)
					.bind('mouseup.textslider', that._mouseup);
	
				return false;
			});
	
			this._close = function (e) {
				if ((e.type == 'keydown' && e.keyCode == 13) || e.type == 'blur') {
					var value = parseFloat(that._input.val()),
						min = that._prefs.min,
						max = that._prefs.max;
					
					if (min !== null && value < min) {
						value = min;
					}
					if (max !== null && value > max) {
						value = max;
					}
	
					that._insideSpan.show();
					that._input.css(that._css.outside)
						.val(value)
						.change();
				}
			};
	
			this._mousemove = function (e) {
				if (isMouseDown) {
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
	
					that._input.val(value).change();
	
					return false;
				}
			};
	
			this._mouseup = function (e) {
				isMouseDown = false;
                
				$(document)
					.unbind('mousemove.textslider', this._mousemove)
					.unbind('mouseup.textslider', this._mouseup);
	
				return false;
			};

			this._input.change(function () {
                that.val(this.value);
			}).focus(function () {
				that._input.css(that._css.reset);
				that._insideSpan.hide();
			}).css(this._css.outside)
				.blur(this._close)
				.keydown(this._close);
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