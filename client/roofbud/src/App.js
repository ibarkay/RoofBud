import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login";
import Sign from "./pages/Sign";

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<Route path="/" exact component={Login} />
				<Route path="/sign" exact component={Sign} />
			</BrowserRouter>
		</div>
	);
};

export default App;
