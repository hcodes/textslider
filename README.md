# Текстовый слайдер

Плюсы:
+ компактность размещения;
+ ввод данных при помощи мышки;
+ быстрая оценка возможных вариантов.

## Подключение
  ```HTML
<html>
<head>
    <link rel="stylesheet" href="./textslider.css"  />
    <script src="./jquery.js"></script>
    <script src="./jquery.textslider.js"></script>
</head>
<body>
    <input type="text" class="textslider" value="25" />
    <script>
        $(document).ready(function() {
            $('input.textslider').textSlider({min: 0, max: 50});
        });
    </script>
</body>
</html>
  ```

## Примеры использования
```js
$('input.textslider').textSlider({min: 0, max: 50});
```
  
```js
$('input.textslider').textSlider({
    min: 8,
    max: 30,
    filterForCSS: function(value, data) {
        return {fontSize: value + 'px'};
    }
});
```

```js
$('input.textslider').textSlider({
    min: -50,
    max: 50,
    filterForValue: function(value, data) {
        return value > 0 ? '+' + value : value;
    }
});
```
