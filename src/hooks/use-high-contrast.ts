import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const useHighContrast = () => {
  const [highContrast, setHighContrast] = useLocalStorage(
    "high-contrast",
    false
  );

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("hc");
    } else {
      document.documentElement.classList.remove("hc");
    }
  }, [highContrast]);

  return { highContrast, setHighContrast };
};

export default useHighContrast;
