var locationMap = {
  x: 300 + Math.floor(Math.random() * (600)),
  y: 100 + Math.floor(Math.random() * (400))
};
var TITLE = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPE = ["flat", "house", "bungalo"];
var CHECKIN = ["12:00", "13:00", "14:00"];
var CHECKOUT = ["12:00", "13:00", "14:00"];
var FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var NUMBER_OF_ADV = 8; //Число объявлений
var MAP_PIN_WIDTH = 50/2; //Половина ширины кнопки
var MAP_PIN_HEIGHT = 70; //Высота кнопки
var similarAdv = [];
var map = document.querySelector(".map");
var template = document.querySelector("template").content;
var mapPins = document.querySelector(".map__pins");
var adForm = document.querySelector(".ad-form");
var fieldsetForm = document.querySelectorAll("fieldset");
var offerType = {
  flat: "Квартира",
  house: "Дом",
  bungalo: "Бунгало"
};
var userPin = map.querySelector(".map__pin--main");
var allMapPins;
var allMapCards;

//Генерация целого числа в диапазоне min max
var getRandomInteger = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
};
//Генерация случайного числа в массиве
var getRandomNumberForArray = function(array) {
  return Math.floor(Math.random() * array.length)
}

//Генерация иконки объявления - шаблона
var generateAdv = function(similarAdvertPin) {
  var advElementPinTemplate = template.querySelector(".map__pin").cloneNode(true);
  advElementPinTemplate.querySelector("img").src = similarAdvertPin.author.avatar;
  advElementPinTemplate.style = "left: " + (similarAdvertPin.location.x - MAP_PIN_WIDTH) + "px; " + "top: " + (similarAdvertPin.location.y - MAP_PIN_HEIGHT) + "px";
  // advElementPinTemplate.addEventListener("click", function() {
  //   var allMapCards =template.querySelectorAll(".map__card")
  //   advElementMapCardTemplate.classList.remove("hidden");
  // });
  return advElementPinTemplate;
};
//Генерация всех иконок объявления - шаблона
var createAdvFragmentPin = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < similarAdv.length; i++) {
    fragmentPin.appendChild(generateAdv(similarAdv[i]));
  };
  mapPins.appendChild(fragmentPin)
  return mapPins;
};

//Отрисовка параметров похожего объявления
var renderMapCard = function(similarAdvMapCard) {
  var advElementMapCardTemplate = template.querySelector(".map__card").cloneNode(true);
  var renderFeatures = function(similarAdvFeatures) {
    var featuresUl = advElementMapCardTemplate.querySelector("ul");
    while (featuresUl.firstChild) {
      featuresUl.removeChild(featuresUl.firstChild)
    };
    var fragmentFeature = document.createDocumentFragment();
    for (var i = 0; i < similarAdvFeatures.offer.features.length; i++) {
      var featuresLi = document.createElement("li");
      featuresLi.className = "popup__feature popup__feature--" + similarAdvFeatures.offer.features[i];
      fragmentFeature.appendChild(featuresLi);
    }
    return featuresUl.appendChild(fragmentFeature);
  };
  advElementMapCardTemplate.classList.add("hidden");//Удаление попапа по умолчанию
  advElementMapCardTemplate.querySelector(".popup__title").textContent = similarAdvMapCard.offer.title;
  advElementMapCardTemplate.querySelector(".popup__text--address").textContent = similarAdvMapCard.offer.adress;
  advElementMapCardTemplate.querySelector(".popup__text--price").innerHTML = similarAdvMapCard.offer.price + " &#8381;/ночь";
  advElementMapCardTemplate.querySelector(".popup__type").textContent = offerType[similarAdvMapCard.offer.type];
  advElementMapCardTemplate.querySelector(".popup__text--capacity").textContent = similarAdvMapCard.offer.rooms + " комнаты для " + similarAdvMapCard.offer.guests + " гостей";
  advElementMapCardTemplate.querySelector(".popup__text--time").textContent = "Заезд после " + similarAdvMapCard.offer.checkin + ", выезд до " + similarAdvMapCard.offer.checkout;
  renderFeatures(similarAdvMapCard);
  advElementMapCardTemplate.querySelector(".popup__avatar").src = similarAdvMapCard.author.avatar;
  return advElementMapCardTemplate;
};

//Создание шаблона похожего объявления
var createAdvFragmentMap = function() {
  var fragmentMap = document.createDocumentFragment();
  fragmentMap.appendChild(renderMapCard(similarAdv[2]));
  return map.appendChild(fragmentMap);
};

//Генерируем похожие объявления
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
        checkout: CHECKOUT[getRandomNumberForArray(CHECKOUT)],
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
//disabled - всем полям формы по умолчанию
(function() {
  for(var i = 0; i < fieldsetForm.length; i++) {
    fieldsetForm[i].disabled = "true";
  }
})();
//Обработка событий отпускания ЛКМ
userPin.addEventListener("mouseup", function() {
  map.classList.remove("map--faded");
  //Вызов генерации всех иконок объявления - шаблона
  createAdvFragmentPin();
  //Вызов функции создания шаблона
  createAdvFragmentMap();
  //Отображаем форму
  adForm.classList.remove("ad-form--disabled");
  //Включаем поля формы
  (function() {
    for(var i = 0; i < fieldsetForm.length; i++) {
      fieldsetForm[i].disabled = "false";
    }
  })();
  allMapPins = document.querySelectorAll(".map__pin");
  allMapCards = document.querySelectorAll(".map__card");
});

// var allMapCards = document.querySelectorAll(".map__card");
(function() {
  map.addEventListener("click", function() {
  for (var i = 0; i < allMapPins.length; i++) {
    if (event.target.className[i] == ".map__pin") {
      allMapCards[i].classList.remove("hidden")
    }
  }
}, false);
})();
