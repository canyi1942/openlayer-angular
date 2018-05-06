import Map from './js/Map.js';
import Tool from './js/Tool.js';

var mapObj = new Map({'container': 'map'});

var app = angular.module('myApp', []);

const siteTypes = [
  `全选`,
  `一类`,
  `二类`,
  `三类`,
  `四类`
];

const engineeringPeriods = [
  `全选`,
  `1期`,
  `2期`,
  `3期`,
  `重大问题`
]

const approvalStates = [
  `全选`,
  `已获批`,
  `待批`,
  `重大问题`
]

const problemTypes = [
  `全选`,
  `无问题`,
  `部分问题，可协商解决`,
  `重大问题`,
  `自然保护区，需完善手续`
]

app.controller('myCtrl', function ($scope) {
  
  $scope.siteTypes = siteTypes;
  $scope.engineeringPeriods = engineeringPeriods;
  $scope.approvalStates = approvalStates;
  $scope.problemTypes = problemTypes
  
  $scope.siteType = '全选';
  $scope.engineeringPeriod = '全选';
  $scope.approvalState = '全选';
  $scope.problemType = '全选'
  
  $scope.queryInfo = () => {
    window.console.log($scope.siteType, $scope.engineeringPeriod, $scope.approvalState, $scope.problemType)
  }
  
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

