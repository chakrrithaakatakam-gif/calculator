class Calculator {
  constructor(prevDisplayElement, currDisplayElement) {
    this.prevDisplay = prevDisplayElement;
    this.currDisplay = currDisplayElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  delete() {
    if (this.shouldResetScreen) return;
    if (this.currentOperand === "0") return;

    if (this.currentOperand.length === 1) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = "";
      this.shouldResetScreen = false;
    }

    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;

    if (operation === "%") {
      this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
      return;
    }

    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  compute() {
    let result;
    const prev = parseFloat(this.previousOperand);
    const curr = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (this.operation) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "×":
        result = prev * curr;
        break;
      case "÷":
        if (curr === 0) {
          this.currentOperand = "Error";
          this.previousOperand = "";
          this.operation = undefined;
          this.shouldResetScreen = true;
          return;
        }
        result = prev / curr;
        break;
      default:
        return;
    }

    // Rounding to 8 decimal places to handle floating-point precision issues
    this.currentOperand = Math.round(result * 1e8) / 1e8;
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetScreen = true;
  }

  updateDisplay() {
    this.currDisplay.innerText = this.currentOperand;
    if (this.operation != null) {
      this.prevDisplay.innerText = `${this.previousOperand} ${this.operation}`;
    } else {
      this.prevDisplay.innerText = "";
    }
  }
}

const prevDisplay = document.getElementById("previous-operand");
const currDisplay = document.getElementById("current-operand");
const calculator = new Calculator(prevDisplay, currDisplay);

// Button click listeners
document.querySelectorAll("[data-number]").forEach((btn) => {
  btn.addEventListener("click", () => {
    calculator.appendNumber(btn.dataset.number);
    calculator.updateDisplay();
  });
});

document.querySelectorAll("[data-operator]").forEach((btn) => {
  btn.addEventListener("click", () => {
    calculator.chooseOperation(btn.dataset.operator);
    calculator.updateDisplay();
  });
});

document.querySelectorAll("[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "clear") calculator.clear();
    if (action === "delete") calculator.delete();
    if (action === "calculate") calculator.compute();
    calculator.updateDisplay();
  });
});

// Keyboard accessibility
window.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    calculator.appendNumber(e.key);
  } else if (e.key === "+" || e.key === "-") {
    calculator.chooseOperation(e.key);
  } else if (e.key === "*") {
    calculator.chooseOperation("×");
  } else if (e.key === "/") {
    e.preventDefault();
    calculator.chooseOperation("÷");
  } else if (e.key === "%") {
    calculator.chooseOperation("%");
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculator.compute();
  } else if (e.key === "Backspace") {
    calculator.delete();
  } else if (e.key === "Escape") {
    calculator.clear();
  }
  calculator.updateDisplay();
});
