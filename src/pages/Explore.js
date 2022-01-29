import { Link } from "react-router-dom";
import RentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import SellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
function Explore() {
    return (
        <div className="pt-4 px-8 bg-gray-200 h-screen">
            <header>
                <h2 className="text-2xl font-bold">Explore</h2>
            </header>
            <div className="mt-8 ">
                <h2 className="text-md font-bold">Categories</h2>
                <div className="flex gap-8 mt-2">
                    <div className="w-full">
                        <Link to="/category/rent" className="">
                            <img src={RentCategoryImage} alt="" className="rounded-xl object-cover w-full h-category-img min-h-category-img" />
                        </Link>
                        <h2 className="mt-2 ">Places for Rent</h2>
                    </div>
                    <div className="w-full">
                        <Link to="/category/sale" className="">
                            <img src={SellCategoryImage} alt="" className="rounded-xl object-cover w-full h-category-img min-h-category-img" />
                        </Link>
                        <h2 className="mt-2 ">Places for Sell</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Explore;
