import { JobSupportClass } from "./JobsupportClass.js";

document.addEventListener("DOMContentLoaded", function () {
  const currentPage = 1;
  const itemsPerPage = 10;
  new JobSupportClass(currentPage, itemsPerPage);
});
