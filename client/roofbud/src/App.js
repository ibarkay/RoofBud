import { BrowserRouter, Route, HashRouter, Router } from "react-router-dom";

import Login from "./pages/Login";
import Sign from "./pages/Sign";
import Profile from "./pages/Profile";
import Match from "./pages/match";
import Home from "./pages/Home";
import "./CSS/app.css";

const App = () => {
	return (
		<HashRouter>
			<div>
				<ul className="header">
					<li>
						<a href="/#/home">Logo</a>
					</li>
					<li>
						<a href="/#/login">login</a>
					</li>
					{/* <li>
						<a href="/#/sign">sign</a>
					</li> */}
					{/* <li>
						<a href="/#/profile">profile</a>
					</li> */}
					{/* <li>
						<a href="/#/match">match</a>
					</li> */}
				</ul>
				<div className="content">
					  <Route path="/login" exact component={Login} />
					<Route path="/sign" exact component={Sign} />
					<Route path="/profile" exact component={Profile} />
					<Route path="/match" exact component={Match} />
					<Route path="/home" exact component={Home} />
				</div>
			</div>
		</HashRouter>
	);
};

// const App = () => {
// 	return (
// 		<div>
// 			<BrowserRouter>
// 				<Header />
// 				<Route path="/login" exact component={Login} />
// 				<Route path="/sign" exact component={Sign} />
// 				<Route path="/profile" exact component={Profile} />
// 				<Route path="/match" exact component={Match} />
// 			</BrowserRouter>
// 		</div>
// 	);
// };

export default App;
