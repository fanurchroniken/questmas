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
  const [isTestMode, setIsTestMode] = useState(false);
  const [testDateOffset, setTestDateOffset] = useState(0);

  const toggleTestMode = () => {
    setIsTestMode((prev) => !prev);
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
        setTestDateOffset,
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

