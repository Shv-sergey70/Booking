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
var similarAdv = [];

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
