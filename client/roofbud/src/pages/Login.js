import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const Login = () => {
	const cookie = new Cookies();
	const uri = "http://localhost:1337";
	// ---------states----------------------
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [status, setStatus] = useState("");
	// -------functions/handlers------------

	const handleLogin = async () => {
		const resp = await axios
			.post("http://localhost:1337/api/login", {
				userName: usernameInput,
				password: passwordInput,
			})
			.then((res) => {
				cookie.set("token", res.data.token, { path: "/" });
				setStatus("i know you !, token saved, cookie has been baked");
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
			<label htmlFor="username">User-name</label>
			<br />
			<input
				onChange={(e) => setUsernameInput(e.target.value)}
				type="text"
				name=""
				id="username"
			/>

			<br />
			<label htmlFor="password">Password</label>
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
				Login
			</button>

			<button className="ui yellow button">sign-in</button>
			<br />
			<button onClick={() => handleTest()}>TestCookie</button>
			<br />
			<button onClick={() => handleLogout()}>Logout</button>
			<br />
			<h1>{status}</h1>
		</div>
	);
};

export default Login;
