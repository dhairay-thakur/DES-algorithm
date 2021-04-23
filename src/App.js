import { useState } from "react";
import styles from "./styles/app.module.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { generate_keys_64, des64 } from "./util/des64";
import { generate_keys_32, des32 } from "./util/des32";
import { generate_keys_128, des128 } from "./util/des128";

const options = ["1", "8", "16", "32"];
const validLengths = [32, 64, 128];
const defaultOption = options[2];

const isWeak = (arr) => {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (arr[i] === arr[j]) {
        return true;
      }
    }
  }
  return false;
};

function App() {
  // let st='dd'/
  const [rounds, setRounds] = useState(defaultOption);
  const [key, setKey] = useState("");
  const [plainText, setPlainText] = useState("");
  const [data, setData] = useState("");
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [error, setError] = useState(null);
  const [encrypt, setEncrypt] = useState(true);

  const handleClick = (flag) => {
    if (!validLengths.includes(key.length)) {
      setError("Key must be of 32 / 64 / 128 bits only!");
    } else if (!validLengths.includes(plainText.length)) {
      setError("Plain Text must be of 32 / 64 / 128 bits only!");
    } else if (plainText.length !== key.length) {
      setError("Key length must be equal to Plain Text length!");
    } else {
      let ans = "",
        temp_keys = [];
      if (key.length === 32) {
        ans = des32(key, plainText, rounds, flag);
        temp_keys = generate_keys_32(key, rounds);
      } else if (key.length === 64) {
        ans = des64(key, plainText, rounds, flag);
        temp_keys = generate_keys_64(key, rounds);
      } else {
        ans = des128(key, plainText, rounds, flag);
        temp_keys = generate_keys_128(key, rounds);
      }
      if (isWeak(temp_keys) && key.length != 32) {
        setError("Weak Key detected. Kindly enter a Stronger Key!");
      } else {
        setError(null);
      }
      setData(ans);
      setGeneratedKeys(temp_keys);
      setEncrypt(flag);
      window.scroll(0, 500);
    }
  };
  return (
    <div className={styles.background}>
      <h1 className={styles.heading}>DES Algorithm</h1>
      <input placeholder="Key" onChange={(e) => setKey(e.target.value)} />
      <input
        placeholder="Plain Text"
        onChange={(e) => setPlainText(e.target.value)}
      />
      {error && <h3 style={{ color: "red" }}>{error}</h3>}
      <div className={styles.row}>
        <p>Number of Rounds = {rounds}</p>
        <Dropdown
          className={styles.dropdown}
          options={options}
          value={defaultOption}
          placeholder="Number of Rounds"
          onChange={(option) => setRounds(option.value)}
        />
      </div>
      <div className={styles.row}>
        <button onClick={() => handleClick(true)}>Encrypt</button>
        <button onClick={() => handleClick(false)}>Decrypt</button>
      </div>
      {data !== "" && (
        <h4
          className={styles.answer}
          style={{ fontSize: key.length === 128 ? 18 : 24 }}
        >
          {encrypt ? "Encrypted" : "Decrypted "} Data = {data}
        </h4>
      )}
      {generatedKeys.map((key, index) => (
        <p style={{ fontSize: "14px" }}>
          K{index + 1} = {key}
        </p>
      ))}
    </div>
  );
}

export default App;
