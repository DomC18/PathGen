function dragWaypoint(waypoint) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, pos5 = 0, pos6 = 0;
    var line1, line2;
    if (document.getElementById("robot-dragger")) {
        document.getElementById("robot-dragger").onmousedown = dragMouseDown;
    } else {
        waypoint.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragWaypoint;
        document.onmousemove = waypointDrag;
    }

    function waypointDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        pos5 = waypoint.offsetTop - pos2 + 26;
        pos6 = waypoint.offsetLeft - pos1 + 26;

        for (var i=0; i<waypoints.length; i++) {
            if (waypoints[i] === waypoint) {
                line1 = lines[i-1];
                if (i <= waypoints.length) {
                    line2 = lines[i];
                }
                if (line1) {
                    line1.setAttribute("x2", pos6);
                    line1.setAttribute("y2", pos5);
                }
                if (line2) {
                    line2.setAttribute("x1", pos6);
                    line2.setAttribute("y1", pos5);
                }
            }
        }

        waypoint.style.top = (waypoint.offsetTop - pos2) + "px";
        waypoint.style.left = (waypoint.offsetLeft - pos1) + "px";
    }

    function closeDragWaypoint() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function drawLine(waypointBase) {
    var svgContainer = document.getElementById("svg-paths");
    if (!svgContainer) {
        svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute("id", "svg-paths");
        svgContainer.style.position = "absolute";
        svgContainer.style.top = 0;
        svgContainer.style.left = 0;
        svgContainer.style.width = "100%";
        svgContainer.style.height = "100%";
        svgContainer.style.zIndex = 1; // make sure it's below the waypoints
        document.getElementById("pathgen-container").appendChild(svgContainer);
    }
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", lastWaypoint.offsetLeft + 26);
    line.setAttribute("y1", lastWaypoint.offsetTop + 26);
    line.setAttribute("x2", waypointBase.offsetLeft + 26);
    line.setAttribute("y2", waypointBase.offsetTop + 26);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
    svgContainer.appendChild(line);
    lines.push(line);
}

function waypointAt(x, y) {
    var waypointBase = document.createElement("div");
    waypointBase.className = "robot-dragger-base";
    waypointBase.style.top = y-26 + "px";
    waypointBase.style.left = x-26 + "px";
    document.getElementById("pathgen-container").appendChild(waypointBase);
    var waypointStyler = document.createElement("div");
    waypointStyler.className = "robot-dragger";
    waypointBase.appendChild(waypointStyler);
    dragWaypoint(waypointBase);

    drawLine(waypointBase);
    waypoints.push(waypointBase);
    lastWaypoint = waypointBase;
}

var waypoints = []
var lines = [];
var startWaypoint = document.getElementById("robot-dragger-base");
var lastWaypoint = startWaypoint;
waypoints.push(startWaypoint);
dragWaypoint(startWaypoint);

document.getElementById("pathgen-container").addEventListener("dblclick", function(e) {
    var x = e.clientX;
    var y = e.clientY;
    waypointAt(x, y);
});