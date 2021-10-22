import { Route, HashRouter } from "react-router-dom";
import Header from "./pages/Header";
import history from "../src/conf/creatHistory"; //!importent without it - i cant use history and hashrouter.
import axios from "axios";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";

// ----------pages import-------------------

import Login from "./pages/Login";
import Sign from "./pages/Sign";
import Profile from "./pages/Profile";
import Match from "./pages/match";
import Home from "./pages/Home";
// ----------CSS-------------------
import "./CSS/app.css";
// ---------------Cookie init--------------------
const cookie = new Cookies();
// ------------url conf-------------------
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}
// ---------------------------------

const App = () => {
	// ---------state---------------
	const [isLogged, setIsLogged] = useState(false);
	const [user, setUser] = useState({ userName: "no", msgs: [] });
	const [render, setRender] = useState(1);

	// --------"prop" function--------------
	const test = () => {
		setIsLogged(!isLogged);
	};
	const callForRender = () => {
		setRender(render + 1);
	};

	// !----useEff--------
	useEffect(() => {
		axios
			.get(uri + "/api/m3", {
				headers: { Authorization: cookie.get("token") },
			})
			.then((res) => {
				setIsLogged(true);
				setUser(res.data);
			})
			.catch((e) => {
				// console.log(e.message);
			});
	}, [render]);
	// !------------------------------
	// -----------JSX-----------------
	return (
		<HashRouter basename="/" history={history}>
			<div>
				<Header
					test={test}
					isLogged={isLogged}
					user={user}
					callForRender={callForRender}
				/>
				<div className="content">
					<Route
						path="/login"
						exact
						component={() => (
							<Login test={test} callForRender={callForRender} />
						)}
					/>
					<Route path="/sign" exact component={() => <Sign test={test} />} />
					<Route
						path="/profile"
						exact
						component={() => <Profile callForRender={callForRender} />}
					/>
					<Route path="/match" exact component={Match} />
					<Route path="/" exact component={Home} />
				</div>
			</div>
		</HashRouter>
	);
};

export default App;
