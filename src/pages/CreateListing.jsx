import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
function CreateListing() {
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    });
    const { type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude } = formData;
    const navigate = useNavigate();
    const auth = getAuth();
    const isMounted = useRef(true);
    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (currentUser) => {
                if (currentUser) {
                    setFormData((prevState) => {
                        return {
                            ...prevState,
                            userRef: currentUser.uid,
                        };
                    });
                } else navigate("/login");
            });
        }
        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);
    const onMutate = (event) => {
        /* console.log(event.target.id, event.target.value); */
        let boolean = null;
        if (event.target.value == "true") boolean = true;
        if (event.target.value == "false") boolean = false;
        if (event.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: event.target.files,
            }));
        } else {
            setFormData((prevState) => {
                return {
                    ...prevState,
                    [event.target.id]: boolean ?? event.target.value,
                };
            });
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        let geolocation = {};
        let location = "";
        if (discountedPrice >= regularPrice) toast.error("Discounted Price should be lower than Regular Price");
        if (images.length > 6) toast.error("Maximum 6 images can be uploaded");
        if (geoLocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_geocode_api_key}`);
            const data = await response.json();
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
            location = data.status === "ZERO_RESULTS" ? undefined : data.results[0]?.formatted_address;
            if (location === undefined) {
                toast.error("Please enter a correct address");
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        const uploadFile = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

                const storageRef = ref(storage, "images/" + fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                            default:
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        };
        const imageUrls = await Promise.all(
            [...images].map((image) => {
                return uploadFile(image);
            })
        ).catch((error) => {
            toast.error(error);
            return;
        });
        const formDataCopy = { ...formData, geolocation, location, imageUrls, timestamp: serverTimestamp() };
        formDataCopy.location = location ?? "";
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        delete formDataCopy.images;
        !offer && delete formDataCopy.discountedPrice;
        addDoc(collection(db, "listings"), formDataCopy).then(() => {
            navigate(`/category/${type}`)
        }).catch(error => toast.error("Submit Listing error"));

    };
    return (
        <div className="bg-gray-200 pt-4 px-8 ">
            <header className="flex justify-between ">
                <h2 className="text-2xl font-bold">Create Listing</h2>
            </header>
            <main className="mt-2.5 pb-5">
                <form onSubmit={onSubmit}>
                    <label htmlFor="type" className="font-semibold">
                        Sell/Rent
                    </label>
                    <div className="flex gap-4">
                        <button
                            id="type"
                            onClick={onMutate}
                            value="rent"
                            className={type == "rent" ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            Rent
                        </button>
                        <button
                            id="type"
                            onClick={onMutate}
                            value="sell"
                            className={type == "sell" ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            Sell
                        </button>
                    </div>
                    <label htmlFor="name" className="font-semibold mt-2.5 block">
                        Name
                    </label>
                    <input type="text" id="name" onChange={onMutate} value={name} className="rounded-lg focus:outline-none p-2" />
                    <div className="flex gap-4 mt-2.5">
                        <div className="">
                            <label htmlFor="bedrooms" className="font-semibold mt-2.5">
                                Bedrooms
                            </label>
                            <input type="number" id="bedrooms" onChange={onMutate} value={bedrooms} className="w-16 ml-2 rounded-lg focus:outline-none px-2 py-0.5" />
                        </div>
                        <div className="">
                            <label htmlFor="bathrooms" className="font-semibold mt-2.5">
                                Bathrooms
                            </label>
                            <input type="number" id="bathrooms" onChange={onMutate} value={bathrooms} className="w-16 ml-2 rounded-lg focus:outline-none px-2 py-0.5" />
                        </div>
                    </div>
                    <label htmlFor="parking" className="font-semibold mt-2.5 block">
                        Parking Spot
                    </label>
                    <div className="flex gap-4 ">
                        <button
                            id="parking"
                            onClick={onMutate}
                            value={true}
                            className={parking ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            Yes
                        </button>
                        <button
                            id="parking"
                            onClick={onMutate}
                            value={false}
                            className={!parking ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            No
                        </button>
                    </div>
                    <label htmlFor="furnished" className="font-semibold mt-2.5 block">
                        Furnished
                    </label>
                    <div className="flex gap-4 ">
                        <button
                            id="furnished"
                            onClick={onMutate}
                            value={true}
                            className={furnished ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            Yes
                        </button>
                        <button
                            id="furnished"
                            onClick={onMutate}
                            value={false}
                            className={!furnished ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            No
                        </button>
                    </div>
                    <label htmlFor="address" className="font-semibold mt-2.5 block">
                        Address
                    </label>
                    <textarea type="text" id="address" onChange={onMutate} value={address} className="rounded-lg focus:outline-none p-2" />
                    {!geoLocationEnabled && (
                        <div className="flex gap-4 mt-2.5">
                            <div className="">
                                <label htmlFor="latitude" className="font-semibold mt-2.5">
                                    Latitude
                                </label>
                                <input type="text" id="latitude" onChange={onMutate} value={latitude} className="w-12 ml-2 rounded-lg focus:outline-none px-2 py-0.5" />
                            </div>
                            <div className="">
                                <label htmlFor="longitude" className="font-semibold mt-2.5">
                                    Longitude
                                </label>
                                <input type="text" id="longitude" onChange={onMutate} value={longitude} className="w-12 ml-2 rounded-lg focus:outline-none px-2 py-0.5" />
                            </div>
                        </div>
                    )}
                    <label htmlFor="offer" className="font-semibold mt-2.5 block">
                        Offer
                    </label>
                    <div className="flex gap-4 ">
                        <button
                            id="offer"
                            onClick={onMutate}
                            value={true}
                            className={offer ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            Yes
                        </button>
                        <button
                            id="offer"
                            onClick={onMutate}
                            value={false}
                            className={!offer ? "text-white bg-green-600 text-bold px-6 py-2 rounded-lg" : "bg-white text-bold px-6 py-2 rounded-lg"}
                        >
                            No
                        </button>
                    </div>
                    <label className="font-semibold mt-2.5 block">
                        {!offer ? "Regular Price" : "Discounted Price"}
                    </label>
                    <input
                        type="number"
                        id={!offer ? "regularPrice" : "discountedPrice"}
                        onChange={onMutate}
                        value={!offer ? regularPrice : discountedPrice}
                        className="rounded-lg focus:outline-none p-2 mr-2"
                    />
                    <span className="font-semibold">{type == "rent" ? "$ / Month" : "$"}</span>
                    <label htmlFor="file" className="font-semibold mt-2.5 block">
                        Images
                    </label>
                    <p className="text-sm">The first image will be the cover.(max 6)</p>
                    <input
                        type="file"
                        id="images"
                        onChange={onMutate}
                        max="6"
                        accept=".jpg,.png,.jpeg"
                        multiple="multiple"
                        required
                        className="rounded-lg bg-white file:bg-green-600 file:text-white file:py-1 file:px-2 file:rounded-lg file:outline-none focus:outline-none p-2"
                    />
                    <button type="submit" className="mt-5 rounded-lg w-full bg-green-600 text-white py-1 font-semibold">
                        Submit
                    </button>
                </form>
            </main>
        </div>
    );
}

export default CreateListing;
