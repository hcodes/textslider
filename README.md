# Текстовый слайдер

Плюсы:
+ компактность размещения;
+ ввод данных при помощи мышки;
+ быстрая оценка возможных вариантов.

## Подключение
  ```HTML
<html>
<head>
    <link rel="stylesheet" type="text/css" href="./textslider.css"  />
    <script type="text/javascript" src="./jquery.js"></script>
    <script type="text/javascript" src="./jquery.textslider.js"></script>
</head>
<body>
    <input type="text" class="textslider" value="25" />
    <script type="text/javascript">
        $(document).ready(function() {
            $('input.textslider').textSlider({min: 0, max: 50});
        });
    </script>
</body>
</html>
  ```

## Примеры использования
  ```JavaScript
$('input.textslider').textSlider({min: 0, max: 50});
  ```
  
  ```JavaScript
$('input.textslider').textSlider({min: -500, max: 500});
  ```
  
  ```JavaScript
$('input.textslider').textSlider({
    min: 8,
    max: 30,
    filterForCSS: function(value, data) {
        return {fontSize: value + 'px'};
    }
});
  ```

  ```JavaScript
$('input.textslider').textSlider({
    min: -50,
    max: 50,
    filterForValue: function(value, data) {
        return value > 0 ? '+' + value : value;
    }
});
  ```
