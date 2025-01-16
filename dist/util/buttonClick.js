export function initializeMenuSelection(menuSelector, activeClass = "on") {
    const menuItems = Array.from(document.querySelectorAll(menuSelector));
    menuItems.forEach((menuItem) => {
        menuItem.addEventListener("click", () => {
            menuItems.forEach((item) => item.classList.remove(activeClass));
            menuItem.classList.add(activeClass);
        });
    });
}
//# sourceMappingURL=buttonClick.js.map