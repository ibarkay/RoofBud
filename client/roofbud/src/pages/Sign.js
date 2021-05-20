import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import history from "../conf/creatHistory";
import { logo } from "../statics";

// ------------uri config------------------------
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}
// ----------------------------------------
const Sign = ({ test }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [age, setAge] = useState(0);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [status, setStatus] = useState("");
	const [moreText, setMoreText] = useState("");
	const [gender, setGender] = useState();
	const [fileToUpload, setFileToUpload] = useState({});
	const year = new Date().getFullYear();
	// ---------------------------------------------------
	const handleSignIn = async () => {
		const cookie = new Cookies();
		if (fileToUpload.name) {
			await axios
				.post(uri + "/api/users", {
					userName: username,
					password: password,
					email: email,
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

			const fd = new FormData();
			fd.append("avatar", fileToUpload, fileToUpload.name);
			axios
				.post(uri + "/api/users/me/avatar", fd, {
					headers: { Authorization: cookie.get("token") },
				})
				.then((res) => {
					test();
					history.push("/match");
				})
				.catch((e) => {});
		}
		setStatus("נא בחר קובץ תמונה");
	};

	const handleSelectFile = async (e) => {
		setFileToUpload(e.target.files[0]);
	};

	const years = [];
	for (let i = year; i > year - 100; i--) {
		years.push(i);
	}

	// -------------------jsx--------------------
	return (
		<div className="fsize">
			<div className="back-bg">
				<div className="holder">
					<img className="resize-logo" src={logo} alt="logo" />
					<label htmlFor="username">שם משתמש</label>

					<input
						onChange={(e) => setUsername(e.target.value)}
						type="text"
						name=""
						id="username"
					/>
					<label htmlFor="email">כתובת דואר אלקטרוני</label>
					<input
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						name="email"
						id="email"
					/>
					<label className="custom-file-upload">
						<input
							type="file"
							accept="image/*;capture=camera"
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
					<div className="gender-block">
						<label className="gender-block" htmlFor="male">
							זכר
						</label>
						<input
							className="gender-block"
							onChange={(e) => setGender(e.target.value)}
							type="radio"
							name="gender"
							id="male"
							value={true}
						/>
						<label htmlFor="female">נקבה</label>
						<input
							className="gender-block"
							onChange={(e) => setGender(e.target.value)}
							type="radio"
							name="gender"
							id="female"
							value={false}
						/>
					</div>

					<label htmlFor="age">שנת לידה</label>
					<select
						name="cars"
						id="cars"
						onChange={(e) => setAge(year - e.target.value)}
						type="number"
					>
						<option value="volvo">{year}</option>
						{years.map((year) => {
							return (
								<option key={year} value={year}>
									{year}
								</option>
							);
						})}
					</select>
					{/* <input
						onChange={(e) => setAge(e.target.value)}
						type="number"
						name=""
						id="age"
					/> */}
					<label htmlFor="moreText">כמה מילים על עצמי</label>
					<textarea
						onChange={(e) => setMoreText(e.target.value)}
						name=""
						id=""
						cols="20"
						rows="2"
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

					<button className="space-btn" onClick={() => handleSignIn()}>
						צור חשבון ומצא לי שותף
					</button>
					<p>{status}</p>
				</div>
			</div>
		</div>
	);
};

export default Sign;
