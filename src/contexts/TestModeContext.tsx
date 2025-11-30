import { createContext, useContext, useState, ReactNode } from 'react';

interface TestModeContextType {
  isTestMode: boolean;
  testDateOffset: number; // Days offset from today for testing
  toggleTestMode: () => void;
  setTestDateOffset: (days: number) => void;
  getTestDate: () => Date;
}

const TestModeContext = createContext<TestModeContextType | undefined>(undefined);

export function TestModeProvider({ children }: { children: ReactNode }) {
  // Load test mode from localStorage on initialization
  const [isTestMode, setIsTestMode] = useState(() => {
    const saved = localStorage.getItem('questmas_test_mode');
    return saved === 'true';
  });
  const [testDateOffset, setTestDateOffset] = useState(() => {
    const saved = localStorage.getItem('questmas_test_date_offset');
    return saved ? parseInt(saved, 10) : 0;
  });

  const toggleTestMode = () => {
    setIsTestMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('questmas_test_mode', String(newValue));
      return newValue;
    });
  };

  const handleSetTestDateOffset = (days: number) => {
    setTestDateOffset(days);
    localStorage.setItem('questmas_test_date_offset', String(days));
  };

  const getTestDate = (): Date => {
    if (!isTestMode) {
      return new Date();
    }
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + testDateOffset);
    return testDate;
  };

  return (
    <TestModeContext.Provider
      value={{
        isTestMode,
        testDateOffset,
        toggleTestMode,
        setTestDateOffset: handleSetTestDateOffset,
        getTestDate,
      }}
    >
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  const context = useContext(TestModeContext);
  if (context === undefined) {
    throw new Error('useTestMode must be used within a TestModeProvider');
  }
  return context;
}

