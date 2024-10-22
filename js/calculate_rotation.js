start_location = null;
start_angle = null; 

function magnitude(vector) {
    sum_sq_coord = 0
    for (coord in vector) {
        sum_sq_coord += vector[coord] * vector[coord]
    }
    return Math.sqrt(sum_sq_coord)
}

function dot(a, b) {
    return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
}

function determinant (v1, v2) {
    return v1.map((x, i) => v1[i] * v2[v2.length - 1 - i]).reduce((m, n) => m + n);
}

function angle_between(vector_1, vector_2){
    
    let dot_prod = dot(vector_1,vector_2)
    let mag_1 = magnitude(vector_1)
    let mag_2 = magnitude(vector_2)

    let mag = Math.acos( dot(vector_1, vector_2) / ( mag_1 * mag_2))

    return mag
}


function rotate (location, angle_facing, destination) {    
    angle_facing = angle_facing * Math.PI/180

    let location_x = location[0]
    let location_y = location[1]
    let final_x = destination[0] - location_x
    let final_y = destination[1] - location_y

    let inital_vector = [Math.cos(angle_facing), Math.sin(angle_facing)]
    let final_vector = [final_x, final_y]
    
    let angle = angle_between(inital_vector, final_vector)
    angle = angle * 180 / Math.PI

    //counterclockwise = negative rotation because of PROS library
    let det = determinant(inital_vector, final_vector)

    return angle * -det/Math.abs(det)
}

// let location = [0,0]
// let destination = [0,1]
// let angle = 60

// console.log(rotate(location, angle, destination))

