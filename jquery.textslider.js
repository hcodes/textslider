/*
 * Text slider v1.0
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

	var TextSlider = function (obj) {
		this._prefs = {
			min: null,
			max: null,
			step: null,
			filterForValue: null,
			filterForCSS: null
		};

		this._input = $(this);
		this._insideSpan = $('<span></span>');
		this._outSideSpan = this._input.wrap('<span class="textslider"></span>');
		 
		this.value = this._input.val();
			
		this._insideSpan.insertBefore(input)
			.attr('title', input.attr('title'));
			
		this.initEvents();
		this._input.val(this.value).change();
	};
	
	TextSlider.prototype = {
		css: {
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
				'-webkit-user-select': 'none'
			}
		},
		unselectable: function (elem) {
			elem.css(this.css.unselectable);
			isIE && elem.attr('unselectable', 'on');
		},
		initPrefs: function (prefs) {
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
				
				if (prefs.filterForValue) {
					p.filterForValue = prefs.filterForValue;
				}
	
				if (prefs.filterForCSS) {
					p.filterForCSS = prefs.filterForCSS;
				}
			}
	
			if (!p.filterForValue) {
				p.filterForValue = function (value, data) {
					return value;
				}
			}
	
			if (!p.filterForCSS) {
				p.filterForCSS = function (value, data) {
					return {};
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
	
			if (p.min !== null && this.value < p.min) {
				this.value = p.min;
			}
			
			if (p.max !== null && this.value > p.max) {
				this.value = p.max;
			}
		},
		initEvents: function () {
			var that = this;
			this._insideSpan.click(function () {
				if (isMouseMove && isIE) {
					return;
				}
		
				that._insideSpan.hide();
				that._input.css(that.css.reset).focus();
			}).mousedown(function (e) {
				isMouseMove = false;
				isMouseDown = true;
				oldX = e.pageX;
				oldY = e.pageY;
				if (currentSpan && currentSpan != this) {
					$('input', $(currentSpan).parent()).blur();
				}
				currentSpan = this;
				oldValue = parseFloat($('input', $(currentSpan).parent()).val());
	
				$(document).bind('mousemove.textslider', mousemove)
					.bind('mouseup.textslider', mouseup);
	
				return false;
			});
	
			input.change(function () {
				var data = {
					span: insideSpan,
					min: min,
					max: max,
					step: step
				};
					
				insideSpan.html(filterForValue(this.value, data))
					.css(filterForCSS(this.value, data));
			});
	
			input.focus(function () {
				input.css(cssReset);
				insideSpan.hide();
			});
	
			function closeInput(e) {
				if ((e.type == 'keydown' && e.keyCode == 13) || e.type == 'blur') {
					var value = parseFloat(that._input.val()),
						min = el.data('min'),
						max = el.data('max');
					
					if (min !== null && value < min) {
						value = min;
					}
					if (max !== null && value > max) {
						value = max;
					}
	
					that._insideSpan.show();
					that._input.css(that.css.outside)
						.val(value)
						.change();
				}
			}
	
			this._input.css(this.css.outside)
				.blur(closeInput)
				.keydown(closeInput);
	
			function mousemove(e) {
				if (isMouseDown) {
					isMouseMove = true;
					var input = $('input', $(currentSpan).parent());
					var value = oldValue + (e.pageX - oldX + oldY - e.pageY) * that._input.data('step');
					value = Math.floor(value);
					
					var min = input.data('min'),
						max = input.data('max');
						
					if (min !== null && value < min) {
						value = min;
					}
					if (max !== null && value > max) {
						value = max;
					}
	
					that._input.val(value).change();
	
					return false;
				}
			}
	
			function mouseup(e) {
				isMouseDown = false;
				$(document)
					.unbind('mousemove.textslider', mousemove)
					.unbind('mouseup.textslider', mouseup);
	
				return false;
			}
			
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