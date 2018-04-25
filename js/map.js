var MAP_PIN_WIDTH = 50/2; //Половина ширины кнопки
var MAP_PIN_HEIGHT = 70; //Высота кнопки
var UserPinBorder = {
  BOTTOM: 70,
  TOP: 620,
  LEFT: -32,
  RIGHT: 1166
};
var USER_MAP_PIN_WIDTH = 64/2; //Половина ширины кнопки пользователя
var USER_MAP_PIN_HEIGHT = 81; //Высота кнопки потльзователя
var map = document.querySelector(".map");
var template = document.querySelector("template").content;
var mapPins = document.querySelector(".map__pins");
var userPin = map.querySelector(".map__pin--main");
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var click = 0;
var address = document.querySelector("#address");
address.value = "x: 602, y: 455"; //Устанавливаем значение по умолчанию для адреса
address.setAttribute("readonly", "readonly");
window.mapFilter = document.querySelector(".map__filters");

//Отрисовка карты
var renderAllMap = function() {
    var HouseType = {
      ANY: mapFilter.querySelector("#housing-type [value='any']"),
      FLAT: mapFilter.querySelector("#housing-type [value='flat']"),
      HOUSE: mapFilter.querySelector("#housing-type [value='house']"),
      BUNGALO: mapFilter.querySelector("#housing-type [value='bungalo']")
    };
    var HousePrice = {
      ANY: mapFilter.querySelector("#housing-price [value='any']"),
      MIDDLE: mapFilter.querySelector("#housing-price [value='middle']"),
      LOW: mapFilter.querySelector("#housing-price [value='low']"),
      HIGH: mapFilter.querySelector("#housing-price [value='high']")
    };
    var HouseRooms = {
      ANY: mapFilter.querySelector("#housing-rooms [value='any']"),
      ONE: mapFilter.querySelector("#housing-rooms [value='1']"),
      TWO: mapFilter.querySelector("#housing-rooms [value='2']"),
      THREE: mapFilter.querySelector("#housing-rooms [value='3']")
    };
    var HouseGuests = {
      ANY: mapFilter.querySelector("#housing-guests [value='any']"),
      ONE: mapFilter.querySelector("#housing-guests [value='1']"),
      TWO: mapFilter.querySelector("#housing-guests [value='2']")
    };
    var HouseFeature = {
      WIFI: mapFilter.querySelector("#housing-features [value='wifi']"),
      DISHWASHER: mapFilter.querySelector("#housing-features [value='dishwasher']"),
      PARKING: mapFilter.querySelector("#housing-features [value='parking']"),
      WASHER: mapFilter.querySelector("#housing-features [value='washer']"),
      ELEVATOR: mapFilter.querySelector("#housing-features [value='elevator']"),
      CONDITIONER: mapFilter.querySelector("#housing-features [value='conditioner']")
    };
    var fragmentPin = document.createDocumentFragment();
    window.rankedAdvArray = [];
    window.makeFilter = function (similarAdv) {
      if (HouseType.ANY.selected) {
        rankedAdvArray = similarAdv;
      } else if (HouseType.FLAT.selected) {
        rankedAdvArray = similarAdv.filter(function(element) {
          return element.offer.type == "flat";
        });
      } else if (HouseType.HOUSE.selected) {
        rankedAdvArray = similarAdv.filter(function(element) {
          return element.offer.type == "house";
        });
      } else if (HouseType.BUNGALO.selected) {
        rankedAdvArray = similarAdv.filter(function(element) {
          return element.offer.type == "bungalo";
        });
      }
      if (HousePrice.ANY.selected) {
        rankedAdvArray = rankedAdvArray;
      } else if (HousePrice.MIDDLE.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return ((element.offer.price >= 10000) && (element.offer.price <= 50000))
        });
      } else if (HousePrice.LOW.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return (element.offer.price < 10000);
        });
      } else if (HousePrice.HIGH.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return (element.offer.price > 50000);
        });
      }
      if (HouseRooms.ANY.selected) {
        rankedAdvArray = rankedAdvArray;
      } else if (HouseRooms.ONE.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return element.offer.rooms == "1";
        });
      } else if (HouseRooms.TWO.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return element.offer.rooms == "2";
        });
      } else if (HouseRooms.THREE.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return element.offer.rooms == "3";
        });
      }
      if (HouseGuests.ANY.selected) {
        rankedAdvArray = rankedAdvArray;
      } else if (HouseGuests.ONE.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return element.offer.guests == "1";
        });
      } else if (HouseGuests.TWO.selected) {
        rankedAdvArray = rankedAdvArray.filter(function(element) {
          return element.offer.guests == "2";
        });
      }
      var filterFeatures = function (featureCheckbox ,featureName) {
        if (featureCheckbox.checked) {
          var containsFeature;
          rankedAdvArray = rankedAdvArray.filter(function(element) {
            containsFeature = false;
            element.offer.features.forEach(function(innerElement) {
              if (innerElement == featureName) {
                return containsFeature = true;
              }
            });
              return containsFeature;
          });
        }
      };
      filterFeatures (HouseFeature.WIFI, "wifi");
      filterFeatures (HouseFeature.DISHWASHER, "dishwasher");
      filterFeatures (HouseFeature.PARKING, "parking");
      filterFeatures (HouseFeature.WASHER, "washer");
      filterFeatures (HouseFeature.ELEVATOR, "elevator");
      filterFeatures (HouseFeature.CONDITIONER, "conditioner");
    };
    window.errorHandler = function(errorMessage) {
      var errorBlock = document.createElement("div");
      errorBlock.style = "position: absolute; z-index: 100; font-size: 30px; text-align: center; margin: 0 auto; left: 0; right: 0; background-color: red";
      errorBlock.textContent = errorMessage;
      document.body.insertAdjacentElement("afterbegin", errorBlock);
    };
    window.load(errorHandler);

  //Генерация иконки объявления - шаблона
  var generateAdv = function(similarAdvertPin, i) {
    var advElementPinTemplate = template.querySelector(".map__pin").cloneNode(true);
    advElementPinTemplate.querySelector("img").src = similarAdvertPin.author.avatar;
    advElementPinTemplate.style = "left: " + (similarAdvertPin.location.x - MAP_PIN_WIDTH) + "px; " + "top: " + (similarAdvertPin.location.y - MAP_PIN_HEIGHT) + "px";
    advElementPinTemplate.className = "map__pin removable button" + i;
    i++;
    return advElementPinTemplate;
  };
  //Генерация всех иконок объявления - шаблона
  window.successHandlerPin = function () {
    while (mapPins.children[1].nextElementSibling) {
      mapPins.removeChild(mapPins.children[1].nextElementSibling);
    };
    rankedAdvArray.forEach(function(element, i) {
      fragmentPin.appendChild(generateAdv(element, i));
    });
    mapPins.appendChild(fragmentPin);
    window.allMapPins = document.querySelectorAll(".map__pin");
    map.addEventListener("click", onMapClickHandler, false);
    map.addEventListener("keydown", onMapKeydownHandler, false);
    return mapPins;
  };

  window.createAdvFragmentPin = function() {
    successHandlerPin();
  };

  //Отрисовка параметров похожего объявления
  var renderMapCard = function(similarAdvMapCard) {
    var advElementMapCardTemplate = template.querySelector(".map__card").cloneNode(true);
    var offerType = {
      flat: "Квартира",
      house: "Дом",
      bungalo: "Бунгало"
    };
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
    var renderPhotos = function (similarAdvPhoto) {
      var photoBlock = advElementMapCardTemplate.querySelector(".popup__photos");
      while (photoBlock.firstChild) {
        photoBlock.removeChild(photoBlock.firstChild)
      };
      var fragmentPhoto = document.createDocumentFragment();
      for (var i = 0; i < similarAdvPhoto.offer.photos.length; i++) {
        var photoPicture = document.createElement("img");
        photoPicture.className = "popup__photo";
        photoPicture.width = "45";
        photoPicture.height = "40";
        photoPicture.alt = "Фотография жилья";
        photoPicture.src = similarAdvPhoto.offer.photos[i];
        fragmentPhoto.appendChild(photoPicture);
      };
      return photoBlock.appendChild(fragmentPhoto);
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
    renderPhotos(similarAdvMapCard);
    return advElementMapCardTemplate;
  };

  window.successHandlerCard = function () {
    while (map.children[1].nextElementSibling) {
      map.removeChild(map.children[1].nextElementSibling);
    };
    var fragmentMap = document.createDocumentFragment();
    rankedAdvArray.forEach(function(element, i) {
      fragmentMap.appendChild(renderMapCard(element));
    });
    map.appendChild(fragmentMap);
    window.allMapCards = document.querySelectorAll(".map__card");
    window.popupClose = document.querySelectorAll(".popup__close");
    return map;
  };
  window.createAdvFragmentMap = function() {
    successHandlerCard();
  };
};

