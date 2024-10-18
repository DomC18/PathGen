from math import sqrt, atan, radians, cos, sin, degrees
import cv2

class VexUMap:
    def __init__(self):
        self.start_pos = None 
        self.start_angle = None
        self.last_pos = None

    def _to_output(self, translated_x_in, translated_y_in, angle_deg):
        if angle_deg is not None:
            print(f"path.add_turn(MyTurn({angle_deg:.0f}_deg));")
        print("path.add_straight(Straight({" + f"{translated_x_in:.0f}_in, {translated_y_in:.0f}_in, 0_deg" + "}, 0_s, MOTOR_SPEED::MID));")

    def _compute_location(self, location):
        x_in, y_in = location
        orig_pos = (x_in - self.start_pos[0], y_in - self.start_pos[1])
        magnitude = sqrt(orig_pos[0] ** 2 + orig_pos[1] ** 2)

        if -0.0005 < orig_pos[0] < 0.05:
            old_angle = (90 if orig_pos[1] < 0 else 270)
        else:
            old_angle = degrees(atan(orig_pos[1] / orig_pos[0]))

        if orig_pos[0] < 0:
            old_angle += 180
        new_angle = old_angle - self.start_angle
        final_pos = (cos(radians(new_angle)) * magnitude, -sin(radians(new_angle)) * magnitude)

        relative_angle = None
        if self.last_pos is not None:
            diff = (final_pos[0] - self.last_pos[0], final_pos[1] - self.last_pos[1])

            if abs(diff[0]) < 0.0005:
                relative_angle = (0 if final_pos[1] > self.last_pos[1] else 180)
            else:
                relative_angle = degrees(atan(diff[1] / diff[0]))

            if diff[0] < 0:
                relative_angle += 180

            if relative_angle < 0:
                relative_angle += 360
        self._to_output(final_pos[0], final_pos[1], relative_angle)
        self.last_pos = final_pos

    def click_event(self, event, x, y, _, __):
        if event == cv2.EVENT_LBUTTONDOWN:
            pos_in_inches = x / width * 144, -y / height * 144
            if self.start_pos is None:
                self.start_pos = pos_in_inches
                self.start_angle = -float(input("Enter starting angle in degrees (clockwise is positive):"))
                print("Starting angle set\nClick on first location on map:")
                print("Code:\nPath path;")
            else:
                self._compute_location(pos_in_inches)

if __name__ == "__main__":
    img = cv2.imread(r"C:\Users\dmaca\Desktop\RoboCode\VEXU\pathgen\coordinates\map.png", 1)
    scale_percent = 50
    width = int(img.shape[1] * scale_percent / 100)
    height = int(img.shape[0] * scale_percent / 100)
    dim = (width, height)
    resized = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
    map = VexUMap()
    cv2.imshow("Vex U Map", resized)

    cv2.setMouseCallback("Vex U Map", map.click_event)
    cv2.waitKey(0)
    cv2.destroyAllWindows()