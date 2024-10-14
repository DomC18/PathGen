waypointsDown = false;
constraintsDown = false;
eventsDown = false;

function sidebarDropdown(isDown, arrow, list) {
    const arrowElement = document.getElementById(arrow);
    const listElement = document.getElementById(list);
    if (!isDown) {
        arrowElement.style.transform = "rotate(180deg)"
        listElement.style.display = "initial";
    } else {
        arrowElement.style.transform = "rotate(0deg)"
        listElement.style.display = "none";
    }
}

// document.getElementById("waypoints-main-container").addEventListener("click", sidebarDropdown(waypointsDown, "waypoints-arrow", "waypoints-container"));
// document.getElementById("constraints-main-container").addEventListener("click", sidebarDropdown(constraintsDown, "constraints-arrow", "constraints-container"));
// document.getElementById("events-main-container").addEventListener("click", sidebarDropdown(eventsDown, "events-arrow", "events-container"));