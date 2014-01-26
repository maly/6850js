6850js
======

ACIA 6850 JavaScript emulator

Usage
-----

(a.k.a. The API)

You can use 6850 as standard JS file, AMD or CommonJS module.

- new MC6850() - get an instance
- instance.reset() - resets the circuit
- instance.setData(byte) - write data to data register
- instance.getData() - read data from data register
- instance.getStatus() - get status byte
- instance.setControl() - set control byte
- instance.receive(byte) - emulates receiving data via serial interface
- instance.transmit(callback) - hooks an event. Callback is called when data byte is sended via serial interface. Callback has single parameter: cb(byte)

6850js emulates just basic operation (transmit, receive). Doesn't provide parity check etc. It works "at full speed", not real timing.

Tests
-----

6850js is slightly tested with qUnit - just a basic functionality at this moment

Roadmap
-------

- Interrupts doesn't work now