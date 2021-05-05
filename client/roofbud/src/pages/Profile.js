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

	return (
		<div>
			<img src={`${url}/api/users/${user.userName}/avatar`} alt="" />
			<h1>{user.userName}</h1>
		</div>
	);
};

export default Profile;
