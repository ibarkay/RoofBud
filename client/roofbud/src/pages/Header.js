import history from "../conf/creatHistory"; //!importent without it - i cant use history and hashrouter.
// ------------------------------------
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}

const Header = ({ test, isLogged }) => {
	const handleLogout = async () => {
		const data = "";
		const resp = await axios
			.post(uri + "/api/logout", data, {
				headers: { Authorization: cookie.get("token") },
			})
			.then(() => {})
			.catch((e) => {
				console.log(e);
			});
		test();
		history.push("/");
	};

	if (!isLogged) {
		return (
			<div>
				<ul className="header">
					<li>
						<a href="/#/">R00fBud</a>
					</li>
					<li>
						<a href="/#/login">כניסה</a>
					</li>
				</ul>
			</div>
		);
	} else {
		return (
			<div>
				<ul className="header">
					<li>
						<a href="/#/">Logo</a>
					</li>

					<li>
						<a href="/#/profile">אני</a>
					</li>
					<li>
						<a href="/#/match">מצא לי חבר לגג</a>
					</li>
					<li>
						<button onClick={() => handleLogout()}>התנתק</button>
					</li>
				</ul>
			</div>
		);
	}
};

export default Header;
