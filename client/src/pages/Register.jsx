import { Link } from "react-router-dom";
import "./Login.scss";

const Register = () => {
    return (
        <div className="authorize">
            <h1>Register for Your RideShare</h1>
            <form>
                <input required type="text" placeholder="legal name" />
                <input required type="text" placeholder="username" />
                <input required type="password" placeholder="password" />
                <input required type="password" placeholder="confirm password" />
                <input type="tel" placeholder="phone number: (+01)" />
                <button>
                    Create Account
                    {/* link to login page, at the same time add the registered account into database */}
                </button>
                <span>
                    Already have an account? <Link to="/login" >Login</Link> here!
                </span>
            </form>
        </div>
    )
}

export default Register;