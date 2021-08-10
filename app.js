// "use strict";

// CALCULATION CONTROLLER
const CalcCtrl = (function () {
  // Equation buffer variable
  let equation = "0";

  // Becomes true when equation was just calculated
  let result = false;

  return {
    getEquation: () => {
      return equation;
    },
    getResult: () => {
      return result;
    },
    addToEquation: (value) => {
      result = false;
      if (equation === "0") {
        equation = value;
      } else {
        equation += value;
      }
    },
    evaluateEquation: () => {
      let calculatedEquation;
      const lastChar = equation.substr(equation.length - 1);
      if (lastChar === "/") {
        calculatedEquation = 1;
      } else if (lastChar === "*") {
        calculatedEquation = Math.pow(
          equation.substr(0, equation.length - 1),
          2
        );
      } else if (lastChar === "+") {
        calculatedEquation = equation.substr(0, equation.length - 1) * 2;
      } else if (lastChar === "-") {
        calculatedEquation = 0;
      } else {
        calculatedEquation = eval(equation);
      }
      equation = JSON.stringify(calculatedEquation);
      result = true;
      return equation;
    },
    addOperator: (operator) => {
      result = false;
      const lastChar = equation.substr(equation.length - 1);
      if (["/", "+", "-", "*"].includes(lastChar)) {
        equation = equation.substr(0, equation.length - 1);
        equation += operator;
      } else {
        equation += operator;
      }
    },
    equationIsIncomplete: () => {
      const lastChar = equation.substr(equation.length - 1);
      if (["/", "+", "-", "*"].includes(lastChar)) {
        return true;
      }
      return false;
    },
    resetAll: () => {
      equation = "0";
      result = false;
    },
    equationIsComplete: () => {
      let result = false;

      const lastChar = equation.substr(equation.length - 1);
      const operatorsArray = ["/", "+", "-", "*"];

      if (!operatorsArray.includes(lastChar)) {
        operatorsArray.forEach((operator) => {
          if (equation.includes(operator)) {
            result = true;
          }
        });
      }
      return result;
    },
    resetLastInput: (input) => {
      const lastChar = equation.substr(equation.length - 1);
      if (["/", "+", "-", "*"].includes(lastChar)) {
        equation = "0";
        result = false;
      } else {
        equation = equation.substr(0, equation.length - input.length);
        result = false;
      }
    },
    removeLastInput: () => {
      if (equation.length > 1) {
        equation = equation.substr(0, equation.length - 1);
        console.log(equation);
      } else {
        equation = "0";
      }
    },
  };
})();

// USER INTERFACE CONTROLLER
const UICtrl = (function (CalcCtrl) {
  // Variables for UI button selectors
  const UISelectors = {
    header: "#header",
    result: "#result",
    resultNumber: "#result-number",
    clearAllOperator: "#clear-all-operator",
    clearEntryOperator: "#clear-entry-operator",
    backspaceOperator: "#backspace-operator",
    multiplyOperator: "#multiply-operator",
    divideOperator: "#divide-operator",
    subtractOperator: "#subtract-operator",
    addOperator: "#add-operator",
    submitButton: "#submit-button",
    numbers: ".number",
    comma: "#comma",
  };

  const undarkenButtonsInternal = () => {
    document
      .querySelector(UISelectors.multiplyOperator)
      .classList.remove("darkened");
    document
      .querySelector(UISelectors.subtractOperator)
      .classList.remove("darkened");
    document
      .querySelector(UISelectors.divideOperator)
      .classList.remove("darkened");
    document
      .querySelector(UISelectors.addOperator)
      .classList.remove("darkened");
  };

  return {
    getSelectors: () => {
      return UISelectors;
    },
    displayNumber: (value) => {
      const field = document.querySelector(UISelectors.resultNumber);

      if (field.textContent === "0") {
        field.textContent = value;
        CalcCtrl.addToEquation(value);
      } else {
        field.textContent += value;
        CalcCtrl.addToEquation(value);
      }
    },
    displayComma: (value) => {
      const field = document.querySelector(UISelectors.resultNumber);
      if (!field.textContent.includes(value)) {
        field.textContent += value;
        CalcCtrl.addToEquation(value);
      }
    },
    darkenButton: (buttonId) => {
      undarkenButtonsInternal();
      document.querySelector(buttonId).classList.add("darkened");
    },
    undarkenButtons: () => {
      document
        .querySelector(UISelectors.multiplyOperator)
        .classList.remove("darkened");
      document
        .querySelector(UISelectors.subtractOperator)
        .classList.remove("darkened");
      document
        .querySelector(UISelectors.divideOperator)
        .classList.remove("darkened");
      document
        .querySelector(UISelectors.addOperator)
        .classList.remove("darkened");
    },
    clearField: () => {
      document.querySelector(UISelectors.resultNumber).textContent = "0";
    },
    displayResult: () => {
      document.querySelector(UISelectors.resultNumber).textContent =
        CalcCtrl.getEquation();
    },
    removeLastInput: () => {
      if (
        !["/", "+", "-", "*"].includes(
          CalcCtrl.getEquation().substr(CalcCtrl.getEquation().length - 1)
        )
      ) {
        const resultField = document.querySelector(UISelectors.resultNumber);
        if (
          resultField.textContent !== "0" &&
          resultField.textContent.length > 1
        ) {
          console.log("More than one and not 0");
          let number = resultField.textContent;
          resultField.textContent = number.substr(0, number.length - 1);
        } else if (resultField.textContent.length === 1) {
          console.log("Exactly one");
          resultField.textContent = "0";
        }
      } else {
        undarkenButtonsInternal();
      }
    },
  };
})(CalcCtrl);

