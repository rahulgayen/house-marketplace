import { useState } from "react";
import { getAuth, updateProfile, signOut } from "firebase/auth";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
function Profile() {
    const auth = getAuth();

    const navigate = useNavigate();
    const [changeDetails, setChangeDetails] = useState(false);
    const [userDetails, setUserDetails] = useState({ name: auth.currentUser.displayName, email: auth.currentUser.email });
    const { name, email } = userDetails;


    const Signout = () => {
        signOut(auth);
        navigate("/signin")
    };
    const onSubmit = async () => {
        try {
            if (auth.currentUser !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });
                const userRef = doc(db, "users", auth.currentUser.uid);

                await updateDoc(userRef, {
                    name
                });
            }
        } catch (error) { }
    };
    const onChange = (event) => {
        setUserDetails((prev) => {
            return { ...prev, [event.target.id]: event.target.value };
        });
    };
    return (
        <div className="bg-gray-200 h-screen pt-4 px-4">
            <header className="flex justify-between ">
                <h2 className="text-2xl font-bold">My Profile</h2>
                <button className="bg-green-600 py-1 px-2 text-xs text-white font-semibold rounded-lg" onClick={Signout}>
                    Logout
                </button>
            </header>
            <div className="flex justify-between mt-4">
                <h2 className="font-regular">Personal Details</h2>
                <h2
                    className="cursor-pointer font-xs font-semibold text-green-600"
                    onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prev) => !prev);
                    }}
                >
                    {changeDetails ? "done" : "change"}
                </h2>
            </div>
            <form className="mt-4 flex flex-col gap-2" onSubmit={onSubmit}>
                <input type="text" id="name" disabled={!changeDetails} className="px-4 bg-white rounded-lg focus:outline-none" value={name} onChange={onChange} />
                <input type="text" id="email" disabled={!changeDetails} className="px-4 bg-white rounded-lg focus:outline-none" value={email} onChange={onChange} />
            </form>
        </div>
    );
}

export default Profile;
