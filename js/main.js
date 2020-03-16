'use strict';
// Создание и отрисовка случайных фото
(function () {
  window.pictures = [];
  var PICTURES_COUNT = 25;

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesListELement = document.querySelector('.pictures');

  // Генератор случайных целых чисел
  window.getRandomInt = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  var addRandomPictures = function (picturesCount) {
    var COMMENTS = [
      'Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
    ];

    function getRandomComments() {
      var randomComments = [];
      randomComments.length = window.getRandomInt(1, 2);
      for (var i = 0; i < randomComments.length; i++) {
        var randomComment = COMMENTS[window.getRandomInt(0, COMMENTS.length - 1)];
        randomComments[i] = randomComment;
      }
      return randomComments;
    }

    var DESCRIPTIONS = [
      'Тестим новую камеру!',
      'Затусили с друзьями на море',
      'Как же круто тут кормят',
      'Отдыхаем...',
      'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
      'Вот это тачка!'
    ];

    function getRandomDescription() {
      var randomDescription = DESCRIPTIONS[window.getRandomInt(0, DESCRIPTIONS.length)];
      return randomDescription;
    }

    for (var i = 0; i < picturesCount; i++) {
      var randomPicture = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: window.getRandomInt(15, 200),
        comments: getRandomComments(),
        description: getRandomDescription()
      };
      window.pictures[i] = randomPicture;
    }
    return window.pictures;
  };

  addRandomPictures(PICTURES_COUNT);

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  var addFragment = function (elemArray, renderFunction, parentElem) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < elemArray.length; i++) {
      fragment.appendChild(renderFunction(elemArray[i]));
    }
    parentElem.appendChild(fragment);
  };

  addFragment(window.pictures, renderPicture, picturesListELement);
})();
