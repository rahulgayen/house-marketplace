import { FaBed, FaBath } from "react-icons/fa"
import { Link } from "react-router-dom"
function ListingItem({ id, listing }) {
    return (
        <div className="mt-2">
            <Link to={`/category/${listing.type}/${id}`}>
                <div className="grid grid-cols-listing gap-4">
                    <img src={listing.imageUrls[0]} alt={listing.name} className="w-full object-cover rounded-xl" />
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xs font-semibold">{listing.location}</h2>
                        <h2 className="text-lg font-bold">{listing.name}</h2>
                        <p className="text-sm text-green-600 font-bold">
                            {listing.offer
                                ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.discountedPrice)
                                : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.regularPrice)}{" "}
                            / Month
                        </p>
                        <div className="flex justify-start gap-4">
                            <FaBed className="font-bold text-sm" />
                            <p className="text-xs font-bold">{listing.bedrooms}{listing.bedrooms > 1 ? ' bedrooms' : ' bedroom'}</p>
                            <FaBath className="font-bold text-sm" />
                            <p className="text-xs font-bold">{listing.bathrooms}{listing.bathrooms > 1 ? ' bathrooms' : ' bathroom'}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ListingItem;
