import mapboxgl from 'mapbox-gl';

const initMapbox = () => {
  const mapElement = document.getElementById('map');
  const fitMapToMarkers = (map, markers) => {
  const bounds = new mapboxgl.LngLatBounds();
  [markers].forEach(marker => bounds.extend([ marker.lng, marker.lat ]));
  map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  };
  if (mapElement && mapElement.dataset.itineraries) {
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/basilerieu/cki0d8i2q1hw819lrdus9xnyx'
    });
    const markers = JSON.parse(mapElement.dataset.markers);
    const itineraries = JSON.parse(mapElement.dataset.itineraries);
    const colors = JSON.parse(mapElement.dataset.colors);
    console.log(colors);
    [markers].forEach((marker) => {
      const element = document.createElement('div');
      element.className = 'marker';
      element.style.backgroundImage = `url('${marker.image_url}')`;
      element.style.backgroundSize = 'contain';
      element.style.width = '30px';
      element.style.height = '30px';
      new mapboxgl.Marker(element)
        .setLngLat([ marker.lng, marker.lat ])
        .addTo(map);
    });
    fitMapToMarkers(map, markers);
    itineraries.forEach((itinerary, index) => {
      map.on('load', function () {
        map.addSource(`route-${index}`, {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': itinerary
            }
          }
        });
        map.addLayer({
          'id': `route-${index}`,
          'type': 'line',
          'source': `route-${index}`,
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
            },
          'paint': {
            'line-color': colors[index],
            'line-width': 8
          }
        });
      });

    });
  }
};

export { initMapbox };
