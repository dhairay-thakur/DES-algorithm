import styles from "./styles/app.module.css";

function App() {
  return (
    <div className={styles.background}>
      <h1 className={styles.heading}>Hello</h1>
      <input placeholder="plain text"></input>
      <button>Encrypt</button>
      <h3>cipher text goes here</h3>
    </div>
  );
}

export default App;
