let mapButton = document.querySelector(".map-button");
let listButton = document.querySelector(".list-button");

mapButton.onclick = function () {
  location.href = `/map?days=${daysSet}`;
};

listButton.onclick = function () {
  location.href = `/?days=${daysSet}`;
};
