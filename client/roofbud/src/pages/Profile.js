import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const Profile = () => {
	const url = "http://localhost:1337";
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [age, setAge] = useState(0);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [status, setStatus] = useState("");

	const handleProfileIn = async () => {
		const cookie = new Cookies();
		const resp = await axios
			.post(url + "/api/users", {
				userName: username,
				password: password,
				name: name,
				age: age,
				fromDate: fromDate,
				toDate: toDate,
			})
			.then((res) => {
				cookie.set("token", res.data.token, { path: "/" });
				setStatus("OK , user has been created.");
			})
			.catch((e) => {
				// console.dir(e);
				setStatus(e.response.data);
			});
	};
	return (
		<div>
			<h1>Edit Profile</h1>
			<br />
			<label htmlFor="password">Password</label>
			<br />
			<input
				onChange={(e) => setPassword(e.target.value)}
				type="password"
				name=""
				id="password"
			/>
			<br />
			<label htmlFor="password2">re-Type Password</label>
			<br />
			<input
				onChange={(e) => setPassword(e.target.value)}
				type="password"
				name=""
				id="password2"
			/>
			<br />
			<label htmlFor="name">name</label>
			<br />
			<input
				onChange={(e) => setName(e.target.value)}
				type="text"
				name=""
				id="name"
			/>
			<br />
			<label htmlFor="age">age</label>
			<br />
			<input
				onChange={(e) => setAge(e.target.value)}
				type="number"
				name=""
				id="age"
			/>
			<br />
			<label htmlFor="fromDate">from date</label>
			<br />
			<input
				onChange={(e) => setFromDate(e.target.value)}
				type="date"
				name=""
				id="fromDate"
			/>
			<br />
			<label htmlFor="toDate">to Date</label>
			<br />
			<input
				onChange={(e) => setToDate(e.target.value)}
				type="date"
				name="toDate"
				id=""
			/>
			<br />
			<button onClick={() => handleProfileIn()}>Profile In</button>
			<p>{status}</p>
		</div>
	);
};

export default Profile;