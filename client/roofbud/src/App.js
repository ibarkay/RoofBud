import { BrowserRouter, Route } from "react-router-dom";

import Header from "./pages/Header";
import Login from "./pages/Login";
import Sign from "./pages/Sign";
import Profile from "./pages/Profile";

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<Header />
				<Route path="/login" exact component={Login} />
				<Route path="/sign" exact component={Sign} />
				<Route path="/profile" exact component={Profile} />
			</BrowserRouter>
		</div>
	);
};

export default App;
