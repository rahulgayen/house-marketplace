import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
//signInWithRedirect, getRedirectResult,
import { useNavigate, useLocation } from "react-router-dom";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
function OAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    const signInGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account",
        });
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then(async (userCredential) => {
                if (userCredential.user) {
                    const docRef = doc(db, "users", userCredential.user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                    } else {
                        const userData = {
                            name: userCredential.user.displayName,
                            email: userCredential.user.email,
                            timestamp: serverTimestamp(),
                        };
                        setDoc(doc(db, "users", userCredential.user.uid), userData);
                    }
                    navigate("/");
                }
            })
            .catch((e) => {
                toast.error("Could not authorize with Google");
            });
    };
    /* const { isLoading, authStatus } = useAuthStatus(); */
    /* useEffect(() => {
              const auth = getAuth();
              getRedirectResult(auth).then((userCredential) => {
                  if (userCredential.user) {
                      navigate("/");
                  }
              }).catch((e) => {
                  console.log("User Not Logged In")
              });
          }); */
    return (
        <div className="flex flex-col gap-2 items-center mt-4">
            <h2 className=" font-semibold">Sign {location.pathname === "/signin" ? "In" : "Up"} with</h2>
            <FcGoogle className="text-4xl shadow-xl rounded-full cursor-pointer" onClick={signInGoogle} />
        </div>
    );
}

export default OAuth;
