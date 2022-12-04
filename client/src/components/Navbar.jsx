import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container">
                <div className="logo">
                    RideShare
                </div>
                <div className="links">
                    Links
                    <Link className="logout" to="/login" >Logout</Link>
                </div>
            </div>
            
        </div>
    )
}

export default Navbar;