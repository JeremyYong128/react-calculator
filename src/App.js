import { useReducer } from 'react';
import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
}

const CLICKS = {
  CLEAR: "clear",
  DIGIT: "digit",
  EQUALS: "equals",
  OPERATION: "operation"
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.prevClick === CLICKS.EQUALS) {
        return {
          currentOperand: `${payload.digit}`
        }
      }
    
      if (payload.digit === "0" && state.currentOperand === "0") {
        return {
          ...state,
          prevClick: CLICKS.DIGIT
        }
      }
      
      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return {
          ...state,
          prevClick: CLICKS.DIGIT
        }
      }
      
      if ((payload.digit === "1" || payload.digit === "2" || payload.digit === "3"
          || payload.digit === "4" || payload.digit === "5" || payload.digit === "6"
          || payload.digit === "7" || payload.digit === "8" || payload.digit === "9")
          && state.currentOperand === "0") {
        return {
          ...state,
          currentOperand: `${payload.digit}`,
          prevClick: CLICKS.DIGIT
        }
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        prevClick: CLICKS.DIGIT
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (!state.previousOperand) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: "0",
          prevClick: CLICKS.OPERATION
        }
      }

      if (state.prevClick === CLICKS.OPERATION) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: "0",
        operation: payload.operation,
        prevClick: CLICKS.OPERATION
      }
    
    case ACTIONS.CLEAR:
      return {
        currentOperand: "0",
        prevClick: CLICKS.CLEAR
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.prevClick === CLICKS.EQUALS) {
        return {
          currentOperand: "0"
        }
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: "0"
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }


    case ACTIONS.EVALUATE:
      if (!state.currentOperand || !state.previousOperand || !state.operation) {
        return state
      }

      return {
        currentOperand: evaluate(state),
        prevClick: CLICKS.EQUALS
      }

    default:
      return state
  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  
  if (isNaN(prev) || isNaN(curr)) {
    return "";
  }

  switch (operation) {
    case "+":
      return (prev + curr).toString()
    case "-":
      return (prev - curr).toString()
    case "*":
      return (prev * curr).toString()
    case "÷":
      return (prev / curr).toString()
    default:
      return ""
  }
}

const INT_FORMATTER = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0 })

function formatOperand(operand) {
  if (!operand) {
    return
  }
  
  const [integer, decimal] = operand.split(".")
  
  if (!decimal) {
    return INT_FORMATTER.format(integer)
  }

  return `${INT_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation, prevClick }, dispatch] = useReducer(reducer, {currentOperand: "0"})
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div> 
  );
}

export default App;
