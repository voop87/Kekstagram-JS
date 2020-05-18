'use strict';

(function () {
  window.backend = {
    load: function (onLoad, onError) {
      var URL = 'https://javascript.pages.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) { // Статус успешной загрузки
          onLoad(xhr.response);
        } else { // Обрабатывает остальные статусы кроме error и timeout
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + ' секунд');
      });

      xhr.timeout = 10000; // 10s
      xhr.open('GET', URL);
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var URL = 'https://javascript.pages.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + ' секунд');
      });

      xhr.timeout = 15000; // 15s

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
