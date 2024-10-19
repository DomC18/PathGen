function to_output(translated_x_in, translated_y_in, angle_deg) {
    if (angle_deg !== null) {
        consol.textContent = consol.textContent + "path.add_turn(MyTurn(" + Math.round(angle_deg) + "_deg));\n"
    }
    consol.textContent = consol.textContent + "path.add_straight(Straight({" + Math.round(translated_x_in) + "_in, " + Math.round(translated_y_in) + "_in, 0_deg" + "}, 0_s, MOTOR_SPEED::MID));\n";
}

function compute_location(location) {
    var x_in;
    var y_in;
    var old_angle;
    var new_angle;
    var orig_pos = [];
    var final_pos = [];
    var diff = [];
    var magnitude;
    var relative_angle;

    x_in = location[0];
    y_in = location[1];
    orig_pos[0] = x_in - start_pos[0];
    orig_pos[1] = y_in - start_pos[1];
    magnitude = Math.sqrt(orig_pos[0] ** 2 + orig_pos[1] ** 2);
    if (-0.0005 < orig_pos[0] < 0.05) {
        if (orig_pos[1] < 0) {
            old_angle = 90;
        } else {
            old_angle = 270;
        }
    } else {
        old_angle = (((Math.atan(orig_pos[1] / orig_pos[0]))*Math.PI)/180);
    }

    if (orig_pos[0] < 0) {
        old_angle += 180
    }
    new_angle = old_angle - start_angle;
    final_pos[0] = Math.cos((new_angle*180)/Math.PI) * magnitude;
    final_pos[1] = -Math.sin((new_angle*180)/Math.PI) * magnitude;

    if (last_pos !== null) {
        diff[0] = final_pos[0] - last_pos[0];
        diff[1] = final_pos[1] - last_pos[1];

        if (Math.abs(diff[0]) < 0.0005) {
            if (final_pos[1] > last_pos[1]) {
                relative_angle = 0;
            } else {
                relative_angle = 180;
            }
        }
        else {
            relative_angle = ((Math.atan(diff[1] / diff[0])*Math.PI)/180);
        }

        if (diff[0] < 0) {
            relative_angle += 180
        }

        if (relative_angle < 0) {
            relative_angle += 360
        }
    }
    to_output(final_pos[0], final_pos[1], relative_angle);
    last_pos = final_pos;
}

function generate_code(x, y) {
    var pos_in_inches = [];
    pos_in_inches[0] = ((x-widthOffset)/width) * 144;
    pos_in_inches[1] = ((y-heightOffset)/height) * 144;
    compute_location(pos_in_inches);
}

function start_code(xbox, ybox) {
    var pos_in_inches = [];
    pos_in_inches[0] = ((xbox+26-widthOffset)/width) * 144;
    pos_in_inches[1] = ((ybox+26-heightOffset)/height) * 144;
    start_pos = pos_in_inches;
    start_angle = 0;
    consol.textContent = "Path path;\n";
}

function clear_console() {
    consol.textContent = "";
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
    generate_code(x+26, y+26);
}

var codeStarted = false;
var start_pos = null; 
var start_angle = null;
var last_pos = null;
var image = document.getElementById("pathgen-image");
var width = image.clientWidth;
var height = image.clientHeight;
var rect = image.getBoundingClientRect();
var widthOffset = rect.left;
var heightOffset = rect.top;
var consol = document.getElementById("console");

var waypoints = [];
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
document.getElementById("start-code").addEventListener("click", function() {
    if (!codeStarted) {
        var startrect = startWaypoint.getBoundingClientRect();
        start_code(startrect.left, startrect.top);
        codeStarted = true;
    }
})
document.getElementById("clear-console").addEventListener("click", clear_console);