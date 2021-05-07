import React, { Component } from "react";
const url = "http://localhost:1337";

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
							src={`${url}/api/users/${user.userName}/avatar`}
						/>{" "}
						{this.props.prop.userName}
					</div>
					<div class="image">
						<img src={`${url}/api/users/${user.userName}/avatar`} />
					</div>
					<div class="content">
						<span class="right floated">
							<i class="heart outline like icon"></i>
							17 likes
						</span>
						<i class="comment icon"></i>3 comments
					</div>
					<div class="extra content">
						<div class="ui large transparent left icon input">
							<i class="heart outline icon"></i>
							<input type="text" placeholder="Add Comment..." />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// /<div>{this.props.prop}</div>