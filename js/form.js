var fieldsetForm = document.querySelectorAll("fieldset");
var adForm = document.querySelector(".ad-form");

//disabled - всем полям формы по умолчанию
(function() {
  var inputTitle = adForm.querySelector("input[name=title]");
  var inputPrice = adForm.querySelector("input[name=price]");
  var selectType = adForm.querySelector("select[name=type]");
  var selectTimeIn = adForm.querySelector("select[name=timein]");
  var selectTimeOut = adForm.querySelector("select[name=timeout]");
  var selectRooms = adForm.querySelector("select[name=rooms]");
  var selectCapacity = adForm.querySelector("select[name=capacity]");
  var fileChooserAvatar = document.querySelector(".ad-form__field input[type=file]");
  var previewAvatar = document.querySelector(".ad-form-header__preview img");
  var fileChooserPicture = document.querySelector(".ad-form__upload input[type=file]");
  var previewPictureBlock = document.querySelector(".ad-form__photo");
  var FILE_TYPES = ["gif", "jpg", "jpeg", "png"];
  var selectTypeOption = {
    FLAT: selectType.querySelector("option[value=flat]"),
    BUNGALO: selectType.querySelector("option[value=bungalo]"),
    HOUSE: selectType.querySelector("option[value=house]"),
    PALACE: selectType.querySelector("option[value=palace]")
  };
  var selectTimeOutOption = {
    "12:00": selectTimeOut.querySelector('option[value="12:00"]'),
    "13:00": selectTimeOut.querySelector('option[value="13:00"]'),
    "14:00": selectTimeOut.querySelector('option[value="14:00"]')
  };
  var selectCapacity = {
    "0": selectCapacity.querySelector('option[value="0"]'),
    "1": selectCapacity.querySelector('option[value="1"]'),
    "2": selectCapacity.querySelector('option[value="2"]'),
    "3": selectCapacity.querySelector('option[value="3"]')
  };
  selectType.addEventListener("change", function(event) {
    if (selectTypeOption.FLAT.selected) {
      inputPrice.min = 1000;
    } else if (selectTypeOption.BUNGALO.selected) {
      inputPrice.min = 0;
    } else if (selectTypeOption.HOUSE.selected) {
      inputPrice.min = 5000;
    } else if (selectTypeOption.PALACE.selected) {
      inputPrice.min = 10000;
    }
  });
  inputTitle.addEventListener("invalid", function () {
    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity("Минимальная длина — 30 символов");
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity("Обязательное поле для заполнения");
    } else {
      inputTitle.setCustomValidity("");
    }
  });
  inputPrice.addEventListener("invalid", function () {
    if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity("Обязательное поле для заполнения");
    } else if (inputTitle.validity.typeMismatch) {
      inputPrice.setCustomValidity("Введите в поле только числа");
    }
    if (selectTypeOption.FLAT.selected && inputPrice.value < 1000) {
      inputPrice.setCustomValidity("Минимальная цена за ночь 1000 рублей");
    } else if (selectTypeOption.BUNGALO.selected && inputPrice.value < 0) {
      inputPrice.setCustomValidity("Минимальная цена за ночь 0 рублей");
    } else if (selectTypeOption.HOUSE.selected && inputPrice.value < 5000) {
      inputPrice.setCustomValidity("Минимальная цена за ночь 5000 рублей");
    } else if (selectTypeOption.PALACE.selected && inputPrice.value < 10000) {
      inputPrice.setCustomValidity("Минимальная цена за ночь 10000 рублей");
    } else {
      inputPrice.setCustomValidity("");
    }
  });
  selectTimeIn.addEventListener("change", function () {
    selectTimeOutOption["12:00"].selected = true;
    selectTimeOutOption["13:00"].disabled = false;
    selectTimeOutOption["14:00"].disabled = false;
    if (selectTimeIn.value == "12:00") {
      selectTimeOutOption["13:00"].disabled = true;
      selectTimeOutOption["14:00"].disabled = true;
    } else if (selectTimeIn.value == "13:00") {
      selectTimeOutOption["14:00"].disabled = true;
    }
  });
  selectRooms.addEventListener("change", function () {
    selectCapacity["0"].selected = true;
    selectCapacity["1"].disabled = false;
    selectCapacity["2"].disabled = false;
    selectCapacity["3"].disabled = false;
    if (selectRooms.value == "1") {
      selectCapacity["2"].disabled = true;
      selectCapacity["3"].disabled = true;
    } else if (selectRooms.value == "2") {
      selectCapacity["3"].disabled = true;
    } else if (selectRooms.value == "100") {
      selectCapacity["1"].disabled = true;
      selectCapacity["2"].disabled = true;
      selectCapacity["3"].disabled = true;
    }
  });
  fileChooserAvatar.addEventListener("change", function() {
    var file = fileChooserAvatar.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function(element) {
      return fileName.endsWith(element);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener("load", function(){
        previewAvatar.src = reader.result;
        previewAvatar.parentElement.style = "border: 1px solid green; -webkit-box-shadow: 0 0 2px 2px green; box-shadow: 0 0 2px 2px green;"
      });
      reader.readAsDataURL(file);
    }
  });
  fileChooserPicture.addEventListener("change", function() {
    var fileNames = [];
    var matches = [];
    var files = Array.from(fileChooserPicture.files);
    for (var i = 0; i < files.length; i++) {
      fileNames[i] = files[i].name.toLowerCase();
    };
    for (var j = 0; j < fileNames.length; j++) {
      matches[j] = FILE_TYPES.some(function(element) {
        return fileNames[j].endsWith(element);
      });
    };
    if (matches.every(function(el) {
       return el === true
     })) {
      var reader = new FileReader();
      reader.addEventListener("load", function(){
        for (var i = 0; i < files.length; i++) {
          var previewPictureImg = document.createElement("img");
          previewPictureImg.src = reader.result;
          previewPictureImg.width = 70;
          previewPictureImg.height = 70;
          previewPictureBlock.appendChild(previewPictureImg);
        }
      });
      reader.readAsDataURL(files[0]);
    }
  });
  fieldsetForm.forEach(function(element) {
    element.disabled = "true";
  });
})();

adForm.addEventListener("submit", function() {
  event.preventDefault();
  var adFormReset = document.querySelector(".ad-form__reset");
  var onSuccessSend = function() {
    alert("Отправлено!");
    adFormReset.click();
  };
  window.save(new FormData(adForm), onSuccessSend, errorHandler);
});
