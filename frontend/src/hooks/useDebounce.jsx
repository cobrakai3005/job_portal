import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function useDebounce(val, delay = 400) {
  const [debVal, setDebVal] = useState(val);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebVal(val);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [val, delay]);
  return debVal;
}
