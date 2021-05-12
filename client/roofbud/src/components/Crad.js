import React, { Component } from "react";
let uri = "";
if (process.env.NODE_ENV === "production") {
	uri = process.env.PUBLIC_URL;
} else {
	uri = "http://localhost:1337";
}

export default class Crad extends Component {
	render() {
		const user = this.props.prop;
		return (
			<div>
				<div class="ui card">
					<div class="content">
						<div class="right floated meta">14h</div>
						<img
							class="ui avatar image"
							src={`${uri}/api/users/${user.userName}/avatar`}
						/>{" "}
						{this.props.prop.userName}
					</div>
					<div class="image">
						<img src={`${uri}/api/users/${user.userName}/avatar`} />
					</div>
					<div class="content">
						<span class="right floated">
							{/* <i class="heart outline like icon"></i>
							17 likes */}
						</span>
						{user.moreText}
						<br />
						גיל:{user.age}
						<br />
						מין:{user.gender ? "זכר" : "נקבה"}
					</div>
					<div class="extra content">
						<div class="ui large transparent left icon input">
							<i class="far fa-comments"></i>
							{/* !work on onchange - input */}
							<input type="text" placeholder="שלח הודעה..." />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
