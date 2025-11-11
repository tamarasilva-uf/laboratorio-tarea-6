import React, { useState, useEffect } from "react";
import "./App.css";

const fruits = [
  "assets/camara.png",
  "assets/compas.png",
  "assets/destacador.png",
  "assets/escuadra.png",
  "assets/estrella.png",
  "assets/lapiz.png",
  "assets/letras.png",
  "assets/memoria.png",
];

const extraFruits = [
  "assets/mouse.png",
  "assets/muestra.png",
  "assets/paleta.png",
  "assets/pluma.png",
  "assets/regla.png",
  "assets/selector.png",
  "assets/tableta.png",
];

const hardFruits = [...fruits, ...extraFruits];


const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function App() {
 
  const [mode, setMode] = useState("menu"); 
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  
  useEffect(() => {
    if (mode === "normal" || mode === "hard") {
      if (timeLeft === 0) {
        setMode("failure");
        return;
      }
      const interval = setInterval(() => {
        setTimeLeft((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, timeLeft]);

  
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  
  function startNormal() {
    const newDeck = shuffle([...fruits, ...fruits]).map((src, i) => ({
      id: i,
      src,
    }));
    setDeck(newDeck);
    setMode("normal");
    setFlipped([]);
    setMatched([]);
    setTimeLeft(30);
  }

  function startHard() {
    const newDeck = shuffle([...hardFruits, ...hardFruits]).map((src, i) => ({
      id: i,
      src,
    }));
    setDeck(newDeck);
    setMode("hard");
    setFlipped([]);
    setMatched([]);
    setTimeLeft(80);
  }


  function handleFlip(card) {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id))
      return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [id1, id2] = newFlipped;
      const c1 = deck.find((c) => c.id === id1);
      const c2 = deck.find((c) => c.id === id2);

      if (c1.src === c2.src) {
        setMatched([...matched, id1, id2]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

 
  useEffect(() => {
    if (mode === "normal" && matched.length === 16) {
      setMode("successNormal");
    }
    if (mode === "hard" && matched.length === 30) {
      setMode("successHard");
    }
  }, [matched, mode]);

  function resetGame() {
    setMode("menu");
    setDeck([]);
    setMatched([]);
    setFlipped([]);
    setTimeLeft(0);
  }

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className={`app ${theme}-theme`}>
   
      <div className="topbar">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Noche" : "🌞 Día"}
        </button>
      </div>

      {mode === "menu" && (
        <div className="menu">
          <h1>Flip It!</h1>
          <p>Encuentra todas las parejas antes de que se acabe el tiempo.</p>
          <button onClick={startNormal}>Modo Normal</button>
          <button onClick={startHard}>Modo Difícil</button>
        </div>
      )}

      {(mode === "normal" || mode === "hard") && (
        <>
          <div className="timer">{formatTime(timeLeft)}</div>
          <div
            className={`board ${
              mode === "normal" ? "board-normal" : "board-hard"
            }`}
          >
            {deck.map((card) => {
              const isFlipped =
                flipped.includes(card.id) || matched.includes(card.id);
              return (
                <div
                  key={card.id}
                  className={`card ${isFlipped ? "flipped" : ""}`}
                  onClick={() => handleFlip(card)}
                >
                  {isFlipped ? (
                    <img src={card.src} alt="fruit" />
                  ) : (
                    <span>?</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {mode === "successNormal" && (
        <div className="result">
          <h2>¡Nivel completado!</h2>
          <button onClick={startHard}>Siguiente nivel</button>
        </div>
      )}

      {mode === "successHard" && (
        <div className="result">
          <h2>¡Ganaste el juego!</h2>
          <button onClick={resetGame}>Volver al menú</button>
        </div>
      )}

      {mode === "failure" && (
        <div className="result">
          <h2>Tiempo agotado...</h2>
          <button onClick={resetGame}>Reintentar</button>
        </div>
      )}
    </div>
  );
}
