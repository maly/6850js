/***********************
6850 emulation

(C) 2013 martin maly, www.retrocip.cz

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
***************/

(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('MC6850', function() {

	var RDRF = 0x01;
	var TDRE = 0x02;
	var DCD  = 0x04;
	var CTS  = 0x08;
	var FE   = 0x10;
	var OVRN = 0x20;
	var PE  = 0x40;
	var IRQ  = 0x80;

var MC6850 = MC6850 || function () {
	this.reset();
	this._hooks = {"transmit":[],"interrupt":[]};
	this.control = 0;
	this.status = TDRE;
};

MC6850.prototype.reset = function() {
	this.rxData = 0xff;
	this.txData = 0xff;
};


MC6850.prototype.hook = function(port,cb) {
	this._hooks[port].push(cb);
};
MC6850.prototype.transmit = function(cb) {
	this._hooks['transmit'].push(cb);
};

MC6850.prototype.setData = function(n) {
	this.txData = n & 0xff;
	if ((this.control & 0x10) === 0) this.txData = n & 0x7f; //7bit
	this.status &= (~TDRE&0xff);
	var hox = this._hooks.transmit;
	if (hox) {for(var i=0;i<hox.length;i++) {
		var fn = hox[i];
		fn(this.txData);
	}}

	this.status |= TDRE;
};

MC6850.prototype.getData = function() {
	var n = this.rxData;
	if ((this.control & 0x10) === 0) n &= 0x7f; //7bit
	this.status &= (~RDRF&0xff);
	this.status &= (~OVRN&0xff);
	return n;
};

MC6850.prototype.getStatus = function() {
	return this.status;
};

MC6850.prototype.setControl = function(n) {
	if ((n & 0x03) == 3) this.reset();
	this.control = n & 0xff;
};


MC6850.prototype.receive = function(n) {
	if ((this.control & 0x10) === 0) n &= 0x7f; //7bit
	if (this.status & RDRF) {
		this.status |= OVRN;
		return;
	}
	this.status |= RDRF;
	this.rxData = n;
};


return  MC6850;

}));