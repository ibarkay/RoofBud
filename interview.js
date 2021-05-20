n = 9;
ar = [10, 20, 20, 10, 10, 30, 50, 10, 20];
const obj = {};

function sockMerchant(n, ar) {
  const obj = {};
	const sorty = [...ar.sort()];
	for (let i of sorty) {
		if (!Object.keys(obj).includes(i.toString())) {
			obj[i] = 0;
		}
		obj[i] += 1;
	}
	let res = 0;
	for (let i of Object.keys(obj)) {
		res += Math.floor(obj[i] / 2);
	}
	return res;
}

sockMerchant(n, ar);
