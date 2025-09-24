"use client"

import { createContext, useContext, useState, ReactNode } from "react";

type ValueContextType = {
  value: string;
  setValue: (v: string) => void;
};

const ValueContext = createContext<ValueContextType | undefined>(undefined);

export const ValueProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState("");
  return (
    <ValueContext.Provider value={{ value, setValue }}>
      {children}
    </ValueContext.Provider>
  );
};

export const useValue = () => {
  const ctx = useContext(ValueContext);
  if (!ctx) throw new Error("useValue must be used within ValueProvider");
  return ctx;
};
