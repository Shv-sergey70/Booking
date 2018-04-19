var MAP_PIN_WIDTH = 50/2; //Половина ширины кнопки
var MAP_PIN_HEIGHT = 70; //Высота кнопки
var USER_MAP_PIN_WIDTH = 64/2; //Половина ширины кнопки пользователя
var USER_MAP_PIN_HEIGHT = 81; //Высота кнопки потльзователя
var map = document.querySelector(".map");
var template = document.querySelector("template").content;
var mapPins = document.querySelector(".map__pins");
var adForm = document.querySelector(".ad-form");
var offerType = {
  flat: "Квартира",
  house: "Дом",
  bungalo: "Бунгало"
};
var userPin = map.querySelector(".map__pin--main");
var allMapPins;
var allMapCards;
var popupClose;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var click = 0;
var address = document.querySelector("#address");

address.value = "x: 602, y: 455"; //Устанавливаем значение по умолчанию для адреса
address.setAttribute("readonly", "readonly");
//Генерация иконки объявления - шаблона
var generateAdv = function(similarAdvertPin, i) {
  var advElementPinTemplate = template.querySelector(".map__pin").cloneNode(true);
  advElementPinTemplate.querySelector("img").src = similarAdvertPin.author.avatar;
  advElementPinTemplate.style = "left: " + (similarAdvertPin.location.x - MAP_PIN_WIDTH) + "px; " + "top: " + (similarAdvertPin.location.y - MAP_PIN_HEIGHT) + "px";
  advElementPinTemplate.className = "map__pin button" + i;
  return advElementPinTemplate;
};

//Генерация всех иконок объявления - шаблона
var createAdvFragmentPin = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < similarAdv.length; i++) {
    fragmentPin.appendChild(generateAdv(similarAdv[i], i));
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

// var createAdvFragmentMap = function() {
//   var fragmentMap = document.createDocumentFragment();
//   for (var i = 0; i < similarAdv.length; i++) {
//     fragmentMap.appendChild(renderMapCard(similarAdv[i]));
//   };
//   return map.appendChild(fragmentMap);
// };
var successHandler = function (similarAdv) {
  var fragmentMap = document.createDocumentFragment();
  for (var i = 0; i < similarAdv.length; i++) {
    fragmentMap.appendChild(renderMapCard(similarAdv[i]));
  };
  return map.appendChild(fragmentMap);
};
var createAdvFragmentMap = function() {
  window.load(successHandler);
};

userPin.addEventListener("mousedown", function(eventDown) {
  eventDown.preventDefault();
  var startCoords = {
    x: eventDown.clientX,
    y: eventDown.clientY
  };
  var onMouseMove = function(moveEvt) {
    moveEvt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };
    userPin.style.top = (userPin.offsetTop - shift.y) + "px";
    userPin.style.left = (userPin.offsetLeft - shift.x) + "px";
    address.value = "x: " + (userPin.offsetLeft + USER_MAP_PIN_WIDTH) + ", y: " + (userPin.offsetTop + USER_MAP_PIN_HEIGHT);
    if (Number(userPin.style.top.slice(0, -2)) < 70) {
      userPin.style.top = 70 + "px";
    } else if (Number(userPin.style.top.slice(0, -2)) > 620) {
      userPin.style.top = 620 + "px";
    } else if (Number(userPin.style.left.slice(0, -2)) < -32) {
      userPin.style.left = -32 + "px";
    } else if (Number(userPin.style.left.slice(0, -2)) > 1166) {
      userPin.style.left = 1166 + "px";
    }
  };
  var onMouseUp = function() {
    click++;
    map.classList.remove("map--faded");
    (function() {
      if (click <= 1) {
        //Вызов генерации всех иконок объявления - шаблона
        createAdvFragmentPin();
        //Вызов функции создания шаблона
        createAdvFragmentMap();
        //Отображаем форму
        adForm.classList.remove("ad-form--disabled");
        //Включаем поля формы
        (function() {
          for(var i = 0; i < fieldsetForm.length; i++) {
            fieldsetForm[i].removeAttribute("disabled");
          }
        })();
        allMapPins = document.querySelectorAll(".map__pin");
        allMapCards = document.querySelectorAll(".map__card");
        popupClose = document.querySelectorAll(".popup__close");
      }
    })();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mousemove", onMouseMove);
  };
  document.addEventListener("mousemove", onMouseMove);
  //Обработка событий отпускания ЛКМ
  document.addEventListener("mouseup", onMouseUp);
});


  map.addEventListener("click", function(event) {
  for (var i = 0; i < allMapCards.length; i++) {
    if ((event.target.classList.contains("map__pin")) || (event.target.parentNode.classList.contains("map__pin"))) {
      allMapCards[i].classList.add("hidden");
    }
    if ((event.target.className == ("map__pin button" + [i])) || (event.target.parentNode.className == ("map__pin button" + [i]))) {
      allMapCards[i].classList.remove("hidden");
    }
  };
  for (var j = 0; j < popupClose.length; j++) {
    if (event.target.className == "popup__close") {
      allMapCards[j].classList.add("hidden");
      allMapPins[j+1].classList.remove("map__pin--active");
    }
  }
  for (var k = 0; k < allMapPins.length - 1; k++) {
    if (event.target.className == ("map__pin button" + [k])) {
      event.target.classList.add("map__pin--active");
    } else if (event.target.parentNode.className == ("map__pin button" + [k])) {
      event.target.parentNode.classList.add("map__pin--active");
    } else if ((event.target.classList.contains("map__pin")) || (event.target.parentNode.classList.contains("map__pin"))) {
      allMapPins[k+1].classList.remove("map__pin--active");
    }
  }
}, false);
  map.addEventListener("keydown", function(event) {
    for (var i = 0; i < allMapPins.length - 1; i++) {
      if ((event.keyCode == ENTER_KEYCODE) && (document.activeElement.classList.contains("map__pin button" + i))) {
        allMapCards[i].classList.remove("hidden");
      }
    }
    for (var i = 0; i < allMapPins.length - 1; i++) {
      if ((event.keyCode == ESC_KEYCODE) && (!allMapCards[i].classList.contains("hidden"))) {
        allMapCards[i].classList.add("hidden");
        allMapPins[i+1].classList.remove("map__pin--active");
      }
    }
  }, false);