(function() {
  var housingType = document.getElementById("housing-type");
  mapFilter.addEventListener("change", function(event) {
    if (event.currentTarget == mapFilter) {
      makeFilter(window.serverData);
      map.removeEventListener("click", onMapClickHandler, false);
      map.removeEventListener("keydown", onMapKeydownHandler, false);
      successHandlerPin(rankedAdvArray);
      successHandlerCard(rankedAdvArray);
    }
  });
})();

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
    if (Number(userPin.style.top.slice(0, -2)) < UserPinBorder.BOTTOM) {
      userPin.style.top = 70 + "px";
    } else if (Number(userPin.style.top.slice(0, -2)) > UserPinBorder.TOP) {
      userPin.style.top = 620 + "px";
    } else if (Number(userPin.style.left.slice(0, -2)) < UserPinBorder.LEFT) {
      userPin.style.left = -32 + "px";
    } else if (Number(userPin.style.left.slice(0, -2)) > UserPinBorder.RIGHT) {
      userPin.style.left = 1166 + "px";
    }
  };
  var onMouseUp = function() {
    click++;
    map.classList.remove("map--faded");
    (function() {
      if (click <= 1) {
        renderAllMap();
        //Отображаем форму
        adForm.classList.remove("ad-form--disabled");
        //Включаем поля формы
        (function() {
          for(var i = 0; i < fieldsetForm.length; i++) {
            fieldsetForm[i].removeAttribute("disabled");
          }
        })();
      }
    })();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mousemove", onMouseMove);
  };
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

