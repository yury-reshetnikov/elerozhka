<!DOCTYPE html>
<html>
<body>

  <div data-widget-name="menu">Choose the genre</div>

  <script>
    let elem = document.querySelector('[data-widget-name]');
    alert(elem.dataset.widgetName);
    alert(elem.getAttribute('data-widget-name'));
  </script>
</body>
</html>
