<!DOCTYPE HTML>
<html>
<body>
  <h1>������� ������</h1>

  <script>
    let ul = document.createElement('ul');
    document.body.append(ul);

    while (true) {
      let data = prompt("������� ����� ��� �������� ������", "");

      if (!data) {
        break;
      }

      let li = document.createElement('li');
      li.textContent = data;
      ul.append(li);
    }
  </script>

</body>
</html>
