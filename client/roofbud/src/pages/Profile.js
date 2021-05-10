import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
// ------------------------------------
const cookie = new Cookies();
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}

const Profile = () => {
	const [user, setUser] = useState({});
	const [avatar, setAvatar] = useState("");
	const [fileToUpload, setFileToUpload] = useState();
	const [status, setStatus] = useState("");

	const handlePic = async (e) => {
		try {
			console.log(fileToUpload);
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

	// -----------------------------------
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

	// -----------------------------------
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
						<a className="header">{user.name}</a>
						<div className="meta">
							<span className="date">{user.moreText}</span>
						</div>
						<div className="description">
							גיל : {user.age}
							<br />
							{user.gender ? "זכר" : "נקבה"}
							<div className="dates">
								מתאריך : {new Date(user.fromDate).toLocaleDateString("he-IL")}
								<br />
								עד תאריך : {new Date(user.toDate).toLocaleDateString("he-IL")}
							</div>
						</div>
					</div>
					<div className="extra content">
						<a>
							<i className="user icon"></i>
							22 Friends
						</a>
					</div>
				</div>
				<h1 className="status">{status}</h1>
			</div>
		);
	}
	return <div>not logged in</div>;
};

export default Profile;
