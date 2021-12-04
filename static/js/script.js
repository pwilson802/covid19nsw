"use strict";

var mapButton = document.querySelector(".map-button");
var listButton = document.querySelector(".list-button");

mapButton.onclick = function () {
  location.href = "/map?days=".concat(daysSet);
};

listButton.onclick = function () {
  location.href = "/?days=".concat(daysSet);
};