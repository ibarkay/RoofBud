import { logo } from "../statics";
import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

import history from "../conf/creatHistory";
// ---------------------------------------------

const Login = ({ test, callForRender }) => {
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
		await axios
			.post(uri + "/api/login", {
				userName: usernameInput,
				password: passwordInput,
			})
			.then((res) => {
				cookie.set("token", res.data.token, { path: "/" });
				setStatus("i know you !, token saved, cookie has been baked");
				test();
				callForRender();
				history.push("/profile");
			})
			.catch((e) => {
				setStatus("שם מתשמש או סיסמא שגויים");
			});
	};

	// --------------------JSX--------------
	return (
		<div className="iftach-container">
			<div className="ui  center aligned container">
				<div className="match-win">
					<img className="resize-logo" src={logo} alt="logo" />
					<br />
					<label htmlFor="username">:שם משתמש</label>
					<br />
					<input
						onChange={(e) => setUsernameInput(e.target.value)}
						type="text"
						name=""
						id="username"
					/>

					<br />
					<label htmlFor="password">:סיסמא</label>
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
					<button className="space-btn wide" onClick={() => handleLogin()}>
						כניסה
					</button>

					<br />
				</div>
			</div>
			<h1>{status}</h1>
		</div>
	);
};

export default Login;
