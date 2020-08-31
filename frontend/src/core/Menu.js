import React from 'react'
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "../auth/index"


const isActive = (history, path) => {
    return (history.location.pathname === path) ? { color: '#ff9900' } : { color: "#ffffff" }
}
const Menu = ({ history }) => (
    <div >
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/")} to="/" >Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/users")} to="/users" >Users</Link>
            </li>
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, "/signin")} to="/signin"> Sign In</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, "/signup")} to="/signup" >Sign Up</Link>
                    </li>
                </>
            )}
            {isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <div className="nav-link" style={(isActive(history, "/signout"), { cursor: "pointer", color: "#ffffff" })}
                            onClick={() => signout(() => history.push('/'))}>Sign Out</div>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link">
                            <Link to={`/user/${isAuthenticated().user._id}`}
                             style={isActive(history, `/user/${isAuthenticated().user._id}`)}>
                            {`${isAuthenticated().user.name}'s profile`}
                            </Link>
                        </div>
                    </li>
                </>

            )}
        </ul>
    </div>
)

export default withRouter(Menu);