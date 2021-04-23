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
  for (let i = 1; i < 28; i++) {
    shifted += key_chunk[i];
  }
  shifted += key_chunk[0];
  return shifted;
};
// Function to do a circular left shift by 2
const shift_left_twice = (key_chunk) => {
  let shifted = "";
  for (let i = 0; i < 2; i++) {
    for (let j = 1; j < 28; j++) {
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
// Function to generate the keys
export const generate_keys_64 = (key, rounds) => {
  // PC1 table
  const pc1 = [
    57,
    49,
    41,
    33,
    25,
    17,
    9,
    1,
    58,
    50,
    42,
    34,
    26,
    18,
    10,
    2,
    59,
    51,
    43,
    35,
    27,
    19,
    11,
    3,
    60,
    52,
    44,
    36,
    63,
    55,
    47,
    39,
    31,
    23,
    15,
    7,
    62,
    54,
    46,
    38,
    30,
    22,
    14,
    6,
    61,
    53,
    45,
    37,
    29,
    21,
    13,
    5,
    28,
    20,
    12,
    4,
  ];
  // PC2 table
  const pc2 = [
    14,
    17,
    11,
    24,
    1,
    5,
    3,
    28,
    15,
    6,
    21,
    10,
    23,
    19,
    12,
    4,
    26,
    8,
    16,
    7,
    27,
    20,
    13,
    2,
    41,
    52,
    31,
    37,
    47,
    55,
    30,
    40,
    51,
    45,
    33,
    48,
    44,
    49,
    39,
    56,
    34,
    53,
    46,
    42,
    50,
    36,
    29,
    32,
  ];
  let round_keys = [];
  // 1. Compressing the key using the PC1 table
  let perm_key = "";
  for (let i = 0; i < 56; i++) {
    perm_key += key[pc1[i] - 1];
  }
  // 2. Dividing the key into two equal halves
  let left = perm_key.substr(0, 28);
  let right = perm_key.substr(28, 28);
  for (let i = 0; i < rounds; i++) {
    // 3.1 For odd rounds, key_chunks are shifted by one.
    if (i % 2) {
      left = shift_left_once(left);
      right = shift_left_once(right);
    }
    // 3.2 For even rounds, key_chunks are shifted by two
    else {
      left = shift_left_twice(left);
      right = shift_left_twice(right);
    }

    // Combining the two chunks
    let combined_key = left + right;
    let round_key = "";

    // Transposing the key bits using the PC2 table
    for (let i = 0; i < 48; i++) {
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
    58,
    50,
    42,
    34,
    26,
    18,
    10,
    2,
    60,
    52,
    44,
    36,
    28,
    20,
    12,
    4,
    62,
    54,
    46,
    38,
    30,
    22,
    14,
    6,
    64,
    56,
    48,
    40,
    32,
    24,
    16,
    8,
    57,
    49,
    41,
    33,
    25,
    17,
    9,
    1,
    59,
    51,
    43,
    35,
    27,
    19,
    11,
    3,
    61,
    53,
    45,
    37,
    29,
    21,
    13,
    5,
    63,
    55,
    47,
    39,
    31,
    23,
    15,
    7,
  ];
  // The expansion table
  const expansion_table = [
    32,
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
    17,
    16,
    17,
    18,
    19,
    20,
    21,
    20,
    21,
    22,
    23,
    24,
    25,
    24,
    25,
    26,
    27,
    28,
    29,
    28,
    29,
    30,
    31,
    32,
    1,
  ];
  // The substitution boxes.
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
    [
      [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
      [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
      [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
      [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    [
      [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
      [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
      [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
      [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    [
      [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
      [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
      [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
      [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    [
      [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
      [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
      [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
      [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
  ];
  // The permutation table
  const permutation_tab = [
    16,
    7,
    20,
    21,
    29,
    12,
    28,
    17,
    1,
    15,
    23,
    26,
    5,
    18,
    31,
    10,
    2,
    8,
    24,
    14,
    32,
    27,
    3,
    9,
    19,
    13,
    30,
    6,
    22,
    11,
    4,
    25,
  ];
  // The inverse permutation table
  const inverse_permutation = [
    40,
    8,
    48,
    16,
    56,
    24,
    64,
    32,
    39,
    7,
    47,
    15,
    55,
    23,
    63,
    31,
    38,
    6,
    46,
    14,
    54,
    22,
    62,
    30,
    37,
    5,
    45,
    13,
    53,
    21,
    61,
    29,
    36,
    4,
    44,
    12,
    52,
    20,
    60,
    28,
    35,
    3,
    43,
    11,
    51,
    19,
    59,
    27,
    34,
    2,
    42,
    10,
    50,
    18,
    58,
    26,
    33,
    1,
    41,
    9,
    49,
    17,
    57,
    25,
  ];
  // 1. Applying the initial permutation
  let perm = "";
  for (let i = 0; i < 64; i++) {
    perm += pt[initial_permutation[i] - 1];
  }
  // 2. Dividing the result into two equal halves
  let left = perm.substr(0, 32);
  let right = perm.substr(32, 32);
  // The plain text is encrypted for required number of rounds
  for (let i = 0; i < rounds; i++) {
    let right_expanded = "";
    // 3.1 The right half of the plain text is expanded
    for (let i = 0; i < 48; i++) {
      right_expanded += right[expansion_table[i] - 1];
    }

    // 3.2 The result is xored with a key
    let xored = Xor(keys[i], right_expanded);
    let res = "";
    // 3.3 The result is divided into 8 equal parts and passed
    // through 8 substitution boxes. After passing through a
    // substituion box, each box is reduced from 6 to 4 bits.
    for (let i = 0; i < 8; i++) {
      let row1 = xored.substr(i * 6, 1) + xored.substr(i * 6 + 5, 1);
      let row = convertBinaryToDecimal(row1);
      let col1 = xored.substr(i * 6 + 1, 4);
      let col = convertBinaryToDecimal(col1);
      let val = substition_boxes[i][row][col];
      res += convertDecimalToBinary(val);
    }
    // 3.4 Another permutation is applied
    let perm2 = "";
    for (let i = 0; i < 32; i++) {
      perm2 += res[permutation_tab[i] - 1];
    }
    // 3.5 The result is xored with the left half
    xored = Xor(perm2, left);
    // 3.6 The left and the right parts of the plain text are swapped
    left = xored;
    if (i < rounds - 1) {
      let temp = right;
      right = xored;
      left = temp;
    }
  }
  // 4. The halves of the plain text are combined
  let combined_text = left + right;
  let ciphertext = "";
  // The inverse of the initial permuttaion is applied
  for (let i = 0; i < 64; i++) {
    ciphertext += combined_text[inverse_permutation[i] - 1];
  }
  // We get the cipher text
  return ciphertext;
};
export const des64 = (key, pt, rounds, encrypt) => {
  // Calling the function to generate keys
  const keys = generate_keys_64(key, rounds);
  // if decryption is desired, reverse the order of keys 
  if (!encrypt) keys.reverse();
  let ct = desHelper(pt, keys, rounds);
  return ct;
};
