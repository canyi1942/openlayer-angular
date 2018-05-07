import Map from './js/Map.js';
import Tool from './js/Tool.js';
import originPOIData from './js/dao.js';
import {DEFAULT_RENDER_POINT_IMG, HIGHTLIGHT_RENDER_POINT_IMG} from './js/const.js';
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
];

const approvalStates = [
  `全选`,
  `已获批`,
  `待批`,
  `重大问题`
];

const problemTypes = [
  `全选`,
  `无问题`,
  `部分问题，可协商解决`,
  `重大问题`,
  `自然保护区，需完善手续`
];

const pageSize = 20;

app.controller('myCtrl', function ($scope) {
  
  $scope.siteTypes = siteTypes;
  $scope.engineeringPeriods = engineeringPeriods;
  $scope.approvalStates = approvalStates;
  $scope.problemTypes = problemTypes;
  
  $scope.siteType = '全选';
  $scope.engineeringPeriod = '全选';
  $scope.approvalState = '全选';
  $scope.problemType = '全选';
  
  $scope.originPOIData = Tool.string2Obj(originPOIData) || [];
  $scope.filterPOIData = [];
  $scope.totalFilterPOIData = [...$scope.originPOIData];
  $scope.pagination = [];
  
  $scope.queryInfo = (pageNum = 0) => {
    
    const totalFilterPOIData = [{
      attr: `siteType`,
      value: $scope.siteType,
    }, {
      attr: `engineeringPeriod`,
      value: $scope.engineeringPeriod,
    }, {
      attr: `approvalState`,
      value: $scope.approvalState,
    }, {
      attr: `problemType`,
      value: $scope.problemType,
    }].reduce(Tool.filterObjForAttr, $scope.originPOIData);
    
    $scope.filterPOIData = Tool.getItemsForPageNum(pageNum, totalFilterPOIData, pageSize);
    
    $scope.pagination = Tool.getPanigation(totalFilterPOIData.length, pageSize);
    
    mapObj.renderMap({points: $scope.filterPOIData, fitView: true, callback: $scope.focusPoint});
    
  };
  
  $scope.focusPoint = (item) => {
    
    $scope.filterPOIData.some((record) => {
      
      if (record.id == item.id) {
        record.className = 'poi-box selected';
        record.renderImg = HIGHTLIGHT_RENDER_POINT_IMG;
      } else {
        record.className = 'poi-box';
        record.renderImg = DEFAULT_RENDER_POINT_IMG;
      }
    });
    
    mapObj.renderMap({points: $scope.filterPOIData, fitView: false});
    
  };
  
  $scope.queryInfo();
  
  $scope.addPoint = () => {
    
    if (points.length >= 10) {
      alert('This demo is for reference only. Don\'t add too many points.');
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
  
});


