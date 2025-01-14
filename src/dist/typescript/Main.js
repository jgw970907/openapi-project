import Api from "./Api";
import { Popup } from "./Popup";
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = 1;
    const itemsPerPage = 10;
    const api = new Api(currentPage, itemsPerPage);
    // const jobSupport = new JobSupport(currentPage, itemsPerPage);
    // const edu = new Edu(currentPage, itemsPerPage);
    const popup = new Popup();
    popup.showPopup();
});
//# sourceMappingURL=Main.js.map