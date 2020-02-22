var pictures = [];
var PICTURES_COUNT = 25;
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
    var randomComment = COMMENTS[getRandomInt(0, COMMENTS.length)];
    var randomComments = [];
    randomComments.length = getRandomInt(1, 2);
    
    for (var i = 0; i < randomComments.length; i++) {
      randomComments[i] = randomComment;
    }
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
  };

  var picture = {
    url: '',
    likes: 0,
    comments: [],
    description: ''
  };

  for (var i = 0; i < picturesCount; i++) {
    picture.url = 'photos/' + (i + 1) + '.jpg';
    picture.likes = getRandomInt(15, 200);
    picture.comments = getRandomComments();
    picture.description = getRandomDescription();

    pictures[i] = picture;
  }
};

addRandomPictures(PICTURES_COUNT);

var renderPicture = function (picture) {
  pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}

picturesListELement.appendChild(fragment);

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

