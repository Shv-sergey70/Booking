//Генерация целого числа в диапазоне min max
var getRandomInteger = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
};
//Генерация случайного числа в массиве
var getRandomNumberForArray = function(array) {
  return Math.floor(Math.random() * array.length)
}
