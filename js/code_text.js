// This variable will contain a list of html span elements which compose the output found in the console
var consol_outputs = []
var commands = []

function startConsole() {
    spanElement = document.createElement("span");
    spanElement.style.display = "block";
    consol_outputs = []

    spanElement.textContent = "[ 0, 0 ] is the starting location of block 0; \r Clockwise Rotation is positive due to the PROS libraray \r Happy Hunting!! \r\r ------- \r\r";
    
    consol.appendChild(spanElement);
    consol.style.scrollbarWidth = "initial";
}

function clearConsole() {
    var consol = document.getElementById("console");
    while (consol.children.length > 1) {
        consol.removeChild(consol.children[1]);
    }
    consol_outputs = [];
    consol.style.scrollbarWidth = "none";
}

function updateConsole(translatedXInches, translatedYInches, angleDegrees, isNew, line1Index) {
    var spanElement;
    var spanElement2;

    if (isNew) {
        spanElement = document.createElement("span");
        spanElement2 = document.createElement("span");
        spanElement.style.display = "block";
        spanElement2.style.display = "block";
        // spanElement.textContent = "path.add_turn(MyTurn(" + Math.round(angleDegrees*100)/100 + "_deg));";
        // spanElement2.textContent = "path.add_straight(Straight({" + Math.round(translatedXInches*100)/100 + "_in, " + Math.round(translatedYInches*100)/100 + "_in, 0_deg" + "}, 0_s, MOTOR_SPEED::MID));";
        spanElement.textContent = "Move to [ " + Math.round(translatedXInches) + ", " + Math.round(translatedYInches) + " ]"
        spanElement2.textContent = "Rotate by " + Math.round(angleDegrees)
        consol.appendChild(spanElement);
        consol.appendChild(spanElement2);
        consol_outputs.push([spanElement,spanElement2])
    } else {
        consol_outputs[line1Index][0].textContent = "Move to [ " + Math.round(translatedXInches) + ", " + Math.round(translatedYInches) + " ]"
        consol_outputs[line1Index][1].textContent = "Rotate by " + Math.round(angleDegrees)
    }
}