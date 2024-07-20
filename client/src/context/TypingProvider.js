import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

// Create TypingContext for global state management
const TypingContext = createContext();

// Custom hook to use the TypingContext
export const useTypingContext = () => useContext(TypingContext);

// Provider component to wrap the app and provide global state
export const TypingProvider = ({ children }) => {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalPauseTimeRef = useRef(0);
  const pauseStartRef = useRef(null);
  const intervalRef = useRef(null);

  // Function to start the timer
  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!isPaused && !isCompleted) {
          const timeElapsed =
            (Date.now() - startTime - totalPauseTimeRef.current) / 1000;
          setElapsedTime(timeElapsed > 0 ? timeElapsed : 0);
        }
      }, 100);
    }
  };

  // Function to stop the timer
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  // Start timer when startTime changes and no interval is running
  useEffect(() => {
    if (startTime && !intervalRef.current) {
      startTimer();
    }
    return () => stopTimer();
  }, [startTime, isPaused, isCompleted]);

  return (
    <TypingContext.Provider
      value={{
        typedText,
        setTypedText,
        startTime,
        setStartTime,
        mistakes,
        setMistakes,
        isPaused,
        setIsPaused,
        elapsedTime,
        setElapsedTime,
        isCompleted,
        setIsCompleted,
        totalPauseTimeRef,
        pauseStartRef,
        startTimer,
        stopTimer,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};
