// Function to convert a number in decimal to binary
const convertDecimalToBinary = (x) => {
  let bin = 0;
  let rem,
    i = 1;
  while (x !== 0) {
    rem = x % 2;
    x = parseInt(x / 2);
    bin = bin + rem * i;
    i = i * 10;
  }
  let binary = bin.toString();
  while (binary.length < 4) {
    binary = "0" + binary;
  }
  return binary;
};
// Function to convert a number in binary to decimal
const convertBinaryToDecimal = (binary) => {
  let decimal = 0;
  let counter = 0;
  let size = binary.length;
  for (let i = size - 1; i >= 0; i--) {
    if (binary[i] === "1") {
      decimal += Math.pow(2, counter);
    }
    counter++;
  }
  return decimal;
};
// Function to do a circular left shift by 1
const shift_left_once = (key_chunk) => {
  let shifted = "";
  for (let i = 1; i < 14; i++) {
    shifted += key_chunk[i];
  }
  shifted += key_chunk[0];
  return shifted;
};
// Function to do a circular left shift by 2
const shift_left_twice = (key_chunk) => {
  let shifted = "";
  for (let i = 0; i < 2; i++) {
    for (let j = 1; j < 14; j++) {
      shifted += key_chunk[j];
    }
    shifted += key_chunk[0];
    key_chunk = shifted;
    shifted = "";
  }
  return key_chunk;
};
// Function to compute xor between two strings
const Xor = (a, b) => {
  let result = "";
  let size = b.length;
  for (let i = 0; i < size; i++) {
    if (a[i] !== b[i]) {
      result += "1";
    } else {
      result += "0";
    }
  }
  return result;
};
// Function to generate the 16 keys.
export const generate_keys_32 = (key, rounds) => {
  // The PC1 table
  const pc1 = [
    10,
    4,
    31,
    5,
    2,
    13,
    23,
    15,
    19,
    17,
    18,
    28,
    12,
    20,
    7,
    29,
    26,
    14,
    9,
    27,
    30,
    25,
    6,
    21,
    22,
    11,
    1,
    3,
  ];
  // The PC2 table
  const pc2 = [
    14,
    16,
    7,
    13,
    18,
    17,
    27,
    15,
    21,
    6,
    28,
    5,
    24,
    3,
    20,
    8,
    4,
    19,
    10,
    2,
    9,
    26,
    23,
    25,
  ];
  let round_keys = [];
  // 1. Compressing the key using the PC1 table
  let perm_key = "";
  for (let i = 0; i < 28; i++) {
    perm_key += key[pc1[i] - 1];
  }
  // 2. Dividing the key into two equal halves
  let left = perm_key.substr(0, 14);
  let right = perm_key.substr(14, 14);
  for (let i = 0; i < rounds; i++) {
    // 3.1. For rounds 1, 2, 9, 16 the key_chunks are shifted by one.
    if (i % 2) {
      left = shift_left_once(left);
      right = shift_left_once(right);
    }
    // 3.2. For other rounds, the key_chunks
    // are shifted by two
    else {
      left = shift_left_twice(left);
      right = shift_left_twice(right);
    }

    // Combining the two chunks
    let combined_key = left + right;
    let round_key = "";
    // Finally, using the PC2 table to transpose the key bits
    for (let i = 0; i < 24; i++) {
      round_key += combined_key[pc2[i] - 1];
    }
    round_keys.push(round_key);
  }
  return round_keys;
};
// Implementing the algorithm
const desHelper = (pt, keys, rounds) => {
  // The initial permutation table
  const initial_permutation = [
    10,
    4,
    31,
    5,
    2,
    13,
    23,
    15,
    19,
    17,
    18,
    28,
    12,
    20,
    7,
    29,
    8,
    26,
    14,
    24,
    9,
    32,
    27,
    30,
    25,
    6,
    21,
    22,
    11,
    1,
    16,
    3,
  ];
  // The expansion table
  const expansion_table = [
    16,
    1,
    2,
    3,
    4,
    5,
    4,
    5,
    6,
    7,
    8,
    9,
    8,
    9,
    10,
    11,
    12,
    13,
    12,
    13,
    14,
    15,
    16,
    1,
  ];
  // The substitution boxes. The should contain values
  // from 0 to 15 in any order.
  const substition_boxes = [
    [
      [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
      [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
      [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
      [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    [
      [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
      [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
      [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
      [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    [
      [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
      [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
      [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
      [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    [
      [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
      [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
      [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
      [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
  ];
  // The permutation table
  const permutation_tab = [
    8,
    7,
    10,
    4,
    2,
    16,
    11,
    13,
    14,
    12,
    3,
    5,
    9,
    15,
    6,
    1,
  ];
  // The inverse permutation table
  const inverse_permutation = [
    30,
    5,
    32,
    2,
    4,
    26,
    15,
    17,
    21,
    1,
    29,
    13,
    6,
    19,
    8,
    31,
    10,
    11,
    9,
    14,
    27,
    28,
    7,
    20,
    25,
    18,
    23,
    12,
    16,
    24,
    3,
    22,
  ];
  // 1. Applying the initial permutation
  let perm = "";
  for (let i = 0; i < 32; i++) {
    perm += pt[initial_permutation[i] - 1];
  }
  // 2. Dividing the result into two equal halves
  let left = perm.substr(0, 16);
  let right = perm.substr(16, 16);
  // The plain text is encrypted 16 times
  for (let i = 0; i < rounds; i++) {
    let right_expanded = "";
    // 3.1. The right half of the plain text is expanded
    for (let i = 0; i < 24; i++) {
      right_expanded += right[expansion_table[i] - 1];
    }

    // 3.3. The result is xored with a key
    let xored = Xor(keys[i], right_expanded);
    let res = "";
    // 3.4. The result is divided into 8 equal parts and passed
    // through 8 substitution boxes. After passing through a
    // substituion box, each box is reduces from 6 to 4 bits.
    for (let i = 0; i < 4; i++) {
      // Finding row and column indices to lookup the substituition box
      let row1 = xored.substr(i * 6, 1) + xored.substr(i * 6 + 5, 1);
      let row = convertBinaryToDecimal(row1);
      let col1 = xored.substr(i * 6 + 1, 4);
      let col = convertBinaryToDecimal(col1);
      let val = substition_boxes[i][row][col];
      res += convertDecimalToBinary(val);
    }
    // 3.5. Another permutation is applied
    let perm2 = "";
    for (let i = 0; i < 16; i++) {
      perm2 += res[permutation_tab[i] - 1];
    }
    // 3.6. The result is xored with the left half
    xored = Xor(perm2, left);
    // 3.7. The left and the right parts of the plain text are swapped
    left = xored;
    if (i < rounds - 1) {
      let temp = right;
      right = xored;
      left = temp;
    }
  }
  // 4. The halves of the plain text are applied
  let combined_text = left + right;
  let ciphertext = "";
  // The inverse of the initial permutaion is applied
  for (let i = 0; i < 32; i++) {
    ciphertext += combined_text[inverse_permutation[i] - 1];
  }
  // And we finally get the cipher text
  return ciphertext;
};
export const des32 = (key, pt, rounds, encrypt) => {
  // Calling the function to generate 16 keys
  const keys = generate_keys_32(key, rounds);
  if (!encrypt) keys.reverse();
  let ct = desHelper(pt, keys, rounds);
  return ct;
};
