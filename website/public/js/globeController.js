const width = window.innerWidth;
const height = window.innerHeight;
let config = {
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
      "uniqueID": "DefaultPosition",
      "latitude": 0,
      "longitude": 0,
      "satImg": "xyz",
      "shipList": [
        {
          "callsign" : "WDI9376",
          "name" : "LAURA B",
          "confidence": 0.99
        },
        {
          "callsign" : "PA2969",
          "name" : "ELAY",
          "confidence": 0.45
        },
        {
          "callsign" : "WDC9569",
          "name" : "LUKE",
          "confidence": 0.12
        }
      ]
    },
    {
      "uniqueID": "Hong Kong",
      "latitude": 22.3193,
      "longitude": 114.1694,
      "satImg": "xyz",
      "shipList": [
        {
          "callsign" : "CY7049",
          "name" : "HECATE PRINCE",
          "confidence": 0.12
        }
      ]
    },
    {
      "uniqueID": "London",
      "latitude": 51.5074,
      "longitude": -0.1278,
      "satImg": "xyz",
      "shipList": [
        {
          "callsign" : "PH6484",
          "name" : "VEERMAN VAN K",
          "confidence": 0.12
        },
        {
          "callsign" : "PI 6360",
          "name" : "EVOLUTIE",
          "confidence": 0.12
        }
      ]
    },
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
  $('#dataCard__id').text('');
  $('#dataCard__latLong').text('');
  $('#dataCard__snapshot').hide();
  $('#dataCard__shipList').empty();
}

$('#globe').on('mousemove', function(e) {

  let pause = false;

  $('.globePoint').each(function(p) {
    let cx = $(this).offset().left;
    let cy = $(this).offset().top;

    let hovering = Math.sqrt(Math.pow(e.pageX - cx,2) + (Math.pow(e.pageY - cy,2))) < 30;

    if (hovering) {

      let pointData = locations.find(p => p.uniqueID === $(this).attr('id'));

      pauseTime = pauseTime === 0 ? d3.now() - config.timeDelta : pauseTime;
      pause = true;

      if (pointData != null) {
        $('#dataCard__id').text("ID: " + pointData.uniqueID);
        $('#dataCard__latLong').text("POI: " + pointData.latitude + "N " + pointData.longitude + "E");
        $('#dataCard__snapshot').attr('src',pointData.satImg).show();
        if ($('#dataCard__shipList').is(':empty')) {
          pointData.shipList.forEach(function(ship) {
            $('#dataCard__shipList').append('<li><b>' + ship.name + '</b><ul><li>Callsign: ' + ship.callsign + '</li><li>Confidence: ' + (ship.confidence * 100) + '%</li></ul></li>');
          })
        }
      }
    } else if (!pause) {
      pauseTime = 0;
      clearDataCard()
    }

  });
})

let lastPos = {};

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

            let lastGD = lastPos[d.uniqueID];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));

            if (lastGD != null && parseFloat(lastGD)) {
              lastPos[d.uniqueID] = gdistance;
              return gdistance > lastGD ? 'none' : 'steelblue';
            } else {
              lastPos[d.uniqueID] = gdistance;
              return 'red'; // Red implies a technical error
            }
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

$('#tiltSlider').on('input', function(e) {
  config.verticalTilt = $(this).val();
})
