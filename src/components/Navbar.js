import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaCompass, FaTag, FaUser } from "react-icons/fa"

function Navbar() {
    const location = useLocation();
    console.log(location.pathname)
    return (
        <div className="absolute bottom-0 left-0 w-full bg-white py-2 grid grid-cols-3">
            <Link to="/" className="w-full flex flex-col gap-1 items-center justify-center">
                <FaCompass className={`text-xl ` + (location.pathname === '/' ? 'text-green-600' : '')} />
                <h2 className={`text-xs ` + (location.pathname === '/' ? 'text-green-600' : '')}>Explore</h2>
            </Link>
            <Link to="/offers" className="w-full flex flex-col gap-1 items-center justify-center">
                <FaTag className={`text-xl ` + (location.pathname === '/offers' ? 'text-green-600' : '')} />
                <h2 className={`text-xs ` + (location.pathname === '/offers' ? 'text-green-600' : '')}>Offer</h2>
            </Link>
            <Link to="/profile" className="w-full flex flex-col gap-1 items-center justify-center">
                <FaUser className={`text-xl ` + (location.pathname === '/profile' ? 'text-green-600' : '')} />
                <h2 className={`text-xs ` + (location.pathname === '/profile' ? 'text-green-600' : '')}>Profile</h2>
            </Link>

        </div>
    )
}

export default Navbar
