var locationMap = {
  x: 300 + Math.floor(Math.random() * (600)),
  y: 100 + Math.floor(Math.random() * (400))
};
var TITLE = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPE = ["flat", "house", "bungalo"];
var CHECKIN = ["12:00", "13:00", "14:00"];
var FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var NUMBER_OF_ADV = 8;
var MAP_PIN_WIDTH = 50/2;
var MAP_PIN_HEIGHT = 70;

var getRandomInteger = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
};

var getRandomNumberForArray = function(array) {
  return Math.floor(Math.random() * array.length)
}

var similarAdv = [];
(function() {
  for (var i = 0; i < NUMBER_OF_ADV; i++) {
    locationX = getRandomInteger(300, 900);
    locationY = getRandomInteger(100, 500);
    similarAdv.push({
      author: {
        avatar: "img/avatars/user0" + (i + 1) + ".png"
      },
      offer: {
        title: TITLE[i],
        adress: locationX + ", " + locationY,
        price: getRandomInteger(1000, 1000000),
        type: TYPE[getRandomNumberForArray(TYPE)],
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(1, 20),
        checkin: CHECKIN[getRandomNumberForArray(CHECKIN)],
        features: FEATURES.slice(getRandomInteger(0, 2), getRandomInteger(3, 5)),
        description: "",
        photos: []
      },
      location: {
        x: locationX,
        y: locationY
      }
    })
  }
  return similarAdv;
})();

var map = document.querySelector(".map");
map.classList.remove("map--faded");
var template = document.querySelector("template").content;
var mapPins = document.querySelector(".map__pins");
var generateAdv = function(similarAdvertPin) {
  var advElementPinTemplate = template.querySelector(".map__pin").cloneNode(true);
  advElementPinTemplate.querySelector("img").src = similarAdvertPin.author.avatar;
  advElementPinTemplate.style = "left: " + (similarAdvertPin.location.x - MAP_PIN_WIDTH) + "px; " + "top: " + (similarAdvertPin.location.y - MAP_PIN_HEIGHT) + "px";
  return advElementPinTemplate;
};

var createAdvFragmentPin = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < similarAdv.length; i++) {
    fragmentPin.appendChild(generateAdv(similarAdv[i]));
  };
  mapPins.appendChild(fragmentPin)
};

createAdvFragmentPin();

var offerType = {
  flat: "Квартира",
  house: "Дом",
  bungalo: "Бунгало"
}

var blockMap = document.querySelector(".map");

var renderMapCard = function(similarAdvMapCard) {
  var advElementMapCardTemplate = template.querySelector(".map__card").cloneNode(true);
  advElementMapCardTemplate.querySelector(".popup__title").textContent = similarAdvMapCard.offer.title;
  advElementMapCardTemplate.querySelector(".popup__text--address").textContent = similarAdvMapCard.offer.adress;
  advElementMapCardTemplate.querySelector(".popup__text--price").innerHTML = similarAdvMapCard.offer.price + " &#8381;/ночь";
  advElementMapCardTemplate.querySelector(".popup__type").textContent = offerType[similarAdvMapCard.offer.type];
  advElementMapCardTemplate.querySelector(".popup__text--capacity").innerHTML = similarAdvMapCard.offer.rooms + " комнаты для " + similarAdvMapCard.offer.guests + " гостей";
  return advElementMapCardTemplate;
}

var createAdvFragmentMap = function() {
  var fragmentMap = document.createDocumentFragment();
  fragmentMap.appendChild(renderMapCard(similarAdv[2]));
  return blockMap.appendChild(fragmentMap);
}

createAdvFragmentMap();
