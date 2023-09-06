import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


// 創造地圖物件
export class LeafletMap {
  constructor(containerID, mapOption) {
    this.mapContainerID = document.querySelector(`#${containerID}`)
    this.map = L.map(this.mapContainerID, mapOption)
  }

  // ============= Map Base & Raster Layer Set ==============

  // (Done) 設定圖資圖層
  setTileLayer(mapData, option) {
    return L.tileLayer(mapData, option)
  }

  // (Done) 加入圖片疊在地圖上
  addImageOverlay(imgUrl, imageBounds) {
    return L.imageOverlay(imgUrl, imageBounds)
  }

  // (Done) 設定 Map's View & zoom
  setView(center, zoom) {
    this.map.setView(center, zoom)
  }

  // (Done) 設置 Zoom Control 在畫面上的位置
  setZoomPosition(position) {
    this.map.zoomControl.setPosition(position)
  }

  // (Done) 設置 Scale(比例尺)
  setScale(option) {
    return L.control.scale(option)
  }

  // 地圖可視範圍直接顯示到指定的區域(不具有移動效果)
  setFitBounds(latlngs, option) {
    this.map.fitBounds(latlngs, option)
  }

  // (Done) Map 移動到指定的可視範圍(有移動效果)
  setFlyTo(latLngs, option) {
    this.map.flyToBounds(latLngs, option)
  }

  // ================== Vector Layer ====================

  // (Done) 建立 Circle
  createCircle(latLng, option) {
    return L.circle(latLng, option)
  }

  // (Done) 建立 Marker
  createdMarker(latLng, option) {
    return L.marker(latLng, option)
  }

  // (Done) 建立 Polyline [[latlng], [latlng]]
  createdPolyline(latLngs, option) {
    return L.polyline(latLngs, option)
  }

  // (Done) 建立 Polygon
  createdPolygon(latLngs, option) {
    return L.polygon(latLngs, option)
  }

  // ================== Other Layer ====================

  // (Done) 建立空的 layer Group (圖層組)
  createLayerGroup(addLayer) {
    return L.layerGroup(addLayer)
  }

  // (Done) 將 popup 綁定到指定圖層物件上
  addPopupToLayer(layer, content) {
    layer.bindPopup(content)
  }

  // (Done) 設置文字 Icon
  createDivIcon(className, htmlText) {
    return L.divIcon({
      className,
      html: htmlText,
    })
  }

  // ================== Layer Utility ====================

  // (Done) 將圖層增加到指定的圖層組中
  addLayerTo(addLayer, layerGroup) {
    addLayer.addTo(layerGroup)
  }

  // (Done) 取得指定圖層的 ID
  getLayerID(layerGroup, layer) {
    return layerGroup.getLayerId(layer)
  }

  // (Done) 從圖層組中移除單一圖層
  removeLayer(layerGroup, removeLayerID) {
    layerGroup.removeLayer(removeLayerID)
  }

  // (Done) 清除整個圖層組(只能放 createLayerGroup 的變數名)
  clearLayerGroup(layerGroup) {
    layerGroup.clearLayers()
  }

  // (Done) 監聽 leaflet 上物件或圖層相關事件
  on(object, event, callback) {
    object.on(event, callback)
  }

  // 刪除取消監聽
  off(object, event) {
    object.off(event)
  }

  // (Done) 設置(更新) layer(Marker) 的位置
  setLayerPosition(layer, latLng) {
    layer.setLatLng(latLng)
  }

  // ================== 測試與開發中的 function ==============

  // 類似 ForEach 跑遍每個圖層
  eachAllLayer(layer, callback) {
    layer.eachLayer(callback)
  }

  // 判斷點位是否在某個矩形面積裡面
  pointContainsRectangle(rectangle, latlng) {
    return rectangle.contains(latlng)
  }
}
