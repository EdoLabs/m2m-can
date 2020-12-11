'use strict';

const m2m = require('m2m');
const r = require('array-gpio');

let output = r.out({pin:[33, 35, 36, 37], index:'pin'});

let app = new m2m.Client();
 
app.connect(function(err, result){
  if(err) return console.log('Connect error:', err.message);
  console.log('result:', result);

  output[33].on();
  output[35].off();
  output[36].off();
  output[37].off();

  // enable code editing using the browser
  app.setOptions({code:{ allow:true, filename:'app.js'},  name:'Master App', location:'Waterloo', description:'Test App'});

  let device = app.accessDevice(200); 

  device.channel('can-temp').watch(function(err, data){
    if(err) return console.log('can-temp error:', err.message);
    console.log('**can-temp', data);
    output[33].pulse(1000);
  });

  device.channel('can-random').watch(function(err, data){
    if(err) return console.log('can-random error:', err.message);
    console.log('**can-random', data);
    output[35].pulse(1100);
  }); 

  device.channel('can-test').watch(function(err, data){
    if(err) return console.log('can-test error:', err.message);
    console.log('**can-test', data);
    output[37].pulse(1200);
  }); 

});