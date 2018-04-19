"use strict"

window.load = function (onLoad) {
  var URL = "https://js.dump.academy/keksobooking/data";
  var xml = new XMLHttpRequest();
  xml.responseType = "json";
  xml.addEventListener("load", function() {
    if (xml.status == 200) {
      onLoad(xml.response)
    }
    });
    // else {
  //      onError("Ошибка запроса. Статус: " + evt.status " " + evt.statusText);
  //   }
  // });
  // xml.addEventListener("error", function () {
  //   onError("Ошибка при подключении к серверу");
  // });
  // xml.addEventListener("timeout", function() {
  //   onError("Ошибка. Долгое время ожидания ответа от сервера");
  // });
  xml.timeout = 10000; //10 секунд

  xml.open("GET", URL);
  xml.send();
};
