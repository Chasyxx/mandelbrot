"use strict";
class ComplexNumber {
	/**
	 * Creates a new ComplexNumber.
	 *
	 * @param {number} real The real component of the complex number.
	 * @param {number} imag The imaginary component of the complex number.
	 */
	constructor(real, imag) {
		this.real = real;
		this.imag = imag !== null && imag !== void 0 ? imag : 0;
	}
	/**
	 * @returns the ComplexNumber with a flipped imaginary.
	 */
	conjugate() {
		return new ComplexNumber(this.real, -this.imag);
	}
	/**
	 * Adds two ComplexNumbers together.
	 * @param val {number} Real value to add to the ComplexNumber.
	 * @param [valImag] {number} Imaginary value to add to the ComplexNumber.
	 * @returns {ComplexNumber} The result of the addition.
	*/
	add(val, valImag) {
		return new ComplexNumber(this.real + val, this.imag + valImag);
	}
	/**
	 * Subtracts form the ComplexNumber.
	 * @param val {number} Real value to add to the ComplexNumber.
	 * @param [valImag] {number} Imaginary value to add to the ComplexNumber.
	 * @returns {ComplexNumber} The result of the subtraction.
	*/
	subtract(val, valImag) {
		return new ComplexNumber(this.real - val, this.imag - valImag);
	}
	/**
	 * Multiplies the ComplexNumber by another complex number.
	 *
	 * @param {number} val The real component to multiply.
	 * @param {number} [valImag] The imaginary component to multiply.
	 * @returns {ComplexNumber} The result of the multiplication.
	 */
	multiply(val, valImag) {
		if (valImag !== undefined) {
			const newReal = this.real * val - this.imag * valImag;
			const newImag = this.real * valImag + this.imag * val;
			return new ComplexNumber(newReal, newImag);
		}
		else {
			return new ComplexNumber(this.real * val, this.imag * val);
		}
	}
	/**
	 * Divides the ComplexNumber by another complex number.
	 *
	 * @param {number} val The real component to divide the ComplexNumber by.
	 * @param {number} [valImag] The imaginary component to divide the ComplexNumber by.
	 * @returns {ComplexNumber} The result of the division.
	 */
	divide(val, valImag) {
		if (valImag !== undefined) {
			const divisor = val * val + valImag * valImag;
			const newReal = (this.real * val + this.imag * valImag) / divisor;
			const newImag = (this.imag * val - this.real * valImag) / divisor;
			return new ComplexNumber(newReal, newImag);
		}
		else {
			return new ComplexNumber(this.real / val, this.imag / val);
		}
	}
	/**
	 * Raises the ComplexNumber to another complex number.
	 *
	 * @param {number} val The real component of the exponent.
	 * @param {number} [valImag] The imaginary component of the exponent.
	 * @returns {ComplexNumber} The result of raising the ComplexNumber to the power of another complex number.
	 */
	powerTo(val, valImag) {
		const magnitude = Math.sqrt(this.real ** 2 + this.imag ** 2);
		const angle = Math.atan2(this.imag, this.real);
		if (valImag !== undefined) {
			const lnMagnitude = Math.log(magnitude);
			const lnAngle = Math.atan2(this.imag, this.real);
			const powerMagnitude = Math.exp(lnMagnitude * val - lnAngle * valImag);
			const powerAngle = lnAngle * val + lnMagnitude * valImag;
			const real = powerMagnitude * Math.cos(powerAngle);
			const imag = powerMagnitude * Math.sin(powerAngle);
			return new ComplexNumber(real, imag);
		}
		else {
			const newMagnitude = magnitude ** val;
			const newAngle = angle * val;
			const real = newMagnitude * Math.cos(newAngle);
			const imag = newMagnitude * Math.sin(newAngle);
			return new ComplexNumber(real, imag);
		}
	}
	/**
	 * Returns the magnitude and angle of the ComplexNumber.
	 * @returns \{ magnitude, angle \}
	*/
	getValues() {
		return {
			magnitude: Math.sqrt(this.real ** 2 + this.imag ** 2),
			angle: Math.atan2(this.imag, this.real)
		};
	}
	/**
	 * Returns a string representation of the ComplexNumber.
	 *
	 * @param {boolean} [round=true] Specifies if rounding should be applied to the real and imaginary components. Useful if anything like 2.0000000000004 appears.
	 * @returns {string} The string representation of the ComplexNumber.
	 */
	asString(round = true) {
		const roundReal = Math.abs(this.real) > 1.5 && round;
		const roundImag = Math.abs(this.imag) > 1.5 && round;
		return `${roundReal ? Math.round(this.real) : this.real}${this.imag < 0 ? "-" : "+"}${roundImag ? Math.round(Math.abs(this.imag)) : Math.abs(this.imag)}i`;
	}
}

// ComplexNumberClass definition...

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

function getPosition(x, y) {
	const xN = x / width * 4 - 2;
	const yN = y / height * 4 - 2;
	return new ComplexNumber(xN-0.5, yN);
}

const code = document.getElementById('FUNCTION')
const TestNumber = new ComplexNumber(0, 0)
const button = document.getElementById('BUTTON')
const others = {
	constant: () => {return new ComplexNumber()}
}
let Func = null

function setFunction(codeText) {
	const oldFunc = Func
	let params = Object.getOwnPropertyNames(Math)
	let values = params.map(k=>Math[k])
	const params2 = Object.getOwnPropertyNames(others)
	const values2 = params2.map(k=>others[k])
	params = params.concat(params2)
	values = values.concat(values2)
	params.push('constant')
	values.push((a,b)=>{return new ComplexNumber(a,b)})
	try {
		Func = new Function(...params, 'Z,C', codeText).bind(globalThis,...values)
		Func(TestNumber, TestNumber)
		document.getElementById("error").innerHTML = "No Error"
	} catch (err) {
		document.getElementById("error").innerText = err.message
		Func = oldFunc
	}
}

function drawPixel(x, y, IterationCount) {
		const C = getPosition(x, y);
		let Z = new ComplexNumber(C.real, C.imag); // Create a new instance for squared value
	let diverges = 0;
	for (let i = 0; i < IterationCount; i++) {
		Z = Func(Z, C); // Use the squared value in the loop
		if (Z.getValues().magnitude > 2) {
			diverges = Math.floor(i*(255/20))+1;
			break;
		}
	}
	let Color = "#fff"
	if (diverges) {
		let val = (diverges&255).toString(16)
		let val2 = (diverges>>4&255).toString(16)
		let val3 = (diverges>>8&255).toString(16)
		val = val.length == 1 ? "0" + val : val
		val2 = val2.length == 1 ? "0" + val2 : val2
		val3 = val3.length == 1 ? "0" + val3 : val3
		Color = `#${val}${val2}${val3}`
	}
	ctx.fillStyle = Color
	ctx.fillRect(x, y, 1, 1);
}

async function DrawFractal() {
	const IC = document.getElementById('IC').value
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			drawPixel(x, y, IC);
		}
		ctx.fillStyle = "white"
		ctx.fillRect(x + 1, 0, 5, height)
		await new Promise(resolve => setTimeout(resolve, 1))
	}
}

button.onclick = () => {
	setFunction(code.value)
	if (document.getElementById("error").innerHTML == "No Error") { DrawFractal() }
}

//DrawFractal()