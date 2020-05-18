'use strict';

// Показать список фильтров
(function () {
  window.showFilters = function (pictures) {
    var filtersElem = document.querySelector('.img-filters');
    filtersElem.classList.remove('img-filters--inactive');
    var filtersButtons = filtersElem.querySelectorAll('.img-filters__button');
    // Создадим копию массива с фотографиями
    var newPictures = pictures;

    // Функция удаления всех фотографий
    var removePictures = function () {
      window.picturesList.forEach(function (el) {
        el.remove();
      });
    };

    // Функция обновления списка фотографий
    var updatePictures = function () {
      removePictures();
      window.addFragment(newPictures, window.renderPicture, window.picturesListELement);
      window.addShowBigPictureListener(newPictures);
    };
    // Функция устранения "дребезга" при смене фильтра
    var DEBOUNCE_INTERVAL = 300; // ms
    var lastTimeout;
    var debounce = function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        updatePictures();
      }, DEBOUNCE_INTERVAL);
    };
    // 1. при нажатии на кнопку "по умолчанию" показать исходный массив
    var filterDefaultBtn = filtersElem.querySelector('#filter-default');
    filterDefaultBtn.addEventListener('click', function () {
      newPictures = pictures;

      filtersButtons.forEach(function (el) {
        el.classList.remove('img-filters__button--active');
      });
      filterDefaultBtn.classList.add('img-filters__button--active');

      debounce(updatePictures);
    });

    // 2. при нажатии на кнопку "новые" показать 10 случайных фото
    var filterNewBtn = filtersElem.querySelector('#filter-random');
    filterNewBtn.addEventListener('click', function () {
      newPictures = [];
      for (var i = 0; i < 10; i++) {
        var rand = window.getRandomInt(0, pictures.length - 1);
        if (!newPictures.includes(pictures[rand])) {
          newPictures.push(pictures[rand]);
        } else {
          i--;
        }
      }

      filtersButtons.forEach(function (el) {
        el.classList.remove('img-filters__button--active');
      });
      filterNewBtn.classList.add('img-filters__button--active');

      debounce(updatePictures);
    });

    // 3. При нажатии на кнопку "Обсуждаемые" показать фото в порядке убывания кол-ва комментов
    var filterCommentsBtn = filtersElem.querySelector('#filter-discussed');
    filterCommentsBtn.addEventListener('click', function () {
      newPictures = pictures.slice();

      newPictures.sort(function (first, second) {
        if (first.comments.length < second.comments.length) {
          return 1;
        } else if (first.comments.length > second.comments.length) {
          return -1;
        } else {
          return 0;
        }
      });

      filtersButtons.forEach(function (el) {
        el.classList.remove('img-filters__button--active');
      });
      filterCommentsBtn.classList.add('img-filters__button--active');

      debounce(updatePictures);
    });
  };
})();
