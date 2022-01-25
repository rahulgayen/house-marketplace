import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log(currentUser)
                setUser(currentUser);
            } else {
                navigate("/signin");
            }
        });
    });
    return (
        <h1>{user && user.displayName}</h1>
    );
}

export default Profile;
