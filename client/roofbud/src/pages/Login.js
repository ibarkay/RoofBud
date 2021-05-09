import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { BrowserRouter, Route, HashRouter, Router } from "react-router-dom";
import history from "../conf/creatHistory";

const Login = ({ test }) => {
	const cookie = new Cookies();
	let uri = "";
	if (process.env.NODE_ENV === "production") {
		uri = process.env.PUBLIC_URL;
	} else {
		uri = "http://localhost:1337";
	}

	// ---------states----------------------
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [status, setStatus] = useState("");
	// -------functions/handlers------------

	const handleLogin = async () => {
		const resp = await axios
			.post(uri + "/api/login", {
				userName: usernameInput,
				password: passwordInput,
			})
			.then((res) => {
				cookie.set("token", res.data.token, { path: "/" });
				setStatus("i know you !, token saved, cookie has been baked");
				test();
				history.push("/profile");
			})
			.catch((e) => {
				setStatus("no soup for you!");
			});
	};

	const handleTest = async () => {
		const resp = await axios
			.get(uri + "/api/users", {
				headers: { Authorization: cookie.get("token") },
			})
			.then(() => {
				setStatus("cookie is valid!");
			})
			.catch((e) => {
				setStatus(e.message);
			});
	};

	const handleLogout = async () => {
		const data = "";
		const resp = await axios
			.post(uri + "/api/logout", data, {
				headers: { Authorization: cookie.get("token") },
			})
			.then(() => {
				setStatus("logged out, token has been deleted.");
			})
			.catch((e) => {
				setStatus(e.message);
			});
	};

	// --------------------JSX--------------
	return (
		<div className="ui  center aligned container">
			<label htmlFor="username">:שם משתמש</label>
			<br />
			<input
				onChange={(e) => setUsernameInput(e.target.value)}
				type="text"
				name=""
				id="username"
			/>

			<br />
			<label htmlFor="password">:ססמא</label>
			<br />
			<input
				onChange={(e) => {
					setPasswordInput(e.target.value);
				}}
				type="password"
				name=""
				id="password"
			/>
			<br />
			<button className="ui pink button" onClick={() => handleLogin()}>
				התחבר
			</button>

			<br />
			{/* <button onClick={() => handleTest()}>TestCookie</button> */}
			<br />

			<br />
			<h1>{status}</h1>
		</div>
	);
};

export default Login;
