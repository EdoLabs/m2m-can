/*!
 * can util apps
 * Copyright(c) 2017 Ed Alegrid
 * MIT Licensed
 *
 */

'use strict';

const can = require('m2m-can');
const r = require('array-gpio');

/* i2c library for capturing temperature data using the MCP9808 chip */
let i2c =  require('./node_modules/array-gpio/examples/i2c9808.js');

/* for status indicator using led */
let output = r.out(33, 35, 36, 37, 38, 40); 

let temp = null;
let current_temp = null;

/* temperature device id */ 
let deviceID = '025';

can.open('can0', 500000, 1000, function(err, result){
    if(err) return console.error('can open err', err);

    // broadcast temperature data to CAN bus using a specified interval 
    setInterval(() => {
	
        temp = i2c.getTemp();
        
        console.log('temp', temp);
        console.log('current_temp', current_temp);
        
        if(current_temp !== temp){
            console.log('temp', temp);

            let pl = deviceID + '#' + temp;

            can.send('can0', pl, (err) => {
                if(err) return console.error('can send payload error', err);
                console.log('** temp has changed, sending can data');

                current_temp = temp;

                // blink led pin 38  
                output[5].on();
                output[5].off(300);
            });
        }

        can.read('can0', '-e', (err, frame) => {
            if(err) return console.error('can send payload error', err);
            console.log('read frame', frame);
        });
    }, 1000);
});