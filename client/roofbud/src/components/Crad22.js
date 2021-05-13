import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
// -------------url config------------------------

let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}
// --------------cookie setup-----------------
const cookie = new Cookies();
// ------------------------------------------
const Card = ({ prop, master }) => {
	// -------------state----------------------
	const user = prop;
	const [msg, setMsg] = useState("");
	const [status, setStatus] = useState("");
	const [hidden, setHidden] = useState(false);

	// -----------functions-------------------------
	const handleSendMsg = async () => {
		await axios
			.post(
				uri + "/api/send/msg",
				{
					to: user.userName,
					from: master.userName,
					msg: msg,
				},
				{
					headers: { Authorization: cookie.get("token") },
				}
			)
			.then((res) => {
				setHidden(!hidden);
				setStatus(res.data);
			})
			.catch((e) => setStatus(e.message));
	};

	// -------------JSX------------------------
	return (
		<div>
			<div className="ui card">
				<div class="content">
					<div class="right floated meta">
						{user.userName}
						<img
							class="ui avatar image"
							src={`${uri}/api/users/${user.userName}/avatar`}
						/>
					</div>
				</div>
				<div class="image">
					<img src={`${uri}/api/users/${user.userName}/avatar`} />
				</div>
				<div class="content">
					<span class="right floated"></span>
					{user.moreText}
					<br />
					גיל:{user.age}
					<br />
					מין:{user.gender ? "זכר" : "נקבה"}
				</div>
				<div className="extra content">
					<div
						className="ui large transparent left icon input"
						className={
							hidden ? "hidden" : "ui large transparent left icon input"
						}
					>
						<i onClick={() => handleSendMsg()} class="far fa-paper-plane"></i>
						<input
							type="text"
							onChange={(e) => setMsg(e.target.value)}
							placeholder="...שלח הודעה"
						/>
						{status}
					</div>
					<div className={hidden ? "allredyMsgUser" : "hidden"}>
						<h5>הודעה נשלחה למשתמש</h5>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Card;
