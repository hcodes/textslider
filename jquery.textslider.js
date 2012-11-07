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
	var mousedown = false, isMouseMove = false, currentSpan, oldValue, oldX, oldY, cssReset = {
		position : '',
		left : ''
	}, cssOutside = {
		position : 'absolute',
		left : '-10000px'
	};

	function install(obj) {
		var min = null,
			max = null,
			step = null,
			filterForValue = null,
			filterForCSS = null,
			input = $(this),
			insideSpan = $('<span style="user-select:none;-moz-user-select:none;-webkit-user-select:none;"></span>'),
			outSideSpan = input.wrap('<span class="textslider"></span>'), 
			value = input.val();
			
		insideSpan.attr('unselectable', 'on')
			.insertBefore(input)
			.attr('title', input.attr('title'));

		if (typeof obj == 'object') {
			if ( typeof obj.min != 'undefined') {
				min = obj.min;
			}
			
			if (typeof obj.max != 'undefined') {
				max = obj.max;
			}
			
			if (typeof obj.step != 'undefined') {
				step = obj.step;
			}
			
			if (obj.filterForValue) {
				filterForValue = obj.filterForValue;
			}

			if (obj.filterForCSS) {
				filterForCSS = obj.filterForCSS;
			}
		} else {
			var classes = this.className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				if (classes[i].search(/min=/) != -1) {
					min = classes[i].replace(/min=/, '');
					min = parseFloat(min);
				}
				
				if (classes[i].search(/max=/) != -1) {
					max = classes[i].replace(/max=/, '');
					max = parseFloat(max);
				}
				
				if (classes[i].search(/step=/) != -1) {
					step = classes[i].replace(/step=/, '');
					step = parseFloat(step);
				}
			}
		}

		if (!filterForValue) {
			filterForValue = function (value, data) {
				return value;
			}
		}

		if (!filterForCSS) {
			filterForCSS = function (value, data) {
				return {};
			}
		}

		if (min !== null && max !== null && max < min) {
			min = max = null;
		}

		if (step === null) {
			if (min !== null && max !== null) {
				step = (max - min) / 100;
			} else {
				step = 1;
			}
		}

		if (min !== null && value < min) {
			value = min;
		}
		
		if (max !== null && value > max) {
			value = max;
		}

		input.data('min', min)
			.data('max', max)
			.data('step', step);
			
		insideSpan.click(function () {
			if (isMouseMove && $.browser.msie) {
				return;
			}
	
			insideSpan.hide();
			input.css(cssReset).focus();
		}).mousedown(function (e) {
			isMouseMove = false;
			mousedown = true;
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

		input.val(value).change();
		input.focus(function () {
			input.css(cssReset);
			insideSpan.hide();
		});

		function closeInput(e) {
			if ((e.type == 'keydown' && e.keyCode == 13) || e.type == 'blur') {
				var value = parseFloat(input.val()),
					min = el.data('min'),
					max = el.data('max');
					
				
				if (min !== null && value < min) {
					value = min;
				}
				if (max !== null && value > max) {
					value = max;
				}

				insideSpan.show();
				input.css(cssOutside)
					.val(value)
					.change();
			}
		}

		input.css(cssOutside)
			.blur(closeInput)
			.keydown(closeInput);

		function mousemove(e) {
			if (mousedown) {
				isMouseMove = true;
				var input = $('input', $(currentSpan).parent());
				var value = oldValue + (e.pageX - oldX + oldY - e.pageY) * input.data('step');
				value = Math.floor(value);
				
				var min = input.data('min'),
					max = input.data('max');
					
				if (min !== null && value < min) {
					value = min;
				}
				if (max !== null && value > max) {
					value = max;
				}

				input.val(value).change();

				return false;
			}
		}

		function mouseup(e) {
			mousedown = false;
			$(document)
				.unbind('mousemove.textslider', mousemove)
				.unbind('mouseup.textslider', mouseup);

			return false;
		}

	}

	$.fn.textSlider = function (obj) {
		if (!this.length) {
			return;
		}

		this.each(function (i) {
			install.call(this, i, obj);
		});
		
		return this;
	};
})(jQuery); 