'use strict';

const m2m = require('m2m');
const can = require('m2m-can');

let temp = null, random = null;

/* can-gateway device frame id or can node id */
let deviceID = '00C'; 

/* temperature can device frame id */
let temp_id = '025';

/* random can device frame id */
let random_id = '015';

// create an m2m device/server object that will serve as "can-gateway"
const device = new m2m.Device(200);

device.connect(function(err, result){
  if(err) return console.error('connect error:', err.message);

  console.log('result:', result);
  	
  /* open can0 interface, set bitrate to 500000 and txqueuelen to 1000 */
  // ngcan.open('can0', 500000, 1000); // output => ip link set can0 up with txqueuelen 1000 and bitrate 500000 - success
  can.open('can0', 500000, 1000, function(err, result){
    if(err) return console.error('can error', err);
    // should output => ip link set can0 up with txqueuelen 1000 and bitrate 500000 - success

    console.log('can.open result', result);

    // enable code editing using the browser interface
    // device.setOptions({code:{allow:true, filename:'can-app.js'}});

    can.readl('can0', '-e', function(err, frame){
      if(err) return console.log('read error', err);
			
      console.log('read frame', frame);
	
      if(frame.id === temp_id){ // 22.23, 25.12, 19.45
        temp = frame.data[0] + '.' + frame.data[1];
      }
      if(frame.id === random_id){ // 35, 78, 55
        //random = frame.data[0] + '.' + frame.data[1];
	random = frame.data[0]; 
      }
    });
	 
    /*setInterval(function(){
      can.read('can0', '-e', function(err, frame){
       if(err) return console.log('read error', err);
       console.log('read frame', frame);
	
        if(frame.id === temp_id){ // 22.23, 25.12, 19.45
          temp = frame.data[0] + '.' + frame.data[1];
        }
        if(frame.id === random_id){ // 35, 78, 55
          //random = frame.data[0] + '.' + frame.data[1];
	  random = frame.data[0]; 
        }
      });
    }, 100);*/	    
	   
  });
  
  // can-temp	   
  device.setChannel('can-temp', function(err, data){
    if(err) return console.error('can-temp error:', err.message);

    data.send(temp); 
    console.log('can-temp', temp);
  });
	
  // can-random
  device.setChannel('can-random', function(err, data){
    if(err) return console.error('can-random error:', err.message);
 
    data.send(random);
    console.log('can-random', random);
  });
	
  // can-test
  device.setChannel('can-test', function(err, data){
    if(err) return console.error('can-test error:', err.message);
	
    let rn = Math.floor(( Math.random() * 90) + 5);
    data.send(rn);
    console.log('can-test', rn);
  });

});
