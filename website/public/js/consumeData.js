/*
let spillData = [];

let spill = {
  ships : [
    lat: 0,
    lng: 0,
  ],
  lat : 0,
  lng : 0,
  id : 'hello'
}
*/

let allSpillData = [];

$.get('API endpoint', function(data) {
  // Assuming data is a JSON formatted as expected
  data.forEach(function(spillData) {
    allSpillData.push(spillData);
  })
});

//More TBD once I get new data
