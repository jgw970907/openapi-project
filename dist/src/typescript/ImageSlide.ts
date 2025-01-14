$(document).ready(function () {
  setInterval(function () {
    $(".slidelist").delay(4000);
    $(".slidelist").animate({ marginLeft: -1440 });
    $(".slidelist").delay(4000);
    $(".slidelist").animate({ marginLeft: 0 });
  });
});
