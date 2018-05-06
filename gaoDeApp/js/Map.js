
export default class MapAPI {
  
  constructor({container = 'map'}) {
    
    this.map = new AMap.Map(container,{
      resizeEnable: true,
      zoom: 10,
      center: [116.480983, 40.0958]
    });
    
  }
  
  
}