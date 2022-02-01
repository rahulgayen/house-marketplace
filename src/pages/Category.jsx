import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, limit, startAfter, limitToLast } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
function Category() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, "listings");
                const q = query(listingsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(10));
                const querySnapshot = await getDocs(q);
                const listings = [];

                querySnapshot.forEach((doc) => {
                    listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                /* console.log(listings); */
                setListings(listings);
                setLoading(false);
            } catch (error) {
                console.log(error);
                toast.error("Could not fetch listings");
            }
        };
        fetchListings();
    }, []);
    return (
        <div className="pt-4 px-4 bg-gray-200 h-screen">
            <header>
                <h2 className="text-2xl font-bold">Places for {params.categoryName}</h2>
            </header>
            {loading ? (
                <h2>Loading...</h2>
            ) : listings && listings.length > 0 ? (
                <main className="mt-8">
                    <ul>
                        {listings.map((item) => {
                            return <ListingItem id={item.id} listing={item.data} key={item.id} />;
                        })}
                    </ul>
                </main>
            ) : (
                <h2 className="mt-8 text-md font-bold">No Listing for {params.categoryName}</h2>
            )}
        </div>
    );
}

export default Category;
