import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookie = new Cookies();

// -----------uri config------------------
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}
const Msg = ({ m, user }) => {
	const [msg, setMsg] = useState("");
	const [status, setStatus] = useState("");
	const [hidden, setHidden] = useState(false);
	// ----------functions-------------
	const handleDelete = async () => {
		await axios.delete(`${uri}/api/delete/msg/${m._id}`, {
			headers: { Authorization: cookie.get("token") },
		});
	};
	const handleSendMsg = async () => {
		await axios
			.post(
				uri + "/api/send/msg",
				{
					to: m.from,
					from: user.userName,
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
	// -------------JSX-------------
	return (
		<div>
			<h4 class="ui horizontal divider header">-</h4>
			<p style={{ display: "inline" }}>{m.from}</p>
			<img src={`${uri}/api/users/${m.from}/avatar`} width="30" alt="" />
			<h4>{m.msg}</h4>
			<button onClick={() => handleDelete()}>מחק</button>
			<div className="extra content">
				<div
					className="ui large transparent left icon input"
					className={hidden ? "hidden" : "ui large transparent left icon input"}
				>
					<i onClick={() => handleSendMsg()} class="far fa-paper-plane"></i>
					{/* !work on onchange - input */}
					<input
						type="text"
						onChange={(e) => setMsg(e.target.value)}
						placeholder="שלח הודעה..."
					/>
					{status}
				</div>
				<div className={hidden ? "allredyMsgUser" : "hidden"}>
					<h5>הודעה נשלחה למשתמש</h5>
				</div>
			</div>
		</div>
	);
};

export default Msg;
