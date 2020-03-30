'use strict';
(function () {
  var ESC_KEYCODE = 27;
  // Загрузка изображения и показ формы редактирования
  var picturesListELement = document.querySelector('.pictures');
  var uploadFileInput = picturesListELement.querySelector('#upload-file');
  var imgUploadWindow = picturesListELement.querySelector('.img-upload__overlay');
  var imgUploadCancelButton = picturesListELement.querySelector('.img-upload__cancel');
  var inputHashtag = imgUploadWindow.querySelector('.text__hashtags');
  var inputDescription = imgUploadWindow.querySelector('.text__description');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeImgUploadForm();
    }
  };
  var openImgUploadForm = function () {
    imgUploadWindow.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };
  var closeImgUploadForm = function () {
    imgUploadWindow.classList.add('hidden');
    uploadFileInput.value = '';
    // Остальные инпуты формы для сброса значений на дефолт
    resetScaleLevel();
    resetEffectLevel();
    DEFAULT_EFFECT_TYPE.checked = 'true';
    inputHashtag.value = '';
    inputDescription.value = '';
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Уровень увеличения фото
  var DEFAULT_SCALE_LEVEL = '55';
  var scaleLevelInput = imgUploadWindow.querySelector('.scale__control--value');
  var uploadImg = imgUploadWindow.querySelector('img');

  // Сбрасывает уровень увеличения фото на дефолт
  var resetScaleLevel = function () {
    scaleLevelInput.value = DEFAULT_SCALE_LEVEL + '%';
    uploadImg.style.transform = 'scale(1)';
  };

  // Уровень эффектов на фото
  var DEFAULT_EFFECT_LEVEL = 20;
  var effectLevelPin = imgUploadWindow.querySelector('.effect-level__pin');
  var effectLevelInput = imgUploadWindow.querySelector('.effect-level__value');
  var effectLevelDepth = imgUploadWindow.querySelector('.effect-level__depth');

  // Сбрасывает уровень эффекта на дефолт
  var resetEffectLevel = function () {
    effectLevelInput.value = DEFAULT_EFFECT_LEVEL;
    effectLevelDepth.style.width = DEFAULT_EFFECT_LEVEL + '%';
    effectLevelPin.style.left = DEFAULT_EFFECT_LEVEL + '%';
  };

  // Тип эффекта по умолчанию
  var DEFAULT_EFFECT_TYPE = imgUploadWindow.querySelector('#effect-none');

  uploadFileInput.addEventListener('change', function () {
    openImgUploadForm();

    var effectLevelLine = imgUploadWindow.querySelector('.effect-level__line');
    var effectTypeList = imgUploadWindow.querySelector('.effects__list');
    var effectTypes = imgUploadWindow.querySelectorAll('.effects__radio');

    // Сбрасывает уровень эффекта на дефолт при клике на тип эффекта
    var onEffectTypeChange = function () {
      for (var i = 0; i < effectTypes.length; i++) {
        effectTypes[i].addEventListener('change', resetEffectLevel);
      }
    };
    effectTypeList.addEventListener('click', onEffectTypeChange);

    // Изменение уровня фильтра при перетаскивании ползунка
    effectLevelPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var startPos = evt.clientX;

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var lineWidth = parseInt(window.getComputedStyle(effectLevelLine).width, 10);

        var PIN_MIN_POSITION = 0;
        var PIN_MAX_POSITION = lineWidth;

        var shift = startPos - moveEvt.clientX;
        startPos = moveEvt.clientX;

        effectLevelPin.style.left = (effectLevelPin.offsetLeft - shift) + 'px';
        if ((effectLevelPin.offsetLeft - shift) < PIN_MIN_POSITION) {
          effectLevelPin.style.left = PIN_MIN_POSITION;
        }
        if ((effectLevelPin.offsetLeft - shift) > PIN_MAX_POSITION) {
          effectLevelPin.style.left = PIN_MAX_POSITION + 'px';
        }

        var pinPosition = parseInt(effectLevelPin.style.left, 10);
        var effectLevel = Math.round(pinPosition / lineWidth * 100);
        effectLevelInput.value = effectLevel;
        effectLevelDepth.style.width = effectLevel + '%';
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Изменение уровня фильтра при клике на линию слайдера
    effectLevelLine.addEventListener('click', function (evt) {
      evt.preventDefault();

      var lineWidth = parseInt(window.getComputedStyle(effectLevelLine).width, 10);
      var PIN_MIN_POSITION = 0;
      var PIN_MAX_POSITION = lineWidth;
      var LINE_START_POSITION = 254;
      var startPos = evt.clientX - LINE_START_POSITION;
      effectLevelPin.style.left = startPos + 'px';
      if (startPos < PIN_MIN_POSITION) {
        effectLevelPin.style.left = PIN_MIN_POSITION;
      }
      if (startPos > PIN_MAX_POSITION) {
        effectLevelPin.style.left = PIN_MAX_POSITION + 'px';
      }

      var pinPosition = parseInt(effectLevelPin.style.left, 10);
      var effectLevel = Math.round(pinPosition / lineWidth * 100);
      effectLevelInput.value = effectLevel;
      effectLevelDepth.style.width = effectLevel + '%';
    });

    imgUploadCancelButton.addEventListener('click', function () {
      closeImgUploadForm();
    });
    imgUploadCancelButton.addEventListener('keydown', onPopupEscPress);

    // Проверка валидности ввода хэш-тегов
    var checkInputHashtagValidity = function () {
      var hashtagList = inputHashtag.value.split(' ');
      inputHashtag.setCustomValidity('');

      for (var i = 0; i < hashtagList.length; i++) {
        if (hashtagList[i].length <= 20) {
          if (hashtagList[i].includes('#', 0)) {
            if (hashtagList[i].includes('#', 1)) {
              inputHashtag.setCustomValidity('Внутри хэш-тега не может быть символа #');
            }
          } else {
            inputHashtag.setCustomValidity('Хэш-тег должен начинаться с символа #');
          }
        } else {
          inputHashtag.setCustomValidity('Длина хэш-тега должна быть не более 20 символов');
        }
      }
    };
    inputHashtag.addEventListener('change', checkInputHashtagValidity);

    // Отправляем данные формы на сервер и закрываем при успехе диалоговое окно
    var form = document.querySelector('.img-upload__form');
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();

      window.backend.save(new FormData(form), function () {
        closeImgUploadForm();
      }, window.errorHandler);
    });
  });
})();
