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

function drawGlobe() {
    d3.queue()
        .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')
        .defer(d3.json, 'locations.json')
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
                locations = locationData;
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

$('#globe').on('mousemove', function(e) {
  $('.globePoint').each(function(p) {
    let cx = $(this).attr('cx');
    let cy = $(this).attr('cy');
    if (Math.sqrt(Math.pow(e.pageX - cx,2) + (Math.pow(e.pageY - cy,2))) < 30) { //Should be 14ish but wiggle room
      pauseTime = pauseTime === 0 ? d3.now() - config.timeDelta : pauseTime;
      console.log($(this).attr('id'));
    } else {
      pauseTime = 0;
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
