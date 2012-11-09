$(function() {
    var context = $('body');
    $('input.ip', context).textSlider({min: 0, max: 255});
    $('input.len', context).textSlider({min: 50, max: 400, filterForValue: function (value, data) {
            if (value == data.min) {
                return value + '<span style="color:red">&darr;</span>';
            }
            
            if (value == data.max) {
                return value + '<span style="color:red">&uarr;</span>';
            }
            
            return value;
        }
    });
    $('input.month', context).textSlider({min: 1, max: 12, filterForValue: function (value, data) {
        var months = [
            {title: 'Январь', color: 'blue'},
            {title: 'Февраль', color: 'blue'},
            {title: 'Март', color: 'green'},
            {title: 'Апрель', color: 'green'},
            {title: 'Май', color: 'green'},
            {title: 'Июнь', color: '#E7D02F'},
            {title: 'Июль', color: '#E7D02F'},
            {title: 'Август', color: '#E7D02F'},
            {title: 'Сентябрь', color: '#FF6000'},
            {title: 'Октябрь', color: '#FF6000'},
            {title: 'Ноябрь', color: '#FF6000'},
            {title: 'Декабрь', color: 'blue'}
        ];
        
        var t = months[parseInt(value) - 1];
        data.span.css('color', t.color);
        return t.title;
    }}); 

    $('input.fs', context).textSlider({min: 10, max: 90,
        filterForCSS: function(value, data) {
            var obj = {};
            obj.fontSize = value + 'px';
            return obj;
        }        
    });
    
    $('input.width, input.height', context).textSlider({min: 10, max: 90,
         filterForCSS: function(value, data) {
            var obj = {};
            var minValue = data.min,
                maxValue = data.max,
                minSize = 10,
                maxSize = 40;
            
            obj.fontSize = ((value - minValue) / (maxValue - minValue) * (maxSize - minSize) + minSize) + 'px';
            return obj;
        }
    });    

   $('input.zp', context).textSlider({min: 0, max: 100,
         filterForValue: function(value, data) {
            var text = '';
            for (var i = 0; i < parseInt(value); i++) {
                text += '0';
            }
            
            return '$1' + text;
        }
    });
    
   $('input.angle', context).textSlider({min: 0, max: 360,
         filterForValue: function(value, data) {
            var text = value + '<span style="position:relative; -webkit-transform: rotate(' + value + 'deg); -moz-transform: rotate(' + value + 'deg);">&rarr;</span>';
            
            return text;
        }
    }); 

    $('input.temp', context).textSlider({min: 0, max: 100,
         filterForCSS: function(value, data) {
            function inter(value, x1, x2, y1, y2) {
                return ((value - x1) / (x2 - x1) * (y2 - y1) + y1);
            }
            
            var obj = {},
                red = inter(value, data.min, data.max, 0, 255),
                blue = inter(value, data.min, data.max, 255, 0);
                         
            obj.color = 'rgb(' + red + ',' + '0,' + blue + ')';             
            
            return obj;
        }
    });
    
});