import { createBackgroundAnimation } from "../util/bgstyler.js";
import ExternalAct from "./ExternalActClass.js";
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = 1;
    const itemsPerPage = 10;
    new ExternalAct(currentPage, itemsPerPage);
    createBackgroundAnimation(".animation-3", 50, "6s", "bg_item_3", "opacity");
    createBackgroundAnimation(".animation-4", 60, "7s", "bg_item_4", "opacity");
    createBackgroundAnimation(".animation-5", 70, "8s", "bg_item_5", "opacity");
    createBackgroundAnimation(".animation-1", 80, "5s", "bg_item_1", "opacity");
});
//# sourceMappingURL=ExternalPage.js.map