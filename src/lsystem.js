import { Line3, Vector3, Euler } from "three";
/*
 * an l-system (lindenmayer system) is a formal grammar consisting of an alphabet of symbols and a collection of production rules https://en.wikipedia.org/wiki/L-system
 * it's used to describe the behavior of plant cells/model the morphology of organisms/create fractal-like forms
 *
 * [x' y' z'] = [x y z]R
 * yaw
 * Rz(A) = [[cos(C)  -sin(C) 0]
 *         [sin(C) cos(C) 0]
 *         [0       0      1]];
 *
 * pitch
 * Ry(B) = [[cos(B) 0 sin(B)]
 *          [0      1 0]
 *          [-sin(B) 0 cos(B)]]
 *
 * roll
 * Rx(C) = [[1 0      0]
 *          [0 cos(A) -sin(A)]
 *          [0 sin(A) cos(A)]]
 *
 * R(ABC) = Rz(A) . Ry(B) . Rx(C) = [
 *   [cons(A)*cos(B) cos(A)*sin(B)*sin(C)-sin(A)*cos(C) cos(A)*sin(B)*cos(C)+sin(A)*sin(C)]
 *   [sin(A)*cos(B)  sin(A)*sin(B)*sin(C)+cos(A)*cos(C) sin(A)*sin(B)*cos(C)-cos(A)*sin(C)]
 *   [-sin(B)        cos(B)*sin(C)                      cos(B)*cos(C)]
 * ]
 *
 * grammar:
 * + turn left by angle A using rotation matrix Rz(A)
 * - turn right by angle A using rotation matrix Rz(-A)
 * & pitch down by angle B using rotation matrix Ry(B)
 * ^ pitch up by angle B using rotation matrix Ry(-B)
 * \ roll left by angle C using rotation matrix Rx(C)
 * / roll right by angle C using rotation matrix Rx(-C)
 * | turn around using rotation matrix Rz(180deg)
 */

/*
const R_Z = [
  [(angle) => Math.cos(angle), (angle) => -Math.sin(angle), () => 0],
  [(angle) => Math.sin(angle), (angle) => Math.cos(angle), () => 0],
  [() => 0, () => 0, () => 1]
];

const R_Y = [
  [(angle) => Math.cos(angle), () => 0, (angle) => Math.sin(angle)],
  [() => 0, () => 1, () => 0],
  [(angle) => -Math.sin(angle), () => 0, (angle) => Math.cos(angle)]
]

const R_X = [
  [() => 1, () => 0, () => 0],
  [() => 0, (angle) => Math.cos(angle), (angle) => -Math.sin(angle)],
  [() => 0, (angle) => Math.sin(angle), (angle) => Math.cos(angle)]
]
*/

function createLSystem({lSystem, variables, constants, rules, iterationCount}) {
  if (iterationCount === 0) return lSystem;
  lSystem = lSystem.split('').reduce((acc, chr) => {
    let curr = '';
    if (constants.includes(chr)) {
      curr = chr;
    } else if (chr in rules && variables.includes(chr)) {
      curr = rules[chr];
    } else {
      console.log('error here');
    }

    acc = acc + curr;
    return acc
  }, '');
  console.log('curr', lSystem);

  return createLSystem({
    lSystem,
    variables,
    constants,
    rules,
    iterationCount: iterationCount - 1,
  });
}

function draw(instructions, angle = 45, vector = new Vector3(0, 1, 0), orientation = new Euler(0, 0, 0, 'XYZ')) {
  const stack = [];
  let lines = [];

  let position = [0, 0, 0];
  instructions.split('').forEach((instruction) => {
    switch(instruction) {
      case '[':
        // push position and orientation
        // console.log('push', position, orientation)
        stack.push({position: [...position], orientation: orientation.clone(), vector: vector.clone()})
        break;
      case ']':
        // pop position and orientation
        const res = stack.pop()
        position = res.position;
        orientation.copy(res.orientation);
        vector.copy(res.vector);
        break;
      case '+':
        orientation.set(orientation.x, orientation.y, orientation.z + toRadians(angle))
        vector.applyEuler(orientation)
        break;
      case '-':
        orientation.set(orientation.x, orientation.y, orientation.z - toRadians(angle))
        vector.applyEuler(orientation)
        break;
      case '&':
        orientation.set(orientation.x, orientation.y - toRadians(angle), orientation.z)
        vector.applyEuler(orientation)
        break;
      case '^':
        orientation.set(orientation.x, orientation.y + toRadians(angle), orientation.z)
        vector.applyEuler(orientation)
        break;
      case '\\':
        orientation.set(orientation.x + toRadians(angle), orientation.y, orientation.z)
        vector.applyEuler(orientation)
        break;
      case '/':
        orientation.set(orientation.x - toRadians(angle), orientation.y, orientation.z)
        vector.applyEuler(orientation)
        break;
      case '|':
      default:
        // increment forward in given orientation
        // vector = getNewPosition(orientation, vector)
        // const pos = position.map((val, index) => val + vector[index]);
        // get new x,y,z from vector3 + position
        const end = [vector.x + position[0], vector.y + position[1], vector.z + position[2]]
        lines.push([new Vector3(...position), new Vector3(...end)])
        position = end;
    }
  })

  return lines;
}

/* jk idk how to do matrix math apparently 
function getNewPosition(orientation, vector = [0, 1, 0]) {
  const [angleX, angleY, angleZ] = orientation
  let x = vector[0], y = vector[1], z = vector[2];
  const [x0, y0, _z0] = [x, y, z].map((pos, index) => {
    const newPos = R_Z.reduce((acc, curr) => curr[index](toRadians(angleZ)) * pos + acc,0)
    return newPos;
  })
  x = x0;
  y = y0;
  console.log('x',x,'y',y,'z',z)
  const [x1, _y1, z1] = [x, y, z].map((pos, index) => {
    const newPos = R_Y.reduce((acc, curr) => curr[index](toRadians(angleY)) * pos + acc,0)
    return newPos;
  })
  x = x1;
  z = z1;
  console.log('x1',x,'y1',y,'z1',z)
  const [_x2, y2, z2] = [x, y, z].map((pos, index) => {
    const newPos = R_X.reduce((acc, curr) => curr[index](toRadians(angleX)) * pos + acc,0)
    return newPos;
  })
  y = y2
  z = z2

  console.log('x2',x,'y2',y,'z2',z)
  return [x, y, z]
}
*/
function toRadians(angle) {
  return angle * (Math.PI / 180)
}

export function generateLines({
  axiom,
  variables,
  constants,
  rules,
  iterations,
  angle,
}) {
  // recursively create l-system
  const instructions = createLSystem({
    lSystem: axiom,
    variables,
    constants,
    rules,
    iterationCount: iterations,
  });
  console.log('instructions', instructions)

  const vectors = draw(instructions, angle)

  console.log('maybe vectors?', vectors)
  // return a set of line segment points which will be used to draw the l-system
  return vectors;
}
