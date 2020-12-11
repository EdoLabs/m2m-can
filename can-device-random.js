 *
 */

'use strict';

const can = require('m2m-can');
const r = require('array-gpio');

/* for status indicator using led */
let output = r.out(33, 35, 36, 37, 38, 40); 

let random = null;
let current_random = null;

/* random device frame id */
let deviceID = '035';

// This can device will only generate and send random data
// Initialize SocketCAN and set the bitrate and txquelen
can.open('can0', 500000, 1000, function(err, result){
  if(err) return console.log('can open error', err.message);

    output[0].on();
    output[1].on();
 
    // broadcast random data to CAN bus at a specified interval 
    setInterval(() => {
	// temp = i2c.getTemp();
	random = Math.floor(( Math.random() * 90) + 5);

	console.log('random', random);
	console.log('current_random', current_random);

	if(!random){
	  current_random = random; 
	}

	// send only if random data has changed
	if(random !== current_random){
	  console.log('random', random);

	  // set payload using '035#' as random device frame id
          let pl = deviceID + '#' + random;

          // broadcast random data to CAN bus in the CAN bus
          // all can devices in the CAN bus will receive this random data 
          // if they need this data they can capture it by reading its value using the '035' as device id or address

	  can.send('can0', pl, (err) => {
	    if(err) return console.error('can send error', err);
	    console.log('** random data has changed, sending can data');
	    current_random = random;

	    // blink led pin 38  
	    output[0].on();
	    output[0].off(300);
	  });
	}
     }, 2000);

});
