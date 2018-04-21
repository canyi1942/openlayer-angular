var ol = window.ol;
export default class Map {
  
  constructor(props) {
    
    const {
      layerName = 'defaultLayer',
      layerZIndex = 100,
      searchToolParentDOM = '.wrap-tool-left',
      leftClickCallback,
      rightClickCallback,
      featureLeftClickCallback,
      queryLinks,
      container,
    } = props;
    
    this.layers = [];
    this.imageLayers = [];
    this.lineFeatures = [];
    this.pointFeatures = [];
    this.defaultLayerName = layerName;
    this.defaultLayerZIndex = layerZIndex;
    this.operationMap = null;
    this.searchToolParentDOM = searchToolParentDOM;
    this.rightClickCallback = rightClickCallback;
    this.leftClickCallback = leftClickCallback;
    this.featureLeftClickCallback = featureLeftClickCallback;
    this.queryLinks = queryLinks;
    
    this.initMap({container});
    
  }
  
  initMap({container, tip = false}) {
    
    var view = new ol.View({
      center: [-10997148, 4569099],
      zoom: 4,
      maxZoom: 20,
      minZoom: 3,
    });
    
    this.map = new ol.Map({
      interactions: ol.interaction.defaults({doubleClickZoom: false}),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
      ],
      target: container,
      view: view,
    });
    var controls = this.map.getControls().getArray();
    for (var i = controls.length - 1; i >= 0; i--) {
      this.map.removeControl(controls[i]);
    }
    var mousePosition = new ol.control.MousePosition({
      projection: 'EPSG:4326',
    });
    
    //var zoomObj = $('<div class="mapTool-zoom">').appendTo(this.map.getTargetElement());
    this.map.updateSize();
    
    this.addLayer({
      layerName: this.defaultLayerName,
      layerZIndex: this.defaultLayerZIndex
    });
    
    this.featureOnListenerClick({tip});
    
