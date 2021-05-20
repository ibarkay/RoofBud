function getTime(s) {
	let arr = s.split("");
	// const res = arr.reduce((acc, cur) => acc.charCodeAt(0) - cur.charCodeAt(0));
	arr = arr.map((letter) => letter.charCodeAt(0));

	arr = arr.sort();
	console.log(arr);
	const res = arr.reduce((a, c) => {
		if (!Math.abs(c - a) >= 26) {
			return c - a;
		} else {
			return Math.abs(c - a) - 26;
		}
	});
	console.log(res);
}

getTime("AZGB");
