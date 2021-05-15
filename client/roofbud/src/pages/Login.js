import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { BrowserRouter, Route, HashRouter, Router } from "react-router-dom";
import history from "../conf/creatHistory";
// ---------------------------------------------

const Login = ({ test }) => {
	const cookie = new Cookies();
	// -----------url config-----------
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
				setStatus("שם מתשמש או ססמא שגויים");
			});
	};

	// --------------------JSX--------------
	return (
		<div className="iftach-container">
			<div className="ui  center aligned container">
				<div className="iftach-container">
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
					<button className="btnLog" onClick={() => handleLogin()}>
						התחבר
					</button>

					<br />
					<h1>{status}</h1>
				</div>
			</div>
		</div>
	);
};

export default Login;
