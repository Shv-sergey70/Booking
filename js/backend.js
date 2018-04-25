"use strict"

window.load = function (onError) {
  var URL = "https://js.dump.academy/keksobooking/data";
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.addEventListener("load", function() {
    if (xhr.status == 200) {
      window.serverData = xhr.response;
      window.makeFilter(window.serverData);
      createAdvFragmentPin();
      createAdvFragmentMap();
    } else {
       onError("Неизвестный статус: " + xhr.status + " " + xhr.statusText);
    }
  });
  xhr.addEventListener("error", function () {
    onError("Произошла ошибка соединения");
  });
  xhr.addEventListener("timeout", function() {
    onError("Запрос не успел выполниться за " + xhr.timeout + "мс");
  });
  xhr.timeout = 10000; //10 секунд

  xhr.open("GET", URL);
  xhr.send();
};

window.save = function (data, onLoad, onError) {
  var URL = "https://js.dump.academy/keksobooking";
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.addEventListener("load", function() {
    if (xhr.status == 200) {
      onLoad(xhr.response);
    } else {
       onError("Неизвестный статус: " + xhr.status + " " + xhr.statusText);
    }
  });
  xhr.addEventListener("error", function () {
    onError("Произошла ошибка соединения");
  });
  xhr.addEventListener("timeout", function() {
    onError("Запрос не успел выполниться за " + xhr.timeout + "мс");
  });
  xhr.timeout = 10000; //10 секунд

  xhr.open("POST", URL);
  xhr.send(data);
};
