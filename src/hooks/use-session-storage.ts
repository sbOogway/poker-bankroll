"use client"

import { useState, useEffect } from "react";

const useSessionStorage = (name: string) => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(name);
    setValue(stored);
  }, [])

  return value
}

export default useSessionStorage