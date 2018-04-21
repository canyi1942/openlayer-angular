/**
 * Created by weipeng.wang on 2018/4/21.
 */
export default class Tool {
  
  constructor() {
  
  }
  
  static productPoint(mapObj) {
    
    let center = mapObj.map.getView().getCenter();
    
    let coords = ol.proj.toLonLat([
      (center[0] + 1000000 * Math.random()),
      (center[1] + 500000 * Math.random())]
    );
    
    coords = coords.map(record => record.toFixed(5));
    
    const point = {
      coords: coords,
      desc: '我的坐标是' + coords,
      style: {
        img: '../app/lib/point.png',
        type: 'img',
      },
      id: Math.random()
    };
    
    return point;
    
  }
  
};