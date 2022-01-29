import { FaUser, FaLock, FaEye, FaChevronRight, FaIdCardAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import OAuth from "../components/OAuth";
function SignIn() {
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const { name, email, password } = formData;
    const onChange = (event) => {
        setFormData((prev) => {
            return { ...prev, [event.target.id]: event.target.value };
        });
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            updateProfile(auth.currentUser, {
                displayName: name,
            });
            const formDataCopy = { ...formData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            setDoc(doc(db, "users", user.uid), formDataCopy);
            setFormData({ name: "", email: "", password: "" });
            navigate("/signin");
        } catch (error) {
            toast.error("Sign Up Error", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
        }
    };
    return (
        <div className="pt-4 px-4 bg-gray-200 h-screen">
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
                <div className="bg-white rounded-lg h-8 relative px-8">
                    <FaIdCardAlt className="text-sm absolute left-2 top-1/2 -translate-y-1/2" />
                    <input type="text" className="w-full h-full rounded-lg focus:outline-none" id="name" placeholder="Name" value={name} onChange={onChange} />
                </div>
                <div className="bg-white rounded-lg h-8 relative px-8">
                    <FaUser className="text-sm absolute left-2 top-1/2 -translate-y-1/2" />
                    <input type="email" className="w-full h-full rounded-lg focus:outline-none" id="email" placeholder="Email" value={email} onChange={onChange} />
                </div>
                <div className="bg-white rounded-lg h-8 relative px-8">
                    <FaLock className="text-sm absolute left-2 top-1/2 -translate-y-1/2" />
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="w-full h-full rounded-lg focus:outline-none"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={onChange}
                    />
                    <FaEye
                        className="cursor-pointer text-sm absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => {
                            setIsPasswordVisible((prev) => !prev);
                        }}
                    />
                </div>
                {/* <Link to="/forgot-password" className="text-green-600 font-bold place-self-end">
                    Forgot Password
                </Link> */}
                <div className="flex justify-between">
                    <h2 className="text-lg font-bold">Sign Up</h2>
                    <button className="h-8 w-8 rounded-full text-white bg-green-600 flex justify-center items-center">
                        <FaChevronRight className="font-light text-sm" />
                    </button>
                </div>
            </form>
            <OAuth />
            <div className="flex justify-center mt-8">
                <Link to="/signin" className="mx-auto text-green-600 font-bold text-xs place-self-end">
                    Sign In instead
                </Link>
            </div>
        </div>
    );
}

export default SignIn;
