import history from "../conf/creatHistory"; //!important without it - i cant use history and hashRouter.
// ------------------------------------

import axios from "axios";
import Cookies from "universal-cookie";
// -------------------------------------
const cookie = new Cookies();
// --------uri config---------------------
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}
// --------------------------------------
const Header = ({ test, isLogged, user }) => {
	const handleLogout = async () => {
		const data = "";
		await axios
			.post(uri + "/api/logout", data, {
				headers: { Authorization: cookie.get("token") },
			})
			.then(() => {})
			.catch((e) => {
				// console.log(e);
			});
		test();
		history.push("/");
	};

	// ------------JSX---------------------
	if (!isLogged) {
		return (
			<div className="sticky">
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
			<div className="sticky">
				<ul className="header">
					<li>
						<button onClick={() => handleLogout()}>התנתק</button>
					</li>

					<li>
						<a href="/#/match">מצא לי חבר לגג</a>
					</li>
					<li>
						<a href="/#/profile">
							<img
								className="ui avatar image red-border"
								src={`${uri}/api/users/${user.userName}/avatar`}
								alt=""
							/>
							<span>
								{user.msgs.length > 0 ? (
									<span className="msg-count2">{user.msgs.length}</span>
								) : null}
							</span>
						</a>
					</li>
					<li>
						<a href="/#/">R00fBud</a>
					</li>
				</ul>
			</div>
		);
	}
};

export default Header;
