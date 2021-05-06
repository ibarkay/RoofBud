import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const url = "http://localhost:1337";

const Match = () => {
	const [user, setUser] = useState();
	const [fromDate, setFromDate] = useState();
	const [toDate, setToDate] = useState();
	const [matches, setMatches] = useState([]);

	// -----------------------------------
	const cookie = new Cookies();
	// -----------------------------------

	const handleMatch = async () => {
		const resp = await axios.post(
			url + "/api/users/date",
			{ toDate: toDate, fromDate: fromDate },
			{
				headers: { Authorization: cookie.get("token") },
			}
		);
		console.log(resp.data);
		setMatches(resp.data);
	};
	// ------------------------------------------
	useEffect(() => {
		axios
			.get(url + "/api/m3", {
				headers: { Authorization: cookie.get("token") },
			})
			.then((res) => {
				setUser(res.data);
			})
			.catch((e) => {});
	}, []);
	// ----------------------------------------

	return (
		<div>
			<h1>hi {user ? user.userName : null}</h1>
			<br />
			<input
				onChange={(e) => setFromDate(e.target.value)}
				type="date"
				name="fromDate"
				id="fromDate"
			/>
			<br />
			<input
				onChange={(e) => setToDate(e.target.value)}
				type="date"
				name="toDate"
				id="toDate"
			/>
			<br />
			<button onClick={() => handleMatch()}>match</button>
			{matches.length > 0
				? matches.map((m) => {
						return <h1>{m.userName}</h1>;
				  })
				: null}
		</div>
	);
};

export default Match;
