import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div style={{ display: "flex", justifyContent: "space-around" }}>
			<Link to="/">Home Page</Link>
			<Link to="/sign">Sign-in</Link>
			<Link to="/profile">Profile</Link>
			<Link to="/login/">Login</Link>
			<Link to="/logout/">Logout</Link>
		</div>
	);
};

export default Header;
