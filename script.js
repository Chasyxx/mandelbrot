import { ComplexNumber } from "./complex-number.js";

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

function getPosition(x, y) {
	const xN = x / width * 4 - 2;
	const yN = y / height * 4 - 2;
	return new ComplexNumber(xN, -yN);
}

const code = document.getElementById('FUNCTION')
const TestNumber = new ComplexNumber(0, 0)
const button = document.getElementById('BUTTON')
const errorElem = document.getElementById('error')
const others = {
	constant: (a,b) => { return new ComplexNumber(a,b) }
}
let Func = null

function setFunction(codeText) {
	const oldFunc = Func
	let params = Object.getOwnPropertyNames(Math)
	let values = params.map(k => Math[k])
	const params2 = Object.getOwnPropertyNames(others)
	const values2 = params2.map(k => others[k])
	params = params.concat(params2)
	values = values.concat(values2)
	try {
		Func = new Function(...params, 'Z,C', codeText).bind(globalThis, ...values)
		Func(TestNumber, TestNumber)
		errorElem.innerHTML = "No Error"
	} catch (err) {
		errorElem.innerText = err.message
		Func = oldFunc
	}
}

function drawPixel(x, y, IterationCount) {
	const C = getPosition(x, y);
	let Z = new ComplexNumber(C.real, C.imag); // Create a new instance for squared value
	let diverges = 0;
	for (let i = 0; i < IterationCount; i++) {
		Z = Func(Z, C);
		if(Z === undefined || /^number$|^boolean$|^function$/.test(typeof Z)) {
			errorElem.innerText="A complex number must be returned..."
			return "emergency"
		}
		if(isNaN(Z?.real??NaN)||isNaN(Z?.imag??NaN)) {
			return true
		}
		if (Z.abs().real > 4) {
			diverges = Math.floor(i * (255 / 20)) + 1;
			break;
		}
	}
	let Color = "#fff"
	if (diverges) {
		let val = Math.min(255, (diverges % 768)).toString(16)
		let val2 = Math.max(0, Math.min(255, (diverges % 768) - 256)).toString(16)
		let val3 = Math.max(0, Math.min(255, (diverges % 768) - 512)).toString(16)
		val = val.length == 1 ? "0" + val : val
		val2 = val2.length == 1 ? "0" + val2 : val2
		val3 = val3.length == 1 ? "0" + val3 : val3
		Color = `#${val}${val2}${val3}`
	}
	ctx.fillStyle = Color
	ctx.fillRect(x, y, 1, 1);
	return false
}

async function DrawFractal() {
	const IC = document.getElementById('IC').value
	const NaNCHK = document.getElementById('NC').checked
	let stop;
	let maxNaNs = 0;
	for (let x = 0; x < width; x++) {
		stop = 0
		for (let y = 0; y < height; y++) {
			let status = drawPixel(x, y, IC)
			if(status===true){
				stop++
				stop>maxNaNs?(maxNaNs=stop):0
				errorElem.innerText = "Max NaNs found in 1 column is " + maxNaNs
				if(stop>256&&NaNCHK){
					errorElem.innerText= "Too many NaNs. Halting."
					break
				}
			} else if (status==="emergency"){
				stop=257;break
			}
		}
		if(stop>256&&NaNCHK){
			break
		}
		ctx.fillStyle = "white"
		ctx.fillRect(x + 1, 0, 5, height)
		await new Promise(resolve => setTimeout(resolve, 1))
	}
}

button.onclick = () => {
	setFunction(code.value)
	if (errorElem.innerHTML == "No Error") { DrawFractal() }
}

//DrawFractal()