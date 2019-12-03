const width = window.innerWidth;
const height = window.innerHeight;
const config = {
  speed: 0.005,
  verticalTilt: -30,
  horizontalTilt: 0,
  timeDelta: 400
}
let locations = [];
const svg = d3.select('svg')
    .attr('width', width).attr('height', height);
const markerGroup = svg.append('g');
const projection = d3.geoOrthographic();
const initialScale = projection.scale();
const path = d3.geoPath().projection(projection);
const center = [width/2, height/2];

drawGlobe();
drawGraticule();

function consumeSpillData() {
  let allSpillData = [];

  // Stubbed
  allSpillData =
  [
    {
      "uniqueID": "BIG BAD OIL SPILL",
      "latitude": 36.1699,
      "longitude": 115.1398,
      "satImg": "xyz",
      "shipList": [
        {
          "id" : "BAD SHIP",
          "confidence": 0.99
        },
        {
          "id" : "OK SHIP",
          "confidence": 0.45
        },
        {
          "id" : "GOOD SHIP",
          "confidence": 0.01
        }
      ]
    }
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

function drawGlobe() {
    d3.queue()
        .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')
        //.defer(d3.json, consumeSpillData()) // TODO work with API when ready
        .await((error, worldData, locationData) => {
            svg.selectAll(".segment")
                .data(topojson.feature(worldData, worldData.objects.countries).features)
                .enter().append("path")
                .attr("class", "segment")
                .attr("d", path)
                .style("stroke", "#1FA3C2")
                .style("stroke-width", "2px")
                .style("fill", (d, i) => '#e5e5e5')
                .style("opacity", ".4");
                locations = consumeSpillData();
                drawMarkers();
        });
}

function drawGraticule() {
    const graticule = d3.geoGraticule()
        .step([10, 10]);

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "#FFF")
        .style("stroke", "#4FD6F5");
}


let pauseTime = 0;

function enableRotation() {
  rotating = true;
  d3.timer(function (elapsed) {
      elapsed = pauseTime === 0 ? elapsed : pauseTime;
      projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
      svg.selectAll("path").attr("d", path);
      drawMarkers();
  });
}

function clearDataCard() {
  $('#dataCard__id').text("POI ID:");
  $('#dataCard__latLong').text("POI LAT/LNG:");
  $('#dataCard__snapshot').hide();
  $('#dataCard__shipList').empty();
}

$('#globe').on('mousemove', function(e) {

  let pause = false;

  $('.globePoint').each(function(p) {
    let cx = $(this).offset().left;
    let cy = $(this).offset().top;
    if (Math.sqrt(Math.pow(e.pageX - cx,2) + (Math.pow(e.pageY - cy,2))) < 30) { //Should be 14ish but wiggle room
      pauseTime = pauseTime === 0 ? d3.now() - config.timeDelta : pauseTime;
      pause = true;

      let pointData = locations.find(p => p.uniqueID === $(this).attr('id'));

      if (pointData != null) {
        $('#dataCard__id').text("POI ID: " + pointData.uniqueID);
        $('#dataCard__latLong').text("POI LAT/LNG: " + pointData.latitude + " " + pointData.longitude);
        $('#dataCard__snapshot').attr('src',pointData.satImg).show();
        if ($('#dataCard__shipList').is(':empty')) {
          pointData.shipList.forEach(function(ship) {
            $('#dataCard__shipList').append('<li>' + ship.id + ' - ' + ship.confidence + '</li>');
          })
        }
      }
    } else if (!pause) {
      pauseTime = 0;
      clearDataCard()
    }
  });
})

function drawMarkers() {
    const markers = markerGroup.selectAll('circle')
        .data(locations);
    markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
        .attr('class', 'globePoint')
        .attr('id', d => { return d.uniqueID })
        .attr('fill', d => {
            const coordinate = [d.longitude, d.latitude];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'none' : 'steelblue';
        })
        .attr('r', 7);

    markerGroup.each(function () {
        this.parentNode.appendChild(this);
    });
}

enableRotation();

function downloadReport() {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(locations));
  var dlAnchorElem = document.getElementById('reportDownloader');
  dlAnchorElem.setAttribute("href",dataStr);
  dlAnchorElem.setAttribute("download", "spillData.json");
  dlAnchorElem.click();
}
