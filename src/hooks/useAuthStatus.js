import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
export const useAuthStatus = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isMounted = useRef(true);
  const auth = getAuth();

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setAuthStatus(true);
        }
        setIsLoading(false);
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);
  return { isLoading, authStatus };
};
