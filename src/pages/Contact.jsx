import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
function Contact() {
    const params = useParams();
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [queryParams, setQueryParams] = useSearchParams();
    console.log(params, queryParams.get("listingName"));

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, "users", params.userRef);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setLandlord(docSnap.data());
                setIsLoading(false);
            } else {
                console.log("No such document!");
            }
        };
        getLandlord();
    }, [params.userRef]);

    const onMutate = (event) => {
        setMessage(event.target.value)
    }
    if (isLoading) {
        return <h2>Loading...</h2>;
    }
    return (
        <div className="pt-4 px-4 bg-gray-200 h-screen">
            <header>
                <h2 className=" text-2xl font-bold">Contact</h2>
            </header>
            <h2 className="mt-12 font-bold">Contact {landlord.name}</h2>

            <textarea type="text" id="message" onChange={onMutate} value={message} rows="10" className="mt-12 w-full rounded-lg focus:outline-none p-2 block" />
            <div className="mt-4 flex justify-center">
                <a href={`mailto:${landlord.email}?Subject=${queryParams.get(
                    'listingName'
                )}&body=${message}`} className="w-2/3 text-center bg-green-600 py-2 rounded-lg text-white font-bold">Send</a>
            </div>

        </div>
    );
}

export default Contact;
