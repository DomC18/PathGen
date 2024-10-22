windowClicked = false;
settingsClicked = false;

function onTopClick(topID, divID, check) {
    if (!check) {
        document.getElementById(topID).style.textDecoration = "underline";
        document.getElementById(divID).style.display = "initial";
    } else {
        document.getElementById(topID).style.textDecoration = "none";
        document.getElementById(divID).style.display = "none";
    }
    check = !check;
}

// document.getElementById("header-window-dropdown").addEventListener("click", () => onTopClick("header-window-dropdown", "header-window", windowClicked));
// document.getElementById("header-settings-dropdown").addEventListener("click", () => onTopClick("header-settings-dropdown", "header-settings", settingsClicked));