"use strict";
export class ComplexNumber {
	/**
	 * Creates a new ComplexNumber.
	 *
	 * @param {number} real The real component of the complex number.
	 * @param {number} imag The imaginary component of the complex number.
	 */
	constructor(real, imag) {
		this.real = real;
		this.imag = imag??0;
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
		return new ComplexNumber(this.real + val, this.imag + (valImag??0));
	}
	/**
	 * Subtracts form the ComplexNumber.
	 * @param val {number} Real value to add to the ComplexNumber.
	 * @param [valImag] {number} Imaginary value to add to the ComplexNumber.
	 * @returns {ComplexNumber} The result of the subtraction.
	*/
	subtract(val, valImag) {
		return new ComplexNumber(this.real - val, this.imag - (valImag??0));
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
	 * Returns the angle of the ComplexNumber.
	 * @returns {ComplexNumber} the angle of the ComplexNumber.
	*/
	theta() {
		return new ComplexNumber(Math.atan2(this.imag, this.real));
	}
	/**
 	 * Returns the absolute value (magnitude) of the ComplexNumber.
 	 * @returns {ComplexNumber} The absolute value (magnitude) of the ComplexNumber.
 	*/
	abs() {
		return new ComplexNumber(Math.sqrt(this.real ** 2 + this.imag ** 2));
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