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