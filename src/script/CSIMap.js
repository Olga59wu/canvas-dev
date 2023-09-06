import { LeafletMap } from './LeafletModule'

export class CSIMap extends LeafletMap {
  constructor(containerID, mapOption, mapView, mapSource) {
    super(containerID, mapOption)
    this.initMap(mapSource, mapView)
    this.latlngs = []
    this.layerGroup = super.createLayerGroup()
    // 畫計畫範圍時用
    this.drawLayer = {
      polyline: {
        content: null,
        layer: null,
        style: null,
      },
      polygon: {
        content: null,
        layer: null,
        style: null,
      },
    }
  }

  // ================ Init Map =================
  // (Done) 設定初始地圖 & 圖資
  initMap(mapSource, mapView) {
    const baseMap = super.setTileLayer(mapSource.url, mapSource.option)
    super.addLayerTo(baseMap, this.map)
    super.setView(mapView.viewCenter, mapView.zoom)
  }

  // ================ 手動畫線 =================

  // (Done) 設定 Point Style
  setPointStyle(style) {
    this.drawLayer.pointStyle = style
  }

  // 設定 IconNumber Style
  setIconNumberStyle(className) {
    this.drawLayer.iconNumber = className
  }

  // (Done) 設定 Polyline Style
  setPolylineStyle(style) {
    this.drawLayer.polyline.style = style
  }

  // (Done) 設定 Polygon style
  setPolygonStyle(style) {
    this.drawLayer.polygon.style = style
  }

  // (Done) 手動畫點、線、面
  drawing(latlng) {
    this.latlngs.push(latlng)
    const lastLatLng = this.latlngs[this.latlngs.length - 1]
    const numberIcon = this.latlngs.length
    const numberCircle = this.createNumberCircle(lastLatLng, numberIcon, this.drawLayer.iconNumber)

    // 判斷是否畫 Polyline
    if (this.drawLayer.polyline.content !== null) {
      super.addLayerTo(numberCircle, this.drawLayer.polyline.layer)
      this.drawLayer.polyline.content.setLatLngs(this.latlngs)
    }

    // 判斷是否畫 Polygon
    if (this.drawLayer.polygon.content !== null) {
      super.addLayerTo(numberCircle, this.drawLayer.polygon.layer)
      this.drawLayer.polygon.content.setLatLngs(this.latlngs)
    }

    super.addLayerTo(this.layerGroup, this.map)
  }

  // (Done) 開始畫線(路徑)
  startPolyline() {
    this.latlngs = []
    this.drawLayer.polyline.content = super.createdPolyline([], this.drawLayer.polyline.style)
    this.drawLayer.polyline.layer = super.createLayerGroup()
    super.addLayerTo(this.drawLayer.polyline.content, this.drawLayer.polyline.layer)
    super.addLayerTo(this.drawLayer.polyline.layer, this.layerGroup)
  }

  // (Done) 開始畫矩形(範圍)
  startPolygon() {
    this.latlngs = []
    this.drawLayer.polygon.content = super.createdPolygon([], this.drawLayer.polygon.style)
    this.drawLayer.polygon.layer = super.createLayerGroup()
    super.addLayerTo(this.drawLayer.polygon.content, this.drawLayer.polygon.layer)
    super.addLayerTo(this.drawLayer.polygon.layer, this.layerGroup)
  }

  // (Done) 結束畫線
  endPolyline() {
    this.drawLayer.polyline.content = null
  }

  // (Done) 結束畫範圍
  endPolygon() {
    this.drawLayer.polygon.content = null
  }

  // ================= 清除圖層 =====================

  // 清除 this.layerGroup 裡被指定的 Draw 圖層
  clearAssignDrawLayer(removeLayerID) {
    super.removeLayer(this.layerGroup, removeLayerID)
  }

  // (Done) 畫出巡檢任務紀錄
  drawRecord(record, option) {
    this.recordLayerID = {
      projectArea: null,
      area: null,
      route: null,
      event: null,
    }
    // 專案範圍
    const projectArea = super.createdPolygon(record.projectArea, option.projectAreaStyle)
    super.addLayerTo(projectArea, this.layerGroup)
    this.recordLayerID.projectArea = super.getLayerID(this.layerGroup, projectArea)
    // 巡檢範圍
    const area = super.createdPolygon(record.area, option.areaStyle)
    super.addLayerTo(area, this.layerGroup)
    this.recordLayerID.area = super.getLayerID(this.layerGroup, area)
    // 巡檢路徑
    const route = super.createdPolyline(record.route, option.routeStyle)
    const routeLayer = super.createLayerGroup()
    record.route.forEach((latlng, index) => {
      const numberCircle = this.createNumberCircle(latlng, index + 1, 'numberIcon')
      super.addLayerTo(numberCircle, routeLayer)
    })
    super.addLayerTo(route, routeLayer)
    super.addLayerTo(routeLayer, this.layerGroup)
    this.recordLayerID.route = super.getLayerID(this.layerGroup, routeLayer)
    // 巡檢事件
    if (record.events.length > 0) {
      const eventLayer = super.createLayerGroup()
      const havePopup = option.eventMarker.popupContent !== null
      record.events.forEach((event) => {
        const eventMarker = super.createdMarker(event.latlng, option.eventMarker.option)
        if (havePopup) {
          super.addPopupToLayer(eventMarker, option.eventMarker.popupContent(event))
        }
        super.addLayerTo(eventMarker, eventLayer)
      })
      super.addLayerTo(eventLayer, this.layerGroup)
      this.recordLayerID.event = super.getLayerID(this.layerGroup, eventLayer)
    }
    super.addLayerTo(this.layerGroup, this.map)
    super.setFitBounds(record.projectArea)
    return this.layerGroup
  }

  // (Done) 取得 View 的四個角落經緯度
  getViewBoundsLatLng(layer) {
    const projectView = {
      northWest: null,
      northEast: null,
      southEast: null,
      southWest: null,
    }
    let bounds = layer.boxZoomBounds
    if (bounds === undefined) {
      bounds = layer.getBounds()
    }
    projectView.northEast = bounds.getNorthEast()
    projectView.southWest = bounds.getSouthWest()
    projectView.northWest = bounds.getNorthWest()
    projectView.southEast = bounds.getSouthEast()
    return projectView
  }

  // (Done) 製作具有數字的 Circle Marker
  createNumberCircle(latLng, number, iconStyle) {
    const numberIcon = super.createDivIcon(iconStyle, number)
    const numberCircle = super.createdMarker(latLng, {
      icon: numberIcon,
      zIndexOffset: 1000,
    })
    return numberCircle
  }

  // ================ 測試開發中的 function =============
}
