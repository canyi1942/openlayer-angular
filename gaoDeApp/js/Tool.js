/**
 * Created by weipeng.wang on 2018/4/21.
 */
import {DEFAULT_RENDER_POINT_IMG} from './const.js';
export default class Tool {
  
  constructor() {
  
  }
  
  static childAutoScrollToView(parent, currentDOM) {
    
    // 父容器内容高度，包括不可见内容的高度
    const scrollHeight = parent.scrollHeight;
    
    // 父容器可见区域高度
    const clientHeight = parent.clientHeight;
    
    // 当前要操作的dom的高度
    const currentDOMHeight = currentDOM.offsetHeight;
    
    // 操作dom离内容的高度距离
    const currentDOMOffsetTop = currentDOM.offsetTop;
    
    const scrollTop = parent.scrollTop;
    
    if (scrollHeight > clientHeight) {
      
      parent.scrollTop = currentDOMOffsetTop - 0.5 * clientHeight;
      
    }
    
  }
  
  static getItemsForPageNum(pageIndex = 0, items = [], pageSize = 10) {
    
    const begin = pageIndex * pageSize;
    
    let end = pageSize * ++pageIndex;
    
    if (end > items.length) {
      end = items.length;
    }
    
    return items.slice(begin, end);
    
  }
  
  static filterObjForAttr(originData = [], {attr, value}) {
    
    if (value === '全选') {
      return [...originData];
    }
    
    return originData.filter((record) => {
      
      return record[attr] === value;
      
    });
    
  }
  
  static getPanigation(items = 0, pageSize) {
    
    const totalNum = Number.parseInt((items + pageSize - 1) / pageSize, 10);
    
    const arr = [];
    
    for (let i = 0; i < totalNum;) {
      arr.push(i++);
    }
    
    return arr;
  }
  
  static string2Obj(originStringData = []) {
    
    originStringData = originStringData.map(record => record.split(','));
    
    originStringData = originStringData.filter(record => record.length > 7);
    
    return originStringData.map((record, item) => {
      
      const name = record[0];
      const lon = record[1];
      const lat = record[2];
      const siteType = record[3];
      const location = record[4];
      const engineeringPeriod = record[5];
      const approvalState = record[6];
      const problemType = record[7];
      const id = ++item;
      const renderImg = DEFAULT_RENDER_POINT_IMG;
      
      return {
        id,
        name,
        lon,
        lat,
        siteType,
        location,
        engineeringPeriod,
        approvalState,
        problemType,
        //renderImg
      };
      
    });
    
  }
  
};