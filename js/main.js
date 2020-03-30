'use strict';
// Создание и отрисовка случайных фото
(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesListELement = document.querySelector('.pictures');

  // Генератор случайных целых чисел
  window.getRandomInt = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  // Получаем список фотографий, загруженных с сервера
  var successHandler = function (pictures) {
    var addFragment = function (elemArray, renderFunction, parentElem) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < elemArray.length; i++) {
        fragment.appendChild(renderFunction(elemArray[i]));
      }
      parentElem.appendChild(fragment);
    };
    addFragment(pictures, renderPicture, picturesListELement);
  };
  // Создаем окно, в котором будет отображаться сообщение об ошибке
  window.errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.lineHeight = '40px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };
  window.backend.load(successHandler, window.errorHandler);
})();
