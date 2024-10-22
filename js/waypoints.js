var codeStarted = false;
var startPosition = null; 
var startAngle = null;
var lastPosition = null;
var waypoints = [];
var lines = [];
var spans = [];

var image = document.getElementById("pathgen-image");
var width = image.clientWidth;
var height = image.clientHeight;
var rect = image.getBoundingClientRect();
var widthOffset = rect.left;
var heightOffset = rect.top;
var consol = document.getElementById("console");
var startWaypoint = document.getElementById("robot-dragger-base");
var lastWaypoint = startWaypoint;
waypoints.push(startWaypoint);





function updateConsole(translatedXInches, translatedYInches, angleDegrees, isNew, line1Index) {
    var spanElement;
    var spanElement2;

    if (isNew) {
        spanElement = document.createElement("span");
        spanElement2 = document.createElement("span");
        spanElement.style.display = "block";
        spanElement2.style.display = "block";
        spanElement.textContent = "path.add_turn(MyTurn(" + Math.round(angleDegrees*100)/100 + "_deg));";
        spanElement2.textContent = "path.add_straight(Straight({" + Math.round(translatedXInches*100)/100 + "_in, " + Math.round(translatedYInches*100)/100 + "_in, 0_deg" + "}, 0_s, MOTOR_SPEED::MID));";
        consol.appendChild(spanElement);
        consol.appendChild(spanElement2);
        spans.push([spanElement, spanElement2]);
    } else {
        spans[line1Index][0].textContent = "path.add_turn(MyTurn(" + Math.round(angleDegrees*100)/100 + "_deg));";
        spans[line1Index][1].textContent = "path.add_straight(Straight({" + Math.round(translatedXInches*100)/100 + "_in, " + Math.round(translatedYInches*100)/100 + "_in, 0_deg" + "}, 0_s, MOTOR_SPEED::MID));";
    }
}


function computeLocation(location, isNew, line1Index) {
    var xInches;
    var yInches;
    var oldAngle;
    var newAngle;
    var originalPosition = [];
    var finalPosition = [];
    var diff = [];
    var magnitude;
    var relativeAngle;

    xInches = location[0];
    yInches = location[1];
    originalPosition[0] = xInches - startPosition[0];
    originalPosition[1] = yInches - startPosition[1];
    magnitude = Math.sqrt(originalPosition[0] ** 2 + originalPosition[1] ** 2);
    if (-0.0005 < originalPosition[0] < 0.05) {
        if (originalPosition[1] < 0) {
            oldAngle = 90;
        } else {
            oldAngle = 270;
        }
    } else {
        oldAngle = (((Math.atan(originalPosition[1] / originalPosition[0]))*Math.PI)/180);
    }

    if (originalPosition[0] < 0) {
        oldAngle += 180
    }
    newAngle = oldAngle - startAngle;
    finalPosition[0] = Math.cos((newAngle*180)/Math.PI) * magnitude;
    finalPosition[1] = -Math.sin((newAngle*180)/Math.PI) * magnitude;

    if (lastPosition !== null) {
        diff[0] = finalPosition[0] - lastPosition[0];
        diff[1] = finalPosition[1] - lastPosition[1];

        if (Math.abs(diff[0]) < 0.0005) {
            if (finalPosition[1] > lastPosition[1]) {
                relativeAngle = 0;
            } else {
                relativeAngle = 180;
            }
        }
        else {
            relativeAngle = ((Math.atan(diff[1] / diff[0])*Math.PI)/180);
        }

        if (diff[0] < 0) {
            relativeAngle += 180
        }

        if (relativeAngle < 0) {
            relativeAngle += 360
        }
    }
    updateConsole(finalPosition[0], finalPosition[1], relativeAngle, isNew, line1Index);
    lastPosition = finalPosition;
}


function generateCode(x, y, isNew, line1Index) {
    var position = [];
    position[0] = ((x-widthOffset)/width) * 144;
    position[1] = ((y-heightOffset)/height) * 144;
    computeLocation(position, isNew, line1Index);
}


function startCode(xbox, ybox) {
    var position = [];
    position[0] = ((xbox+26-widthOffset)/width) * 144;
    position[1] = ((ybox+26-heightOffset)/height) * 144;
    startPosition = position;
    startAngle = 0;

    spanElement = document.createElement("span");
    spanElement.style.display = "block";
    spanElement.textContent = "Path path;";
    consol.appendChild(spanElement);
    consol.style.scrollbarWidth = "initial";
}


function restartCode() {
    clearConsole();
    document.getElementById("svg-paths").remove();
    for (i=1; i<waypoints.length; i++) {
        document.getElementById("pathgen-container").removeChild(waypoints[i]);
    }
    lines = [];
    waypoints = [startWaypoint];
    lastWaypoint = startWaypoint;
}

function clearConsole() {
    while (consol.children.length > 1) {
        consol.removeChild(consol.children[1]);
    }
    spans = [];
    consol.style.scrollbarWidth = "none";
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

                if (line2) {
                    line2.setAttribute("x1", pos6);
                    line2.setAttribute("y1", pos5);
                }
                if (line1) {
                    line1.setAttribute("x2", pos6);
                    line1.setAttribute("y2", pos5);
                    generateCode(pos3, pos4, false, i-1);
                } else {
                    if (waypoints.length > 1) {
                        var startrect = startWaypoint.getBoundingClientRect();
                        startPosition[0] = ((startrect.left+26-widthOffset)/width) * 144;
                        startPosition[1] = ((startrect.top+26-heightOffset)/height) * 144;
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
    document.getElementById("pathgen-container").appendChild(waypointBase);
    var waypointStyler = document.createElement("div");
    waypointStyler.className = "robot-dragger";
    waypointBase.appendChild(waypointStyler);
    dragWaypoint(waypointBase);
    drawLine(waypointBase);
    waypoints.push(waypointBase);
    lastWaypoint = waypointBase;
    generateCode(x+26, y+26, true, 0);
}





dragWaypoint(startWaypoint);
document.getElementById("pathgen-container").addEventListener("dblclick", function(e) {
    if (codeStarted) {
        var x = e.clientX;
        var y = e.clientY;
        waypointAt(x, y);
    }
});
document.getElementById("start-code").addEventListener("click", function() {
    if (!codeStarted) {
        var startrect = startWaypoint.getBoundingClientRect();
        startCode(startrect.left, startrect.top);
        codeStarted = true;
    }
})
document.getElementById("restart-code").addEventListener("click", restartCode);