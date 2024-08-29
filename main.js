let fetched = fetch("./data.json");
let data;
let input;

class GenerationError extends Error {}

function addOne() {
  const text = document.getElementById("input")
    .value
    .toLowerCase()
    .trim()
    .split(/\s+/);
  let length = text.length + 1;
  let frequency = null;
  do {
    length--;
    if (length === 0 && text.length !== 0) {
      throw new GenerationError("unable to generate");
    }
    frequency = data[text.slice(text.length - length).join(" ")];
  } while (frequency == null);
  let total = 0;
  const space = Object.entries(frequency).map(([word, frequency]) => {
    total += frequency;
    return [total, word];
  });
  const random = Math.random() * total;
  const word = space.find(([max, _]) => random < max)[1];
  document.getElementById("input").value += ` ${word}`;
}
function add() {
  const number = Number.parseInt(document.getElementById("number").value);
  try {
    for (let i = 0; i < number; i++) {
      addOne();
    }
  } catch (error) {
    if (error instanceof GenerationError) {
      alert(error.message);
    } else {
      throw error;
    }
  }
  resizeTextarea();
}
function resizeTextarea() {
  input.style.height = "auto";
  input.style.height = `${Math.max(50, input.scrollHeight + 20)}px`;
}
document.addEventListener("DOMContentLoaded", () => {
  input = document.getElementById("input");
  resizeTextarea();
  input.addEventListener("input", resizeTextarea);
  document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("input").value = "";
    if (input != null) {
      resizeTextarea();
    }
  });
  fetched
    .then((data) => data.text())
    .then((fetched) => {
      data = JSON.parse(fetched);
      const button = document.getElementById("generate");
      button.disabled = false;
      button.addEventListener("click", add);
      document.getElementById("input").addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
          event.preventDefault();
          add();
        }
      });
    });
});
