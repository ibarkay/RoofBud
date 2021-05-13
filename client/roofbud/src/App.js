import { Route, HashRouter } from "react-router-dom";
import Header from "./pages/Header";
import history from "../src/conf/creatHistory"; //!importent without it - i cant use history and hashrouter.
import axios from "axios";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";

// ------------------------------------

import Login from "./pages/Login";
import Sign from "./pages/Sign";
import Profile from "./pages/Profile";
import Match from "./pages/match";
import Home from "./pages/Home";
import "./CSS/app.css";
// -----------------------------------
const cookie = new Cookies();
// ------------------------------------
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

	// --------"prop" function--------------
	const test = () => {
		setIsLogged(!isLogged);
	};

	// !----useEff--------
	useEffect(() => {
		console.log(isLogged);
		axios
			.get(uri + "/api/m3", {
				headers: { Authorization: cookie.get("token") },
			})
			.then((res) => {
				setIsLogged(true);
			})
			.catch((e) => {
				console.log(e.message);
			});
	}, []);
	// !------------------------------
	// -----------JSX-----------------
	return (
		<HashRouter basename="/" history={history}>
			<div>
				<Header test={test} isLogged={isLogged} />
				<div className="content">
					<Route path="/login" exact component={() => <Login test={test} />} />
					<Route path="/sign" exact component={() => <Sign test={test} />} />
					<Route path="/profile" exact component={Profile} />
					<Route path="/match" exact component={Match} />
					<Route path="/" exact component={Home} />
				</div>
			</div>
		</HashRouter>
	);
};

export default App;
