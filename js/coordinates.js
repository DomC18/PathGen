var start_pos = null; 
var start_angle = null;
var last_pos = null;

function to_output(self, translated_x_in, translated_y_in, angle_deg) {
    if (angle_deg !== null) {
        console.log("path.add_turn(MyTurn({angle_deg:.0f}_deg));" + angle_deg + "_deg));")
    }
    console.log("path.add_straight(Straight({" + translated_x_in + "_in, " + translated_y_in + "_in, 0_deg" + "}, 0_s, MOTOR_SPEED::MID));")
}

function compute_location(self, location) {
    var x_in;
    var y_in;
    var old_angle;
    var new_angle;
    var final_pos;
    var orig_pos;
    var magnitude;
    var relative_angle;

    x_in = location[0];
    y_in = location[1];
    orig_pos = (x_in - start_pos[0], y_in - start_pos[1]);
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
    final_pos = (Math.cos((new_angle*180)/Math.PI) * magnitude, -Math.sin((new_angle*180)/Math.PI) * magnitude);

    if (last_pos !== null) {
        diff = (final_pos[0] - self.last_pos[0], final_pos[1] - self.last_pos[1]);

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

function click_event() {
    pos_in_inches = (x / width * 144, -y / height * 144);
    if (start_pos !== null) {
        start_pos = pos_in_inches;
        start_angle = -float(input("Enter starting angle in degrees (clockwise is positive):"));
        console.log("Starting angle set\nClick on first location on map:");
        console.log("Code:\nPath path;");
    }
    else {
        compute_location(pos_in_inches);
    }
}