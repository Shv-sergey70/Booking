var fieldsetForm = document.querySelectorAll("fieldset");
//disabled - всем полям формы по умолчанию
(function() {
  for(var i = 0; i < fieldsetForm.length; i++) {
    fieldsetForm[i].disabled = "true";
  }
})();
