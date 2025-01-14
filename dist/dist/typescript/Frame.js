"use strict";
document.addEventListener("DOMContentLoaded", () => {
    fetch("../banner.html")
        .then((response) => response.text())
        .then((data) => {
        document.getElementById("banner").innerHTML = data;
    });
    fetch("../header.html")
        .then((response) => response.text())
        .then((data) => {
        document.getElementById("header").innerHTML = data;
        $(document).ready(function () {
            const currentPage = window.location.pathname.split("/").pop();
            $("#header .menu ul li a").each(function () {
                const menuItemHref = $(this).attr("href").split("/").pop();
                if (menuItemHref === currentPage) {
                    $(this).addClass("current");
                }
            });
        });
    })
        .catch((error) => console.error("Error loading header:", error));
});
//# sourceMappingURL=Frame.js.map