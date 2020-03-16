var pictures = [];
var PICTURES_COUNT = 25;
var ESC_KEYCODE = 27;
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesListELement = document.querySelector('.pictures');

//Генератор случайных целых чисел
function getRandomInt(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

var addRandomPictures = function (picturesCount) {
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  function getRandomComments () {
    var randomComments = [];
    randomComments.length = getRandomInt(1, 2);
    
    for (var i = 0; i < randomComments.length; i++) {
      var randomComment = COMMENTS[getRandomInt(0, COMMENTS.length-1)];
      randomComments[i] = randomComment;
    }
    return randomComments;
  };

  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  function getRandomDescription () {
    var randomDescription = DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length)];
    return randomDescription;
  }

  for (var i = 0; i < picturesCount; i++) {
    var randomPicture = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomInt(15, 200),
      comments: getRandomComments(),
      description: getRandomDescription()
    };
    pictures[i] = randomPicture;
  }
  return pictures;
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

addFragment(pictures, renderPicture, picturesListELement);


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
    var randomAvatar = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
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
var picturesList = picturesListELement.querySelectorAll('.picture');
// НЕ РАБОТАЕТ ДОДЕЛАТЬ!!
for (let i = 0; i < picturesList.length; i++) {
  picturesList[i].addEventListener('click', function () {
    showBigPicture(pictures[i]);
  });
}

// Загрузка изображения и показ формы редактирования
var uploadFileInput = picturesListELement.querySelector('#upload-file');
var imgUploadForm = picturesListELement.querySelector('.img-upload__overlay');
var imgUploadCancelButton = picturesListELement.querySelector('.img-upload__cancel');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeImgUploadForm();
  }
};
var openImgUploadForm = function () {
  imgUploadForm.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};
var closeImgUploadForm = function () {
  imgUploadForm.classList.add('hidden');
  uploadFileInput.value = '';
  document.removeEventListener('keydown', onPopupEscPress);
};

uploadFileInput.addEventListener('change', function () {
  openImgUploadForm();

  // Изменение уровня эффектов на фото
  var DEFAULT_EFFECT_LEVEL = 20;
  var effectLevelPin = imgUploadForm.querySelector('.effect-level__pin');
  var effectLevelLine = imgUploadForm.querySelector('.effect-level__line');
  var effectLevelInput = imgUploadForm.querySelector('.effect-level__value');
  var effectLevelDepth = imgUploadForm.querySelector('.effect-level__depth');
  var effectTypeList = imgUploadForm.querySelector('.effects__list');
  var effectTypes = imgUploadForm.querySelectorAll('.effects__radio');

// Сбрасывает уровень эффекта на дефолт при клике на тип эффекта
  var onEffectTypeChange = function () {
    for (var i = 0; i < effectTypes.length; i++) {
      effectTypes[i].addEventListener('change', function () {
        effectLevelInput.value = DEFAULT_EFFECT_LEVEL;
        effectLevelDepth.style.width = DEFAULT_EFFECT_LEVEL + '%';
        effectLevelPin.style.left = DEFAULT_EFFECT_LEVEL + '%';
      });
    }
  };
  
  effectTypeList.addEventListener('click', onEffectTypeChange);

  //Изменение уровня фильтра при перетаскивании ползунка
  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startPos = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var lineWidth = parseInt(window.getComputedStyle(effectLevelLine).width);

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

      var pinPosition = parseInt(effectLevelPin.style.left);
      
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

    var lineWidth = parseInt(window.getComputedStyle(effectLevelLine).width);
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

    var pinPosition = parseInt(effectLevelPin.style.left);
    
    var effectLevel = Math.round(pinPosition / lineWidth * 100);
    effectLevelInput.value = effectLevel;
    effectLevelDepth.style.width = effectLevel + '%';
  });

  imgUploadCancelButton.addEventListener('click', function () {
    closeImgUploadForm();
  });
  imgUploadCancelButton.addEventListener('keydown', onPopupEscPress);
  
  // Проверка валидности ввода хэш-тегов
  var inputHashtag = document.querySelector('.text__hashtags');
  
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
});
