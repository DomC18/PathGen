var consol = document.getElementById("console");

function copy() {
    var range = document.createRange()
    range.selectNode(document.getElementById('console'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    // HTML5 has no real alternative to execCommand('copy')?
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert("Copied the text");
    navigator.clipboard.writeText(text.value);
    
}

function restart() {
    // Import funciton from code_text.js
    clearConsole();
    
    document.getElementById("svg-paths").remove();
    for (i=1; i<waypoints.length; i++) {
        document.getElementById("pathgen-container").removeChild(waypoints[i][0]);
    }
    
    // Import function from waypoints.js
    resetLines()

    document.getElementById("waypoint-container").style.display = "none";
    document.getElementById("waypoints-arrow").textContent = "1▲";
}

function start() {
    if (!codeStarted) {
        var startWaypoint = document.getElementById("robot-dragger-base");
        var startrect = startWaypoint.getBoundingClientRect();

        // Import funciton from console_text.js
        startConsole()


        // Import function from waypoint.js
        startCode(startrect.left, startrect.top);
        codeStarted = true;
    }
}



document.getElementById("copy-code").addEventListener("click", copy);
document.getElementById("restart-code").addEventListener("click", restart);
document.getElementById("start-code").addEventListener("click", start);


// !!! delete after debugging
document.getElementById("website-title").addEventListener("click", start);