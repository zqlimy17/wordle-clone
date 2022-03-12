document.addEventListener("DOMContentLoaded", () => {
  let wordOfTheDay;
  let dictionary = words5;
  const grid = document.getElementById("grid");
  const keyboard = document.getElementById("keyboard");
  const keyboardTopRowKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const keyboardHomeRowKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const keyboardBottomRowKeys = [
    "del",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
    "enter",
  ];

  const statsContainer = document.getElementById("statsContainer");
  const settingsContainer = document.getElementById("settingsContainer");
  const againButton = document.getElementById("again");
  const settingsButton = document.getElementById("settings");
  const closeButton = document.getElementById("closeButton");
  let gameEnded = false;
  let currentWord = [];
  let prevWords = [];
  const lettersPattern = /[a-z]/;

  let wordLength = parseInt(localStorage.getItem("wordsLength")) || 5;

  const validate = (animate = false) => {
    if (currentWord.length > 0 && animate) {
      const toBump = document.getElementById(
        prevWords.length * wordLength + currentWord.length
      );
      toBump.classList.add("bump");
      toBump.classList.add("entered");
      setTimeout(() => toBump.classList.remove("bump"), 200);
    } else if (!animate) {
      const toBump = document.getElementById(
        prevWords.length * wordLength + currentWord.length + 1
      );
      toBump.classList.remove("entered");
    }
    for (let i = 0; i < wordLength; i++) {
      document.getElementById(prevWords.length * wordLength + i + 1).innerHTML =
        currentWord[i] ? currentWord[i] : "";
    }
  };

  const enter = () => {
    let base = prevWords.length * wordLength;
    if (
      !gameEnded &&
      currentWord.length === wordLength &&
      dictionary.indexOf(currentWord.join("")) != -1
    ) {
      let wordOfTheDayTemp = wordOfTheDay.split("");
      let input = [...currentWord];
      for (let i = 0; i < wordLength; i++) {
        if (wordOfTheDayTemp[i] === currentWord[i]) {
          input[i] = null;
          wordOfTheDayTemp[i] = null;
          setTimeout(
            () =>
              document.getElementById(base + i + 1).classList.add("correct"),
            i * 400
          );
          setTimeout(() => {
            document.getElementById(currentWord[i]).classList.add("correct");
          }, 400 * wordLength);
        }
      }

      if (!wordOfTheDayTemp.some((el) => el !== null)) {
        for (let i = 1; i <= wordLength; i++) {
          setTimeout(() => {
            document.getElementById(base + i).classList.add("jump");
          }, wordLength * 400 + i * 100);
        }
        setTimeout(() => {
          document.getElementById("message").innerHTML = "Fantastic";
          document.getElementById("message").classList.add("show");
        }, wordLength * 400);
        setTimeout(() => {
          document.getElementById("message").classList.remove("show");
        }, wordLength * 400 + 1500);
        gameEnded = true;
        save(true);
      } else {
        for (let i = 0; i < wordLength; i++) {
          if (wordOfTheDayTemp.includes(input[i]) && input[i]) {
            wordOfTheDayTemp.splice(wordOfTheDayTemp.indexOf(input[i]), 1);
            setTimeout(
              () =>
                document
                  .getElementById(base + i + 1)
                  .classList.add("semi-correct"),
              i * 400
            );
            setTimeout(() => {
              document
                .getElementById(currentWord[i])
                .classList.add("semi-correct");
            }, 400 * wordLength);
          } else {
            setTimeout(
              () =>
                document.getElementById(base + i + 1).classList.add("wrong"),
              i * 400
            );
            setTimeout(() => {
              document.getElementById(currentWord[i]).classList.add("wrong");
            }, 400 * wordLength);
          }
        }
      }

      setTimeout(() => {
        prevWords.push(currentWord);
        currentWord = [];
        if (prevWords.length === 6) {
          gameEnded = true;
          save(false);
        }
      }, 400 * wordLength);
    } else {
      if (currentWord.length !== wordLength) {
        document.getElementById("message").innerHTML = "Not enough letters";
      } else {
        document.getElementById("message").innerHTML = "Not in words list";
      }
      for (let i = 1; i <= wordLength; i++) {
        document
          .getElementById(prevWords.length * wordLength + i)
          .classList.add("shake");
        setTimeout(() => {
          document.getElementById("message").classList.remove("show");
          document
            .getElementById(prevWords.length * wordLength + i)
            .classList.remove("shake");
        }, 400);
      }
      document.getElementById("message").classList.add("show");
    }
  };

  const save = (win) => {
    const gamesPlayedEl = document.getElementById("gamesPlayed");
    const winPercentageEl = document.getElementById("winPercentage");
    const currentStreakEl = document.getElementById("currentStreak");
    const maxStreakEl = document.getElementById("maxStreak");

    let gamesPlayed = parseInt(localStorage.getItem("gamesPlayed")) || 0;
    let gamesWon = parseInt(localStorage.getItem("gamesWon")) || 0;
    let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
    let maxStreak = parseInt(localStorage.getItem("maxStreak")) || 0;

    gamesPlayed++;
    localStorage.setItem("gamesPlayed", gamesPlayed);
    if (win) {
      gamesWon++;
      currentStreak++;
      localStorage.setItem("currentStreak", currentStreak);
      localStorage.setItem("gamesWon", gamesWon);
      if (maxStreak < currentStreak) {
        maxStreak++;
        localStorage.setItem("maxStreak", maxStreak);
      }
      setTimeout(() => {
        statsContainer.classList.add("show");
      }, 2000 + wordLength * 190);
    } else {
      currentStreak = 0;
      localStorage.setItem("winPercentage", gamesWon / gamesPlayed);
      localStorage.setItem("currentStreak", 0);
      statsContainer.classList.add("show");
      document.getElementById("answer").innerHTML = wordOfTheDay;
    }
    gamesPlayedEl.innerHTML = gamesPlayed;
    winPercentageEl.innerHTML = ((gamesWon / gamesPlayed) * 100).toFixed(2);
    currentStreakEl.innerHTML = currentStreak;
    maxStreakEl.innerHTML = maxStreak;
  };

  const keypress = (value) => {
    if (!gameEnded) {
      if (value === "del") {
        if (currentWord.length > 0) {
          currentWord.pop();
        }
        validate();
      } else if (value === "enter") {
        enter();
      } else {
        if (currentWord.length < wordLength) {
          currentWord.push(value);
        }
        validate(true);
      }
    }
  };

  const reset = () => {
    gameEnded = false;
    prevWords = [];
    currentWord = [];
    while (keyboard.firstChild) {
      keyboard.removeChild(keyboard.firstChild);
    }
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    settingsContainer.classList.remove("show");
    statsContainer.classList.remove("show");
    init();
  };

  for (let i = 4; i <= 8; i++) {
    document.getElementById(`words${i}`).addEventListener("click", () => {
      wordLength = parseInt(document.getElementById(`words${i}`).dataset.words);
      localStorage.setItem("wordsLength", i);
      reset();
    });
  }
  const init = () => {
    for (let i = 4; i <= 8; i++) {
      document.getElementById(`words${i}`).classList.remove("active");
    }
    document.getElementById(`words${wordLength}`).classList.add("active");
    switch (wordLength) {
      case 4:
        dictionary = words4;
        break;
      case 5:
        dictionary = words5;
        break;
      case 6:
        dictionary = words6;
        break;
      case 7:
        dictionary = words7;
        break;
      case 8:
        dictionary = words8;
        break;
    }
    wordOfTheDay = dictionary[Math.floor(Math.random() * dictionary.length)];
    console.log(wordOfTheDay);
    for (let i = 0; i < wordLength * 6; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", i + 1);
      square.style.width = `${80 / wordLength}vw`;
      square.style.height = `${80 / wordLength}vw`;
      grid.appendChild(square);
      grid.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
    }

    let keyboardTopRow = document.createElement("div");
    keyboardTopRow.classList.add("keyboard-row");
    let keyboardHomeRow = document.createElement("div");
    keyboardHomeRow.classList.add("keyboard-row");
    let keyboardBottomRow = document.createElement("div");
    keyboardBottomRow.classList.add("keyboard-row");

    for (let i = 0; i < keyboardTopRowKeys.length; i++) {
      let key = document.createElement("button");
      key.addEventListener("click", () => {
        keypress(keyboardTopRowKeys[i]);
      });
      key.setAttribute("id", keyboardTopRowKeys[i]);
      key.innerText = keyboardTopRowKeys[i];
      keyboardTopRow.appendChild(key);
    }

    for (let i = 0; i < keyboardHomeRowKeys.length; i++) {
      let key = document.createElement("button");
      key.addEventListener("click", () => {
        keypress(keyboardHomeRowKeys[i]);
      });
      key.setAttribute("id", keyboardHomeRowKeys[i]);

      key.innerText = keyboardHomeRowKeys[i];
      keyboardHomeRow.appendChild(key);
    }

    for (let i = 0; i < keyboardBottomRowKeys.length; i++) {
      let key = document.createElement("button");
      key.addEventListener("click", () => {
        keypress(keyboardBottomRowKeys[i]);
      });
      key.setAttribute("id", keyboardBottomRowKeys[i]);

      key.innerText = keyboardBottomRowKeys[i];
      if (i === 0) {
        key.classList.add("delete");
      } else if (i === keyboardBottomRowKeys.length - 1) {
        key.classList.add("enter");
      }
      keyboardBottomRow.appendChild(key);
    }

    keyboard.appendChild(keyboardTopRow);
    keyboard.appendChild(keyboardHomeRow);
    keyboard.appendChild(keyboardBottomRow);
  };

  document.addEventListener("keydown", (e) => {
    if (!gameEnded) {
      let keypress = e.key;
      if (keypress.length === 1 && !e.repeat) {
        let isLetter = lettersPattern.test(keypress);
        if (isLetter) {
          if (currentWord.length < wordLength) {
            currentWord.push(keypress);
          }
        }
        validate(true);
      }

      if (keypress === "Enter") {
        enter();
      }

      if (keypress === "Backspace") {
        if (currentWord.length) {
          currentWord.pop();
        }
        validate();
      }
    }
  });

  againButton.addEventListener("click", async () => {
    await reset();
    statsContainer.classList.remove("show");
  });

  closeButton.addEventListener("click", () => {
    statsContainer.classList.remove("show");
  });

  settingsButton.addEventListener("click", () => {
    statsContainer.classList.remove("show");
    settingsContainer.classList.add("show");
  });
  init();
});