// APPLICATION CONTROLLER
const AppCtrl = (function (UICtrl, CalcCtrl) {
  // Get selectors
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = () => {
    document.querySelectorAll(UISelectors.numbers).forEach((number) => {
      addEventListener("click", numberClick);
    });

    document
      .querySelector(UISelectors.comma)
      .addEventListener("click", commaClick);

    document
      .querySelector(UISelectors.multiplyOperator)
      .addEventListener("click", operatorClick);

    document
      .querySelector(UISelectors.divideOperator)
      .addEventListener("click", operatorClick);

    document
      .querySelector(UISelectors.addOperator)
      .addEventListener("click", operatorClick);

    document
      .querySelector(UISelectors.subtractOperator)
      .addEventListener("click", operatorClick);

    document
      .querySelector(UISelectors.submitButton)
      .addEventListener("click", submitClick);

    document
      .querySelector(UISelectors.clearAllOperator)
      .addEventListener("click", clearAllClick);

    document
      .querySelector(UISelectors.clearEntryOperator)
      .addEventListener("click", clearEntryClick);

    document
      .querySelector(UISelectors.backspaceOperator)
      .addEventListener("click", backspaceClick);
  };

  // Number click handler
  const numberClick = (e) => {
    if (e.target.classList.contains("number")) {
      if (CalcCtrl.equationIsIncomplete()) {
        UICtrl.clearField();
      }

      if (CalcCtrl.getResult() === true) {
        console.log("BOOM");
        CalcCtrl.resetAll();
        UICtrl.clearField();
      }
      const value = e.target.textContent || e.target.innerText;

      UICtrl.undarkenButtons();
      UICtrl.displayNumber(value);
    }

    e.preventDefault();
  };

  // Comma click handler
  const commaClick = (e) => {
    const value = e.target.textContent;

    UICtrl.undarkenButtons();
    UICtrl.displayComma(".");

    e.preventDefault();
  };

  // Operator click handler
  const operatorClick = (e) => {
    if (CalcCtrl.equationIsComplete() === true) {
      const result = CalcCtrl.evaluateEquation();
      UICtrl.displayResult();
      console.log(result);
    }

    let value = e.target.textContent || e.target.innerText;

    if (value === "X") {
      value = "*";
    } else if (value === "%") {
      value = "/";
    }
    buttonId = `#${e.target.id}`;

    UICtrl.darkenButton(buttonId);
    CalcCtrl.addOperator(value);

    e.preventDefault();
  };

  // Submit click handler
  const submitClick = (e) => {
    const result = CalcCtrl.evaluateEquation();
    UICtrl.displayResult();
    console.log(result);

    e.preventDefault();
  };

  // Clear all click handler
  const clearAllClick = (e) => {
    CalcCtrl.resetAll();
    UICtrl.clearField();

    e.preventDefault();
  };

  // Clear entry click handler
  const clearEntryClick = (e) => {
    const input = document.querySelector(UISelectors.resultNumber).textContent;
    CalcCtrl.resetLastInput(input);
    UICtrl.clearField();

    e.preventDefault();
  };

  // Backspace click handler
  const backspaceClick = (e) => {
    UICtrl.removeLastInput();
    CalcCtrl.removeLastInput();
    e.preventDefault();
  };

  return {
    init: () => {
      // Load event listeners
      loadEventListeners();
    },
  };
})(UICtrl, CalcCtrl);

// INITIALIZE APP
AppCtrl.init();
