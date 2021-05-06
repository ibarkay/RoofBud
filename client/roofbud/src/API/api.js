import axios from "axios";

const Api = axios.create({
	baseURL: "http://localhost:1337/api",
});

export default Api;
