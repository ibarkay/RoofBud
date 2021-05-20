import { logo } from "../statics/index";
const Home = () => {
	return (
		<div className="home-container">
			<img src={logo} alt="" />
			<h1>התאמה מושלמת</h1>
			<a href="/#/sign">צור חשבון</a>
		</div>
	);
};

export default Home;
