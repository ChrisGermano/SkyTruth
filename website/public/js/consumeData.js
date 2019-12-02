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

$.get('API endpoint', function(data) {
  // Assuming data is a JSON formatted as expected
  data.forEach(function(spillData) {
    allSpillData.push(spillData);
  })
});

let consumeSpillData = function() {
  let allSpillData = [];

  // Stubbed
  [
    {"uniqueID": "BIG BAD OIL SPILL", "latitude": 36.1699, "longitude": 115.1398},
    {"uniqueID": "Little Teeny Oil Spill", "latitude": 40.7128, "longitude": 74.0060},
    {"uniqueID": "Ocean Oil Spill", "latitude": 0, "longitude": 0}
  ]


  /*
  $.get('API endpoint', function(data) {
    // Assuming data is a JSON formatted as expected
    data.forEach(function(spillData) {
      allSpillData.push(spillData);
    })
  });
  */
  return allSpillData;
}

//More TBD once I get new data
