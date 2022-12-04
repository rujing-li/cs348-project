import './Login.scss';
import { Link } from "react-router-dom";
const Login = () => {
    return (
        <div className="authorize">
            <h1>Login</h1>
            <form>
                <input required type="text" placeholder="username" />
                <input required type="password" placeholder="password" />
                <button>
                    Login
                </button>
                <span>
                    Don't have an account? <Link to="/register" >Register</Link> here!
                </span>
            </form>
        </div>
    );
}

export default Login;