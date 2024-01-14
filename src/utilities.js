export function toRadians(angle) {
  return angle * (Math.PI / 180)
}

export function decimalToBinary(num=10, size) {
  let i = Math.floor(Math.log2(num));
  if (isNaN(i) || Math.abs(i) === Infinity) {
    i = 0
  }
  let curr = num;
  let res = Array(i+1).fill(0).map((_, n) => {
    const on = 2 ** (i - n);
    // console.log('curr', curr, on, n, i)
    if (curr - on >= 0) {
      curr -= on;
      return 1;
    }
    return 0;
  })

  if (size) {
    while (res.length < size) {
      res.unshift(0);
    }
  }

  return res.join('')
}

