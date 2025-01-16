import { createBackgroundAnimation } from "../util/bgstyler.js";
import { JobSupportClass } from "./JobsupportClass.js";

document.addEventListener("DOMContentLoaded", function () {
  const currentPage = 1;
  const itemsPerPage = 10;
  new JobSupportClass(currentPage, itemsPerPage);
  createBackgroundAnimation(".animation-0", 50, "8s", "bg_item_0", "opacity");
  createBackgroundAnimation(".animation-1", 60, "7s", "bg_item_1", "opacity");
  createBackgroundAnimation(".animation-2", 70, "6s", "bg_item_2", "opacity");
  createBackgroundAnimation(".animation-3", 80, "5s", "bg_item_3", "opacity");
});
