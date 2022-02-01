import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { FaShareAlt } from "react-icons/fa";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
/* import 'swiper/css/navigation'; */
import "swiper/css/pagination";
/* import 'swiper/css/scrollbar'; */
function Listing() {
    const [listing, setListing] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [showShareMessage, setShowShareMessage] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setListing(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            setLoading(false);
        };
        fetchListing();
    }, [navigate, params.listingId]);
    if (isLoading) {
        return <h2>Loading...</h2>;
    }
    return (
        <div className="bg-gray-200 h-screen relative">
            <div
                className="bg-white z-10 p-2 absolute top-4 right-4 rounded-full shadow-lg"
                onClick={() => {
                    setShowShareMessage(true);
                    navigator.clipboard.writeText(window.location.href);
                    setTimeout(() => setShowShareMessage(false), 1500);
                }}
            >
                <FaShareAlt className="cursor-pointer" />
                {showShareMessage && <div className="bg-white w-max p-1 absolute top-10 right-2 rounded shadow-lg text-sm">Link Copied!</div>}
            </div>

            <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} slidesPerView={1} pagination={{ clickable: true }} scrollbar={{ draggable: true }}>
                {listing.imageUrls.map((imgurl, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div
                                style={{
                                    background: `url(${imgurl}) center no-repeat`,
                                    backgroundSize: "cover",
                                    minHeight: "225px",
                                    height: "23vw",
                                    position: "relative",
                                }}
                            ></div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <header className="pt-4 px-4 ">
                <h2 className="text-2xl font-bold">
                    {listing.name} -{" "}
                    {listing.offer
                        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.discountedPrice)
                        : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.regularPrice)}
                </h2>
            </header>
            <main className="pt-4 px-4">
                <h2 className=" font-bold">{listing.location}</h2>
                <div className="flex gap-2 mb-2">
                    <div className="bg-green-600 text-white font-semibold text-xs px-2 py-1 rounded-lg">For {listing.type == "rent" ? "Rent" : "Sale"}</div>
                    {listing.offer ? (
                        <div className="bg-black text-white font-semibold text-xs px-2 py-1 rounded-lg">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.regularPrice - listing.discountedPrice)}
                        </div>
                    ) : null}
                </div>
                <ul>
                    <li className="font-semibold text-sm">
                        {listing.bedrooms}
                        {listing.bedrooms > 1 ? " bedrooms" : " bedroom"}
                    </li>
                    <li className="font-semibold text-sm">
                        {listing.bathrooms}
                        {listing.bathrooms > 1 ? " bathrooms" : " bathroom"}
                    </li>
                    {listing.parking ? <li className="font-semibold text-sm">Parking</li> : null}
                </ul>
                <h2 className="mb-1 font-bold">Location</h2>
                <Link to={`/contact/${listing.userRef}?listingName=${listing.name}}`} className="flex justify-center">
                    {auth.currentUser?.uid == listing.userRef ? null : <button className="w-2/3 bg-green-600 py-2 rounded-lg text-white font-bold">Contact Landlord</button>}
                </Link>
            </main>
        </div>
    );
}
export default Listing;
