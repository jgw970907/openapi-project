// import Api from "./Api.js";
import ListDisplay from "./JobMainClass.js";

document.addEventListener("DOMContentLoaded", function () {
  const currentPage = 1;
  const itemsPerPage = 10;
  new ListDisplay(currentPage, itemsPerPage);
});
