import Map from './js/Map.js';
import Tool from './js/Tool.js';

var mapObj = new Map({'container': 'map', tip: true});

var app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope) {
  
  const points = [];
  const layers = [];
  
  $scope.points = points;
  $scope.layers = layers;
  
  $scope.nav = {
    points: 'in active',
    layers: ''
  };
  
  $scope.addPoint = () => {
    
    if (points.length >= 10) {
      alert("This demo is for reference only. Don't add too many points.")
      return false;
    }
    
    const point = Tool.productPoint(mapObj);
    
    points.push(point);
    
    mapObj.renderMap({points, layers});
    
  };
  
  $scope.deletePoint = (point) => {
    
    const filterPts = points.filter(record => point.id === record.id);
    
    if (filterPts.length) {
      points.splice(points.indexOf(filterPts[0]), 1);
      mapObj.renderMap({points, layers});
    }
    
  };
  
  $scope.addLayer = () => {
    
    if (imageLayers.length) {
      layers.push(imageLayers.pop());
      mapObj.renderMap({layers, points})
    } else {
      alert('There is no layer, please add the layer in the database');
    }
    
  };
  
  $scope.deleteLayer = (layer) => {
    
    const filterLayer = layers.filter(record => record.name === layer.name);
    
    if (filterLayer.length) {
      imageLayers.push(layer);
      layers.splice(layers.indexOf(filterLayer[0]), 1);
      mapObj.renderMap({layers, points})
    }
    
  };
  
});

const imageLayers = [
  {
    name: 'highWay',
    url: 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer',
    type: 'tile',
    id: 1,
    desc: 'USA highWay layer'
  },

];

