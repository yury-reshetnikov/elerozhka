<!DOCTYPE html>
<html>
<body>

  <div id="container"></div>

  <script>
    let data = {
      "����": {
        "������": {},
        "������": {}
      },

      "�������": {
        "��������": {
          "�������": {},
          "���": {}
        },
        "���������": {
          "������": {},
          "��������": {}
        }
      }
    };

    function createTree(container, obj) {
      container.innerHTML = createTreeText(obj);
    }

    function createTreeText(obj) {
      let li = '';
      let ul;
      for (let key in obj) {
        li += '<li>' + key + createTreeText(obj[key]) + '</li>';
      }
      if (li) {
        ul = '<ul>' + li + '</ul>'
      }
      return ul || '';
    }

    createTree(container, data);
  </script>
</body>
</html>
