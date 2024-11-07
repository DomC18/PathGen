var codeStarted = false;
var startPosition = null; 
var startAngle = null;
var lastPosition = null;
var waypoints = [];
var lines = [];

var image = document.getElementById("pathgen-image");
var width = image.clientWidth;
var height = image.clientHeight;
var rect = image.getBoundingClientRect();
var widthOffset = rect.left;
var heightOffset = rect.top;
var startWaypoint = document.getElementById("robot-dragger-base");
var lastWaypoint = startWaypoint;
waypoints.push([startWaypoint, null, null]);


function startCode(xbox, ybox) {
    var position = [];
    position[0] = ((xbox+26-widthOffset)/width) * 144;
    position[1] = ((ybox+26-heightOffset)/height) * 144;
    startPosition = position;
    startAngle = 0;
}


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

        var startDragged = false;
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        pos5 = waypoint.offsetTop - pos2 + 26;
        pos6 = waypoint.offsetLeft - pos1 + 26;

        for (var i=0; i<waypoints.length; i++) {
            if (startDragged) {
                waypointUpdate(waypoints[i][1], waypoints[i][2], false, i-1);
            }
            if (waypoints[i][0] === waypoint) {
                line1 = lines[i-1];
                if (i <= waypoints.length) {
                    line2 = lines[i];
                }

                if (line2) {
                    line2.setAttribute("x1", pos6);
                    line2.setAttribute("y1", pos5);
                }
                if (line1) {
                    line1.setAttribute("x2", pos6);
                    line1.setAttribute("y2", pos5);
                    waypointUpdate(pos3, pos4, false, i-1);
                } else {
                    if (waypoints.length > 1) {
                        var startrect = startWaypoint.getBoundingClientRect();
                        startPosition[0] = ((startrect.left+26-widthOffset)/width) * 144;
                        startPosition[1] = ((startrect.top+26-heightOffset)/height) * 144;
                        startDragged = true;
                    }
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
        svgContainer.style.zIndex = 0;
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
    waypointBase.textContent = x
    document.getElementById("pathgen-container").appendChild(waypointBase);
    var waypointStyler = document.createElement("div");
    waypointStyler.className = "robot-dragger";
    waypointBase.appendChild(waypointStyler);
    dragWaypoint(waypointBase);
    drawLine(waypointBase);
    waypoints.push([waypointBase, x+26, y+26]);
    lastWaypoint = waypointBase;
    // import from code_text.js
    waypointUpdate(x+26, y+26, true, 0);
}


dragWaypoint(startWaypoint);

document.getElementById("pathgen-container").addEventListener("dblclick", function(e) {
    if (codeStarted) {
        var x = e.clientX;
        var y = e.clientY;
        waypointAt(x, y);
    }
});

function resetLines() {
    lines = [];
    waypoints = [[startWaypoint, null, null]];
    lastWaypoint = startWaypoint;
}

function waypointUpdate(x, y, isNew, line1Index){
    var position = [];

    position[0] = ((x-widthOffset)/width) * 144;
    position[1] = ((y-heightOffset)/height) * 144;

    var first_waypoint = waypoints[1]
    console.log(first_waypoint[1])
    var relative_0_0 = []
    relative_0_0[0] = first_waypoint.clientX
    relative_0_0[1] = first_waypoint.clientY

    console.log([position[0] - relative_0_0[0], position[1] - relative_0_0[0]])

    
    //import from relativePosition
    var position_relative = computeLocation(position, isNew, line1Index);
    
}