import { createBackgroundAnimation } from "../util/bgstyler.js";
import { EduClass } from "./EduClass.js";
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = 1;
    const itemsPerPage = 10;
    new EduClass(currentPage, itemsPerPage);
    createBackgroundAnimation(".animation-2", 50, "6s", "bg_item_2", "opacity");
    createBackgroundAnimation(".animation-3", 60, "7s", "bg_item_3", "opacity");
    createBackgroundAnimation(".animation-4", 70, "8s", "bg_item_4", "opacity");
    createBackgroundAnimation(".animation-5", 80, "5s", "bg_item_5", "opacity");
});
//# sourceMappingURL=EduPage.js.map