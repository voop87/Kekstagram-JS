'use strict';
(function () {
  var ESC_KEYCODE = 27;
  // Показ увеличенной фотографии
  var showBigPicture = function (smallPicture) {
    var bigPicture = document.querySelector('.big-picture');
    var bigPictureCancelBtn = bigPicture.querySelector('.big-picture__cancel');

    bigPicture.classList.remove('hidden');
    document.querySelector('.big-picture__img')
      .querySelector('img')
      .src = smallPicture.url;

    document.querySelector('.likes-count').textContent = smallPicture.likes;
    document.querySelector('.comments-count').textContent = smallPicture.comments.length;
    document.querySelector('.social__caption').textContent = smallPicture.description;

    var getRandomAvatar = function () {
      var randomAvatar = 'img/avatar-' + window.getRandomInt(1, 6) + '.svg';
      return randomAvatar;
    };
    for (var i = 0; i < smallPicture.comments.length; i++) {
      var socialComments = document.querySelectorAll('.social__comment');
      socialComments[i].querySelector('.social__picture').src = getRandomAvatar();
      socialComments[i].querySelector('.social__text').textContent = smallPicture.comments[i];
      if (smallPicture.comments.length === 1) {
        socialComments[1].parentNode.removeChild(socialComments[1]);
      }
    }
    // Обработчик закрытия большой картинки
    var closeBigPicture = function () {
      bigPicture.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    };
    var onPopupEscPress = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeBigPicture();
      }
    };

    document.addEventListener('keydown', onPopupEscPress);
    bigPictureCancelBtn.addEventListener('click', closeBigPicture);
  };

  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__comments-loader').classList.add('visually-hidden');

  // Показ увеличенной фотографии при клике на маленькую
  var picturesListELement = document.querySelector('.pictures');
  var picturesList = picturesListELement.querySelectorAll('.picture');

  for (var i = 0; i < picturesList.length; i++) {
    (function (picture) {
      picturesList[i].addEventListener('click', function () {
        showBigPicture(picture);
      });
    })(window.pictures[i]);
  }
})();
