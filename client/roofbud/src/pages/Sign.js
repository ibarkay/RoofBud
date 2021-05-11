import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import history from "../conf/creatHistory";
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}

const Sign = ({ test }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [age, setAge] = useState(0);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [status, setStatus] = useState("");
	const [moreText, setMoreText] = useState("");
	const [gender, setGender] = useState();
	const [fileToUpload, setFileToUpload] = useState({});
	// ---------------------------------------------------
	const handleSignIn = async () => {
		const cookie = new Cookies();
		const resp = await axios
			.post(uri + "/api/users", {
				userName: username,
				password: password,
				name: name,
				gender: gender,
				age: age,
				moreText: moreText,
				fromDate: fromDate,
				toDate: toDate,
			})
			.then((res) => {
				cookie.set("token", res.data.token, { path: "/" });
				setStatus("OK , user has been created.");
			})
			.catch((e) => {
				setStatus(e.response.data);
			});
		if (fileToUpload) {
			const fd = new FormData();
			fd.append("avatar", fileToUpload, fileToUpload.name);
			axios
				.post(uri + "/api/users/me/avatar", fd, {
					headers: { Authorization: cookie.get("token") },
				})
				.then((res) => {
					console.log(res);
					test();
					history.push("/match");
				})
				.catch((e) => {
					console.log(e);
				});
		}
	};

	const handleSelectFile = async (e) => {
		setFileToUpload(e.target.files[0]);
	};
	const handleUpload = () => {};
	// -------------------jsx--------------------
	return (
		<div className="fsize">
			<div className="back-bg">
				<div className="holder">
					<h1>הרשמה</h1>
					<label htmlFor="username">שם משתמש</label>

					<input
						onChange={(e) => setUsername(e.target.value)}
						type="text"
						name=""
						id="username"
					/>

					{/* <input type="file" onChange={(e) => handleSelectFile(e)} /> */}
					<label className="custom-file-upload">
						<input
							type="file"
							onChange={(e) => handleSelectFile(e)}
							name="avatar"
							id="avatar"
						/>
						העלה תמונה
					</label>

					<label htmlFor="password">ססמא</label>

					<input
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						name=""
						id="password"
					/>

					<label htmlFor="name">שם מלא</label>

					<input
						onChange={(e) => setName(e.target.value)}
						type="text"
						name=""
						id="name"
					/>

					<label htmlFor="male">זכר</label>
					<input
						onChange={(e) => setGender(e.target.value)}
						type="radio"
						name="gender"
						id="male"
						value={true}
					/>
					<label htmlFor="female">נקבה</label>
					<input
						onChange={(e) => setGender(e.target.value)}
						type="radio"
						name="gender"
						id="female"
						value={false}
					/>

					<label htmlFor="age">גיל</label>

					<input
						onChange={(e) => setAge(e.target.value)}
						type="number"
						name=""
						id="age"
					/>
					<label htmlFor="moreText">כמה מילים על עצמי</label>
					<textarea
						onChange={(e) => setMoreText(e.target.value)}
						name=""
						id=""
						cols="30"
						rows="3"
					></textarea>

					<label
						onChange={(e) => {
							setMoreText(e.target.value);
						}}
						htmlFor="fromDate"
					>
						:מתאריך
					</label>

					<input
						onChange={(e) => setFromDate(e.target.value)}
						type="date"
						name=""
						id="fromDate"
					/>

					<label htmlFor="toDate">:עד תאריך</label>

					<input
						onChange={(e) => setToDate(e.target.value)}
						type="date"
						name="toDate"
						id=""
					/>

					<button onClick={() => handleSignIn()}>צור חשבון ומצא לי שותף</button>
					<p>{status}</p>
				</div>
			</div>
		</div>
	);
};

export default Sign;
