import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
const cookie = new Cookies();
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}

const Profile = () => {
	const [user, setUser] = useState({});

	useEffect(() => {
		axios
			.get(uri + "/api/m3", {
				headers: { Authorization: cookie.get("token") },
			})
			.then((res) => {
				setUser(res.data);
			})
			.catch((e) => {});
	}, []);
	if (user.userName) {
		return (
			<div>
				<div className="ui card">
					<div className="image">
						<img src={`${uri}/api/users/${user.userName}/avatar`} alt="" />
					</div>
					<div className="content">
						<a className="header">{user.userName}</a>
						<div className="meta">
							<span className="date">Joined in 2021</span>
						</div>
						<div className="description">
							{user.userName} is an art director living in New York.
						</div>
					</div>
					<div className="extra content">
						<a>
							<i className="user icon"></i>
							{/* 22 Friends */}
						</a>
					</div>
				</div>
			</div>
		);
	}
	return <div>not logged in</div>;
};

export default Profile;