var onMapClickHandler = function (event) {
  for (var i = 0; i < allMapCards.length; i++) {
    if ((event.target.classList.contains("map__pin")) || (event.target.parentNode.classList.contains("map__pin"))) {
      allMapCards[i].classList.add("hidden");
    }
    if ((event.target.className == ("map__pin removable button" + [i])) || (event.target.parentNode.className == ("map__pin removable button" + [i]))) {
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
    } else if (event.target.parentNode.className == ("map__pin removable button" + [k])) {
      event.target.parentNode.classList.add("map__pin--active");
    } else if ((event.target.classList.contains("map__pin")) || (event.target.parentNode.classList.contains("map__pin"))) {
      allMapPins[k+1].classList.remove("map__pin--active");
    }
  }
};
var onMapKeydownHandler = function (event) {
  for (var i = 0; i < allMapPins.length - 1; i++) {
    if ((event.keyCode == ENTER_KEYCODE) && (document.activeElement.classList.contains("map__pin removable button" + i))) {
      allMapCards[i].classList.remove("hidden");
    }
  }
  for (var i = 0; i < allMapPins.length - 1; i++) {
    if ((event.keyCode == ESC_KEYCODE) && (!allMapCards[i].classList.contains("hidden"))) {
      allMapCards[i].classList.add("hidden");
      allMapPins[i+1].classList.remove("map__pin--active");
    }
  }
};
