import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

import Msg from "../components/msg";
// ------------------------------------
const cookie = new Cookies();
// ------------------------------------
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}
// -----------------------------------
const Profile = () => {
	const [user, setUser] = useState({});
	const [avatar, setAvatar] = useState("");
	const [fileToUpload, setFileToUpload] = useState();
	const [status, setStatus] = useState("");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [moreText, setMoreText] = useState("");
	const [edit, setEdit] = useState(true);
	// -----------------------------------------
	const handleSaveClick = async () => {
		const dataToSend = {};
		if (fromDate) {
			dataToSend["fromDate"] = fromDate;
		}
		if (toDate) {
			dataToSend["toDate"] = toDate;
		}
		if (moreText) {
			dataToSend["moreText"] = moreText;
		}

		await axios
			.patch(
				`${uri}/api/users/${user.userName}`,
				{ ...dataToSend },
				{
					headers: { Authorization: cookie.get("token") },
				}
			)
			.then((res) => {
				console.log("ok changed");
			})
			.catch((e) => {
				console.log(e.message);
			});
	};

	const handlePic = async (e) => {
		try {
			if (fileToUpload) {
				const fd = new FormData();
				fd.append("avatar", fileToUpload, fileToUpload.name);
				axios
					.post(uri + "/api/users/me/avatar", fd, {
						headers: { Authorization: cookie.get("token") },
					})
					.then((res) => {
						setStatus("");
						setAvatar(new Date());
					})
					.catch((e) => {
						console.log(e);
					});
			}
			setStatus("לא נבחרה אף תמונה");
		} catch (e) {
			setStatus(e.messages);
		}
	};

	// -----------useEffect----------------
	useEffect(async () => {
		await axios
			.get(uri + "/api/m3", {
				headers: { Authorization: cookie.get("token") },
			})
			.then((res) => {
				setUser(res.data);
			})
			.catch((e) => {});
	}, []);

	// -----------JSX-------------------
	if (user.userName) {
		return (
			<div className="holder">
				<div className="ui card">
					<div className="image">
						<label className="float-btn">
							<input
								type="file"
								onChange={(e) => setFileToUpload(e.target.files[0])}
								name="avatar"
								id="avatar"
							/>
							<i className="fas fa-user-edit"></i>
						</label>

						<img
							src={`${uri}/api/users/${user.userName}/avatar?t=${avatar}`}
							alt=""
						/>
					</div>
					<span className="float-btn upload" onClick={() => handlePic()}>
						<i className="fas fa-file-upload"></i>
					</span>
					<div className="content">
						<button
							style={{ position: "absolute", left: 10 }}
							onClick={() => setEdit(!edit)}
						>
							<i className="far fa-edit"></i>
						</button>
						<a className="header">{user.name}</a>
						<div className="meta">
							<span className="date">
								{user.moreText}
								<br />
								<input
									onChange={(e) => setMoreText(e.target.value)}
									className={edit ? "hidden" : undefined}
									type="text"
									name=""
									id=""
								/>
							</span>
						</div>
						<div className="description">
							גיל : {user.age}
							<br />
							{user.gender ? "זכר" : "נקבה"}
							<div className="dates">
								<input
									onChange={(e) => setFromDate(e.target.value)}
									className={edit ? "hidden" : undefined}
									type="date"
									name=""
									id=""
								/>
								מתאריך : {new Date(user.fromDate).toLocaleDateString("he-IL")}{" "}
								<br />
								<input
									onChange={(e) => setToDate(e.target.value)}
									className={edit ? "hidden" : undefined}
									type="date"
									name=""
									id=""
								/>
								עד תאריך : {new Date(user.toDate).toLocaleDateString("he-IL")}{" "}
								<br />
								<button
									onClick={() => handleSaveClick()}
									className={edit ? "hidden" : undefined}
								>
									שמור שינויים
								</button>
							</div>
						</div>
					</div>
					<div className="extra content">
						<a>
							<i class="fas fa-envelope-open-text"></i>
							{user.msgs.length}
							{user.msgs.map((msg) => {
								return <Msg m={msg} user={user} />;
							})}
						</a>
					</div>
				</div>
				<h1 className="status">{status}</h1>
			</div>
		);
	}
	return <div>לא מוחבר</div>;
};

export default Profile;
