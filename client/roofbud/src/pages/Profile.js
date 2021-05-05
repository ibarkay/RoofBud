import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookie = new Cookies();

const Profile = () => {
	const url = "http://localhost:1337";
	const [user, setUser] = useState({});
	useEffect(() => {
		axios
			.get(url + "/api/m3", {
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
						<img src={`${url}/api/users/${user.userName}/avatar`} alt="" />
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
							22 Friends
						</a>
					</div>
				</div>
			</div>
		);
	}
	return <h1>no User, no soup.</h1>;
};

export default Profile;
