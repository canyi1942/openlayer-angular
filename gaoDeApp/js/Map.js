import {DEFAULT_RENDER_POINT_IMG} from './const.js';

export default class MapAPI {
  
  constructor({container = 'map'}) {
    
    this.map = new AMap.Map(container, {
      resizeEnable: true,
      zoom: 10,
      center: [116.480983, 40.0958]
    });
    
  }
  
  renderMap({points = [], lines = [], fitView = true, callback}) {
    
    callback ? this.callback = callback : '';
    
    this.map.clearMap();
    
    const markers = this.drawPoints(points, callback) || [];
    
    fitView ? this.map.setFitView(markers) : '';
    
  }
  
  drawPoints(pointObj = []) {
    
    return pointObj.map((record, index) => {
      
      try {
        
        const marker = new AMap.Marker({
          position: [Number.parseFloat(record.lon), Number.parseFloat(record.lat)],
          label: {content: ++index},
          extData: record
        });
        
        marker.on('click', (e) => {
          this.callback && this.callback(e.target.getExtData(), 'map');
        });
        
        marker.setIcon(record.renderImg ? record.renderImg : DEFAULT_RENDER_POINT_IMG);
        marker.setMap(this.map);
        
        return marker;
      } catch (e) {
        window.console.error(e);
      }
      
    });
    
  }
  
  openInfoWindow(point) {
    
    if (!this.infoWindow) {
      this.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(20, -30)
      });
    }
    
    this.infoWindow.setContent(point.name || point.id);
    try {
      point.lon && this.infoWindow.open(this.map, [Number.parseFloat(point.lon), Number.parseFloat(point.lat)]);
    } catch (e) {
      window.console.error('信息框错误', e)
    }
    
  }
  
};