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
  for (let i = 1; i < 56; i++) {
    shifted += key_chunk[i];
  }
  shifted += key_chunk[0];
  return shifted;
};
// Function to do a circular left shift by 2
const shift_left_twice = (key_chunk) => {
  let shifted = "";
  for (let i = 0; i < 2; i++) {
    for (let j = 1; j < 56; j++) {
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
export const generate_keys_128 = (key, rounds) => {
  // The PC1 table
  const pc1 = [
    42,
    36,
    63,
    5,
    98,
    109,
    87,
    47,
    83,
    17,
    74,
    114,
    60,
    106,
    108,
    52,
    39,
    92,
    61,
    13,
    26,
    37,
    95,
    14,
    29,
    7,
    19,
    78,
    73,
    68,
    12,
    4,
    91,
    126,
    10,
    57,
    38,
    94,
    85,
    76,
    125,
    23,
    118,
    70,
    20,
    11,
    51,
    33,
    27,
    81,
    111,
    65,
    121,
    55,
    119,
    31,
    93,
    46,
    21,
    115,
    69,
    103,
    49,
    34,
    35,
    18,
    30,
    75,
    3,
    58,
    45,
    1,
    127,
    86,
    107,
    77,
    84,
    15,
    82,
    113,
    105,
    117,
    90,
    54,
    43,
    102,
    44,
    2,
    124,
    6,
    22,
    25,
    101,
    79,
    50,
    71,
    116,
    123,
    9,
    122,
    89,
    41,
    97,
    62,
    67,
    66,
    28,
    99,
    53,
    100,
    110,
    59,
  ];
  // The PC2 table
  const pc2 = [
    42,
    100,
    63,
    69,
    18,
    45,
    55,
    15,
    83,
    49,
    106,
    34,
    98,
    28,
    44,
    84,
    71,
    12,
    61,
    95,
    62,
    13,
    7,
    111,
    3,
    78,
    89,
    20,
    92,
    39,
    68,
    75,
    94,
    90,
    73,
    22,
    30,
    37,
    93,
    54,
    102,
    110,
    107,
    109,
    51,
    65,
    91,
    81,
    1,
    25,
    99,
    10,
    67,
    77,
    5,
    19,
    53,
    97,
    101,
    33,
    50,
    35,
    103,
    82,
    74,
    6,
    58,
    23,
    31,
    79,
    26,
    2,
    66,
    59,
    47,
    21,
    9,
    70,
    87,
    86,
    105,
    85,
    60,
    57,
    11,
    41,
    43,
    29,
    36,
    17,
    46,
    14,
    27,
    38,
    52,
    76,
  ];
  let round_keys = [];
  // 1. Compressing the key using the PC1 table
  let perm_key = "";
  for (let i = 0; i < 112; i++) {
    perm_key += key[pc1[i] - 1];
  }
  // 2. Dividing the key into two equal halves
  let left = perm_key.substr(0, 56);
  let right = perm_key.substr(56, 56);
  for (let i = 0; i < rounds; i++) {
    if (i % 2) {
      left = shift_left_once(left);
      right = shift_left_once(right);
    } else {
      left = shift_left_twice(left);
      right = shift_left_twice(right);
    }

    // Combining the two chunks
    let combined_key = left + right;
    let round_key = "";
    // Finally, using the PC2 table to transpose the key bits
    for (let i = 0; i < 96; i++) {
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
    42,
    36,
    63,
    5,
    98,
    109,
    87,
    47,
    83,
    17,
    74,
    114,
    60,
    106,
    108,
    52,
    39,
    92,
    61,
    13,
    26,
    37,
    95,
    14,
    29,
    7,
    19,
    78,
    73,
    68,
    12,
    4,
    91,
    126,
    10,
    57,
    38,
    94,
    85,
    76,
    125,
    23,
    118,
    70,
    20,
    11,
    51,
    33,
    27,
    81,
    111,
    65,
    121,
    55,
    119,
    31,
    93,
    46,
    21,
    115,
    69,
    103,
    49,
    34,
    35,
    18,
    30,
    75,
    3,
    58,
    45,
    1,
    127,
    86,
    107,
    77,
    84,
    15,
    82,
    113,
    105,
    117,
    90,
    54,
    43,
    102,
    44,
    2,
    124,
    6,
    22,
    25,
    101,
    79,
    50,
    71,
    116,
    123,
    9,
    122,
    89,
    41,
    97,
    62,
    67,
    66,
    28,
    99,
    53,
    100,
    110,
    59,
  ];
  // The expansion table
  const expansion_table = [
    64,
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
    33,
    32,
    33,
    34,
    35,
    36,
    37,
    36,
    37,
    38,
    39,
    40,
    41,
    40,
    41,
    42,
    43,
    44,
    45,
    44,
    45,
    46,
    47,
    48,
    49,
    48,
    49,
    50,
    51,
    52,
    53,
    52,
    53,
    54,
    55,
    56,
    57,
    56,
    57,
    58,
    59,
    60,
    61,
    60,
    61,
    62,
    63,
    64,
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
    42,
    36,
    63,
    5,
    34,
    45,
    23,
    47,
    19,
    17,
    10,
    50,
    60,
    44,
    52,
    39,
    28,
    61,
    8,
    13,
    26,
    37,
    31,
    14,
    29,
    7,
    56,
    9,
    4,
    12,
    32,
    27,
    62,
    57,
    38,
    30,
    21,
    54,
    6,
    20,
    11,
    51,
    33,
    1,
    55,
    46,
    16,
    49,
    35,
    18,
    3,
    58,
    22,
    43,
    64,
    40,
    15,
    48,
    24,
    41,
    53,
    2,
    25,
    59,
  ];
  // The inverse permutation table
  const inverse_permutation = [
    104,
    71,
    106,
    116,
    82,
    128,
    75,
    109,
    42,
    78,
    59,
    44,
    115,
    124,
    100,
    125,
    67,
    85,
    121,
    28,
    105,
    14,
    119,
    91,
    47,
    52,
    32,
    74,
    27,
    103,
    51,
    56,
    50,
    89,
    36,
    38,
    94,
    6,
    24,
    95,
    53,
    18,
    15,
    3,
    117,
    66,
    34,
    62,
    93,
    8,
    113,
    63,
    98,
    2,
    127,
    107,
    108,
    23,
    16,
    57,
    43,
    49,
    60,
    48,
    61,
    25,
    92,
    68,
    123,
    21,
    118,
    10,
    122,
    41,
    26,
    22,
    114,
    112,
    120,
    1,
    102,
    12,
    76,
    81,
    73,
    72,
    101,
    31,
    29,
    70,
    37,
    45,
    17,
    35,
    126,
    20,
    54,
    79,
    97,
    96,
    7,
    86,
    5,
    84,
    55,
    99,
    80,
    9,
    11,
    69,
    77,
    88,
    46,
    33,
    58,
    90,
    111,
    83,
    64,
    13,
    65,
    4,
    40,
    110,
    19,
    30,
    39,
    87,
  ];
  // 1. Applying the initial permutation
  let perm = pt;
  //   for (let i = 0; i < 128; i++) {
  //     perm += pt[initial_permutation[i] - 1];
  //   }
  // 2. Dividing the result into two equal halves
  let left = perm.substr(0, 64);
  let right = perm.substr(64, 64);
  for (let i = 0; i < rounds; i++) {
    let right_expanded = "";
    // 3.1. The right half of the plain text is expanded
    for (let i = 0; i < 96; i++) {
      right_expanded += right[expansion_table[i] - 1];
    }
    // 3.3. The result is xored with a key
    let xored = Xor(keys[i], right_expanded);
    let res = "";
    // 3.4. The result is divided into 8 equal parts and passed
    // through 8 substitution boxes. After passing through a
    // substituion box, each box is reduces from 6 to 4 bits.
    for (let i = 0; i < 16; i++) {
      // Finding row and column indices to lookup the substituition box
      let row1 = xored.substr(i * 6, 1) + xored.substr(i * 6 + 5, 1);
      let row = convertBinaryToDecimal(row1);
      let col1 = xored.substr(i * 6 + 1, 4);
      let col = convertBinaryToDecimal(col1);
      let val = substition_boxes[i % 8][row][col];
      res += convertDecimalToBinary(val);
    }
    // 3.5. Another permutation is applied
    let perm2 = "";
    for (let i = 0; i < 64; i++) {
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
  // The inverse of the initial permutaion is applied
  //   for (let i = 0; i < 128; i++) {
  //     ciphertext += combined_text[inverse_permutation[i] - 1];
  //   }
  // And we finally get the cipher text
  return combined_text;
};
export const des128 = (key, pt, rounds, encrypt) => {
  // Calling the function to generate 16 keys
  const keys = generate_keys_128(key, rounds);
  if (!encrypt) keys.reverse();
  let ct = desHelper(pt, keys, rounds);
  return ct;
};