    this.info = $('#info');
    this.info.tooltip({
      animation: false,
      trigger: 'manual'
    });
    
  }
  
  featureOnListenerClick({tip = false}) {
    
    this.map.on('click', (evt) => {
      
      this.showTip(evt.pixel, null);
      
      this.map.forEachFeatureAtPixel(evt.pixel, (clickFeature, clickLayer) => {
        
        this.showTip(evt.pixel, clickFeature);
        
        this.featureLeftClickCallback && this.featureLeftClickCallback(clickFeature);
        
      }, (layerFilter) => {
        
        return this.layers.includes(layerFilter);
        
      });
      
    });
    
    this.map.on('pointerdrag', (evt) => {
      
      this.showTip(evt.pixel, null);
      
    });
    
  }
  
  renderMap({lines, points, layerName, layerZIndex, layers = []}) {
    
    this.removeFeatures([...this.pointFeatures, ...this.lineFeatures]);
    this.removeImageLayers([...this.imageLayers]);
    
    if (lines && lines.length) {
      this.addSimpleLines({lines, layerName, layerZIndex});
    }
    
    if (points && points.length) {
      this.addSimplePoints({points, layerName, layerZIndex});
    }
    
    if (layers && layers.length) {
      this.addImageLayers(layers);
    }
    
  }
  
  addImageLayers(layers = []) {
    
    layers.forEach(layer => this.addImageLayer(layer));
    
  }
  
  addImageLayer(layer = {}) {
    
    let olLayer = this._getOlLayerByUserLayer(layer);
    
    if (Object.prototype.toString.call(olLayer) === '[object Boolean]') {
      window.console.error('添加imageLayer失败', layer);
      return false
    };
    
    try {
      this.map.addLayer(olLayer);
      this.imageLayers.push(olLayer);
    } catch (e) {
      window.console.error('添加imageLayer失败', layer);
    }
    
  }
  
  removeImageLayers(layers = []) {
    
    layers.forEach(layer => this.removeImageLayer(layer));
    
  }
  
  removeImageLayer(layer = {}) {

    try {
      
      this.map.removeLayer(layer);
  
      this.imageLayers.splice(this.imageLayers.indexOf(layer), 1);
      
    } catch (e) {
      window.console.error('删除imageLayer失败', layer);
    }
    
  }
  
  isRemoveLayer(preLayers, nextLayers) {
  
  }
  
  showTip(pixel, feature) {
    
    this.info.css({
      left: pixel[0] + 'px',
      top: (pixel[1] - 15) + 'px'
    });
    
    if (feature) {
      const data = feature.get('data') || {};
      const desc = data.desc || 'Hi';
      this.info.tooltip('hide').attr('data-original-title', desc).tooltip('fixTitle').tooltip('show');
    } else {
      this.info.tooltip('hide');
    }
    
  }
  
  addLayer({layerName, layerZIndex}) {
    
    const layer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      name: layerName,
      zIndex: layerZIndex
    });
    
    this.map.addLayer(layer);
    
    this.layers.push(layer);
    
    return layer;
  }
  
  getLayerByName(layerName, layerZIndex) {
    
    layerName = layerName ? layerName : this.defaultLayerName;
    
    const filterLayers = this.layers.filter((layer) => {
        return layer.get('name') === layerName;
      }) ||
      [];
    
    return filterLayers.length ? filterLayers[0] : this.addLayer({layerName, layerZIndex});
    
  }
  
  /**
   * @description 在地图上绘制simpleLine
   * @param lines [{coords, style, ...}, ] 要绘制的lines的对象
   * @param layerName 要绘制的图层的名字
   * @return {Array} ol.Features
   */
  addSimpleLines({lines = [], layerName, layerZIndex}) {
    
    return lines.map((line) => {
      this.addSimpleLine({line, layerName, layerZIndex});
    });
    
  }
  
  addSimpleLine({line, layerName, layerZIndex}) {
    
    const {coords, style = {}} = line;
    
    try {
      
      let feature = new ol.Feature({
        geometry: (new ol.geom.LineString(this._string2NumberForTwoDimenSionalArray(coords))).transform('EPSG:4326', 'EPSG:3857'),
        data: line
      });
      
      const {fillColor = '', strokeColor = '', strokeWidth = '5'} = style;
      
      const fs = this.getLineStyle({fillColor, strokeColor, strokeWidth});
      
      feature.setStyle(fs);
      
      const lineFeature = this.addFeature({feature, layerName, layerZIndex});
      
      if (feature) {
        this.lineFeatures.push(lineFeature);
      }
      
      return lineFeature;
      
    } catch (e) {
      window.console.warn('绘制线的时候，发现传入参数有问题');
    }
    
  }
  
  /**
   * @description 在地图上绘制简单点
   * @param points [{coords, style, ...},] 要绘制的点
   * @param layerName 要操作的图层的名字
   * @return {Array} ol.Feature
   */
  addSimplePoints({points = [], layerName, layerZIndex}) {
    
    return points.map((point) => {
      this.addSimplePoint({point, layerName, layerZIndex});
    });
    
  }
  
  addSimplePoint({point = {}, layerName = '', layerZIndex}) {
    
    let {coords = [], style = {}, angle = 0} = point;
    
    const {type = 'circle', color = '#ff0000', opacity = 0.6, size = 15, img, scale = 1} = style;
    
    coords = this._string2NumberForOneDimenSionalArray(coords);
    
    if (Object.prototype.toString.call(coords) !== '[object Array]') return false;
    
    const feature = new ol.Feature({
      geometry: (new ol.geom.Point(coords)).transform('EPSG:4326', 'EPSG:3857'),
      data: point,
    });
    
    let fs = this._getPointStyle({type, color, opacity, size, img, angle, scale});
    
    feature.setStyle(fs);
    
    const pointFeature = this.addFeature({feature, layerName, layerZIndex});
    
    if (pointFeature) {
      this.pointFeatures.push(pointFeature);
    }
    
    return pointFeature;
  }
  
  addFeatures({features = [], layerName, layerZIndex}) {
    
    features.forEach((feature) => {
      this.addFeature({feature, layerName, layerZIndex});
    });
    
  }
  
  addFeature({feature, layerName, layerZIndex}) {
    
    const layer = this.getLayerByName(layerName, layerZIndex);
    
    feature.set('layerName', layerName);
    
    layer.getSource().addFeature(feature);
    
    window.console.info('当前图层的features', layer.getSource().getFeatures().length);
    
    return feature;
    
  }
  
  removeFeatures(features = []) {
    
    features.forEach((feature) => {
      
      this.removeFeature(feature);
      
    });
    
  }
  
  removeFeature(feature = {}) {
    
    let layer = null;
    
    if (feature && feature.get) {
      layer = this.getLayerByName(feature.get('layerName') || this.defaultLayerName);
    }
    
    try {
      
      layer && layer.getSource().removeFeature(feature);
      
      this.pointFeatures.includes(feature) ?
        this.pointFeatures.splice(this.pointFeatures.indexOf(feature), 1) :
        '';
      
      this.lineFeatures.includes(feature) ?
        this.lineFeatures.splice(this.lineFeatures.indexOf(feature), 1) :
        '';
      
    } catch (e) {
      window.console.warn('删除feature失败', feature);
    }
    
  }
  
  _getLineStyle({fillColor = 'blue', strokeColor = 'blue', strokeWidth = '5'}) {
    
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: fillColor,
      }),
      stroke: new ol.style.Stroke({
        color: strokeColor,
        width: strokeWidth,
      }),
    });
    
  };
  
  _getPointStyle({
      type,
      color = '#ff0000',
      opacity = 0.6,
      size = 5,
      img = '../../dist/asserts/images/left11410.png',
      angle = 0,
      scale = 1
    }) {
    var stroke = new ol.style.Stroke({color: color, width: 1});
    var stroke2 = new ol.style.Stroke({color: 'red', width: 2});
    var fill = new ol.style.Fill({color: '#' + color});
    var style = {
      'square': new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: fill,
          stroke: stroke2,
          points: 4,
          radius: 5,
          opacity: opacity,
          angle: Math.PI / 4,
        }),
      }),
      'triangle': new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: fill,
          stroke: stroke,
          points: 3,
          radius: 10,
          opacity: opacity,
          rotation: Math.PI / 4,
          angle: 0,
        }),
      }),
      'circle': new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: 'green',
          }),
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 2,
          }),
        }),
      }),
      'star': new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: fill,
          stroke: stroke,
          points: 5,
          opacity: opacity,
          radius: 12,
          radius2: 4,
          angle: 0,
        }),
      }),
      'cross': new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: fill,
          stroke: stroke,
          opacity: opacity,
          points: 4,
          radius: 10,
          radius2: 0,
          angle: 0,
        }),
      }),
      'x': new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: fill,
          opacity: opacity,
          stroke: stroke,
          points: 4,
          radius: 10,
          radius2: 0,
          angle: Math.PI / 4,
        })
      }),
      'img': new ol.style.Style({
        image: new ol.style.Icon({
          src: img,
          scale: scale,
          rotation: angle,
        })
      })
    };
    return style[type];
  }
  
  _string2NumberForOneDimenSionalArray(arr = []) {
    
    if (arr.length != 2) return false;
    
    let targetArr = arr.map((record) => {
      return +record;
    });
    
    return targetArr;
  }
  
  _string2NumberForTwoDimenSionalArray(arr = [[]]) {
    
    let targetArr = arr.map((record) => {
      return this._string2NumberForOneDimenSionalArray(record);
    });
    
    targetArr = targetArr.filter((record) => {
      return Array.isArray(record);
    });
    
    return targetArr;
    
  }
  
  _getOlLayerByUserLayer(layer = {}) {
    
    const {type = 'tile', url, name, id} = layer;
    
    let olLayer = null;
    
    if (!name) return false;
    
    switch (type) {
      case 'tile':
        olLayer = new ol.layer.Tile({
          extent: [-13884991, 2870341, -7455066, 6338219],
          source: new ol.source.TileArcGISRest({
            url: url
          }),
          name,
          id
        });
        break;
      case 'image':
        olLayer = new ol.layer.Image({
          source: new ol.source.ImageArcGISRest({
            ratio: 1,
            params: {},
            url: url
          }),
          name,
          id
        });
        break;
    }
    
    if (olLayer) {
      return olLayer;
    } else {
      return false;
    }
  }
};