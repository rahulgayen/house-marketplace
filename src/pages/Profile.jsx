import { useState } from "react";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { FaHome, FaChevronRight } from "react-icons/fa"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
function Profile() {
    const auth = getAuth();

    const navigate = useNavigate();
    const [changeDetails, setChangeDetails] = useState(false);
    const [userDetails, setUserDetails] = useState({ name: auth.currentUser.displayName, email: auth.currentUser.email });
    const { name, email } = userDetails;

    const Signout = () => {
        signOut(auth);
        navigate("/signin");
    };
    const onSubmit = async () => {
        try {
            if (auth.currentUser !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });
                const userRef = doc(db, "users", auth.currentUser.uid);

                await updateDoc(userRef, {
                    name,
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
            <main>
                <div className="flex justify-between mt-4">
                    <h2 className="font-semibold">Personal Details</h2>
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
                <form className="mt-4 flex flex-col " onSubmit={onSubmit}>
                    <input type="text" id="name" disabled={!changeDetails} className="px-4 pt-2 bg-white rounded-lg rounded-b-none focus:outline-none" value={name} onChange={onChange} />
                    <input type="text" id="email" disabled={!changeDetails} className="px-4 pb-2 bg-white rounded-lg rounded-t-none focus:outline-none" value={email} onChange={onChange} />
                </form>
                <Link to="/create-listing">
                    <div className="mt-4 w-full bg-white rounded-lg px-4 py-2 flex">
                        <FaHome className="font-bold" />
                        <p className="grow text-sm font-bold text-center">Rent or Sell you Place</p>
                        <FaChevronRight className="font-bold" />
                    </div>
                </Link>
            </main>
        </div>
    );
}

export default Profile;
