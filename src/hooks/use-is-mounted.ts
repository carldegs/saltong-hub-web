import { useEffect, useState } from "react";

/**
 * Returns true if the component is mounted on the client.
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
