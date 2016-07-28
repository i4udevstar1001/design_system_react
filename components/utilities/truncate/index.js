/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function truncate ({ inputString = '', maxLength = 140, truncationChars = '...', startingLength = 0 }) {
	let outputString;

	if (inputString.length <= maxLength) {
		outputString = inputString;
	} else {
		const words = inputString.split(' ');
		let length = startingLength + truncationChars.length - 1;

		outputString = words.reduce((combined, word) => {
			length += word.length + 1;

			if (length <= maxLength) {
				combined.push(word);
			}

			return combined;
		}, []).join(' ');

		outputString += truncationChars;
	}

	return outputString;
}

function textContentArray (child) {
	const text = [];

	if (typeof child === 'string' || typeof child === 'number') {
		text.push(child);
	} else if (Array.isArray(child)) {
		text.push(child.forEach(textContentArray));
	} else if (child && child.props) {
		const { children } = child.props;
		text.push(textContentArray(children));
	}

	return text;
}

function textContent (child) {
	return textContentArray(child).join('');
}

export default truncate;
