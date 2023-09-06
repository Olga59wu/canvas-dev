# CSI Map - Leaflet

在使用前要先 npm install leaflet@1.9.3，並將 CSIMap.js 與 leafletModule.js 兩支 js 檔放到要使用的專案裡面。

## How to use in Vite

Init Map：
```
// ================== Template =================

<div id="CSIMap" />

// ==================== Vue ====================

import { CSIMap } from '../script/CSIMap'

let LMap = null

// 地圖初始化各種設定
const setMapOption = {
  // 地圖其他設定選項
  mapOption: {},
  // 地圖初始可視範圍
  mapView: {
    viewCenter: [23.689804541429606, 120.91993590267593],
    zoom: 8,
  },
  // 地圖圖資來源(以 Google 圖資為例)
  mapSource: {
    url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    option: {
      crossOrigin: true,
      maxZoom: 20, // 地圖最大縮放級別。
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], // 設定上方 url 中的 {s} 這個參數
      attribution: 'Map data: © Google Maps',
    },
  },
}

onMounted(() => {
  initMap(setMapOption)
})

function initMap(setMap) {
  LMap = new CSIMap('CSIMap', setMap.mapOption, setMap.mapView, setMap.mapSource)
}

// ================== CSS ====================

#CSIMap{
  width: 100vw;
  height: 100vh;
}
```

## API

### leaflet 基本功能 (LeafletModule.js)
#### Map Base & Raster Layer Set (地圖基本設定 & 柵格圖層設定)：

* 設定圖資瓦片圖層來源
   ```
   const GMap = LMap.setTileLayer(mapData, option)
   ```
   參數：
   mapData (String)：圖資檔案來源 url
   (選擇) option (Object)： 其他設定(設定種類太多，之後再補上)
   
---

* 加入圖片疊在 Map 上
  ```
  const imgLayer = LMap.addImageOverlay(imgUrl, imageBounds)
  ```
  參數：
  imgUrl (String)：要疊的圖片 url
  imageBounds (Array)：圖片放置的經緯度位置。EX：[[latlng], [latlng], [latlng], [latlng], ....]

---


* 設定　Map's View & Zoom
  ```
  LMap.setView(center, zoom)
  ```
  參數：
  center (Array)：View 的中心點位置。EX：[lat, lng]
  zoom (Number)：鏡頭放大或縮小級數。

---

* 設置 Zoom Control 在畫面上的位置
   ```
   LMap.setZoomPosition(position)
   ```
   參數：
   position (String)：只能使用 **'topleft'、'topright'、'bottomleft'、'bottomright'** 四個值

---

* 設置比例尺(Scale)
   ```
   LMap.setScale(option)
   ```
   參數：
   (選擇) option (Object)：
   
   | Option            | Type     | Default  |
   | --------          | -------- | -------- |
   | maxWidth          | Number   | 100      |
   | metric   (m/km)   | Boolean  | True     |
   | imperial (mi/ft)  | Boolean  | True     |
   | updateWhenIdle    | Boolean  | False    |

---

*  Map 移動到指定的可視範圍
   ```
   LMap.setFlyTo(latLngs, option)
   ```
   參數：
   latLngs (Array)：經緯度，可單一點經緯度或一個面的經緯度。
   (選擇) option (Object)： 其他設定(設定種類太多，之後再補上)

---

#### Vector Layer (向量圖層)：

* 建立 Circle
   ```
   LMap.createCircle(latLng, option)
   ```
   參數：
   latLng (Array)：經緯度，單一點經緯度。
   (選擇) option (Object)： 其他設定(設定種類太多，之後再補上)
   
---
   
*  建立 Marker
   ```
   LMap.createdMarker(latLng, option)
   ```
   參數：
   latLng (Array)：經緯度，單一點位經緯度。
   (選擇) option (Object)： 其他設定(設定種類太多，之後再補上)

---

*  建立 Polyline
   ```
   LMap.createdPolyline(latLngs, option)
   ```
   參數：
   latLngs (Array)：經緯度，需要兩個點位以上。EX：[[latlng], [latlng], [latlng], [latlng], ....]
   (選擇) option (Object)： 其他設定(設定種類太多，之後再補上)

---

*  建立 Polygon
   ```
   LMap.createdPolygon(latLngs, option)
   ```
   參數：
   latLngs (Array)：經緯度，需要三個點位以上。EX：[[latlng], [latlng], [latlng], [latlng], ....]
   (選擇) option (Object)： 其他設定(設定種類太多，之後再補上)

---

#### Other Layer (其他圖層)：

* 建立空的 layer Group (圖層組)
  ```
  const layerGrouo = LMap.createLayerGroup(addLayer)
  ```
  參數：
  (選擇) addLayer(layer)： 可預設先帶一組圖層。

---

*  將 popup 綁定到指定圖層物件上
   ```
   LMap.addPopupToLayer(layer, content)
   ```
   參數：
   layer (layer)：要加上 popup 的圖層。
   content (String)：popup 上要顯示的內容，以 HTML 格式編輯內容。
    
---

*  設置文字 Icon
   ```
   const numberIcon = createDivIcon(className, htmlText)
   ```
   參數：
   className (String)：用 CSS Class 設定 Style。
   htmlText (String)：設定要顯示的 Icon 內容

---

#### Layer Utility (圖層共用方法)：

* 將圖層增加到指定的圖層組中
  ```
  LMap.addLayerTo(addLayer, layerGroup)
  ```
  參數：
  addLayer (layer)：要加入的圖層。
  layerGroup (layer)：要被增加的圖層組。

---

* 取得指定圖層的 ID
  ```
  const layerID = LMap.getLayerID(layerGroup, layer)
    
  console.log(layerID) // 12 (Number)
  ```
  參數：
  layerGroup (layer)：欲要取得 layerID 圖層目標所在位置。
  layer (layer)：要取得的目標圖層。

---

* 從圖層組中移除單一圖層
  ```
  LMap.removeLayer(layerGroup, removeLayerID)
  ```
  參數：
  layerGroup (layer)：要移除的圖層所在位置(某個圖層組)。
  removeLayerID (Number)：要移除的圖層 ID。

---

* 清除整個圖層組
  ```
  LMap.clearLayerGroup(layerGroup)
  ```
  參數：
  layerGroup (layer)：要移除的圖層組。

---

* 監聽 leaflet 上物件或圖層相關事件
  ```
  LMap.on(layer, event, callback)
  ```
  參數：
  layer (layer)：被監聽的圖層或 leaflet 物件。
  event (String)：監聽的事件。
  callback (Fn)：要執行的 function 程式碼。

---

* 設置(更新) layer(Marker) 的位置
  ```
  LMap.setLayerPosition(layer, latLng)
  ```
  參數：
  layer (layer)： 指定要設置或更新的圖層。
  latlng (Array)：經緯度。[xxxx, xxxx]

---

### 功能模組 (CSIMap.js)
#### Init Map
* 設定初始地圖 & 圖資
  ```
  LMap = new CSIMap(mapContainerID, mapOption, setMapView, mapDataSource)
  ```
  參數：
  mapContainerID (String)：要存放 Map 的 DOM 元素 ID。
  (選擇) mapOption (Object)：針對 Map 的相關設定。(之後補上)
  setMapView (Object)：設定 Map 初始可視範圍。
  ```
  setMapView: {
    viewCenter: [lat, lng],
    zoom: 1 ~ 23, (Number)
  }
  ```
  mapDataSource (Object)：Map 圖資來源與相關設定
  ```
  mapDataSource: {
      url: `http://{s}.xxxxxxx/xxx/xx`,
      option: {
          針對圖資的相關設定，之後再補上
      }
  }
  ```
---

#### 畫巡檢紀錄

* 畫出巡檢任務紀錄
  ```
  const recordLayer = LMap.drawRecord(record, option)
  ```
  參數：
  record (Object)：任務紀錄各圖層的經緯度。
  ```
  record: {
    projectArea　(Array)：專案範圍經緯度。EX:[[lat, lng], [lat, lng]...]
    area (Array)：巡檢範圍經緯度。EX:[[lat, lng], [lat, lng]...]
    route (Array)：巡檢路徑經緯度。EX:[[lat, lng], [lat, lng]...]
    events (Array > Object)：巡檢事件資訊。EX:[{}, {}, {}]
  }
  ```
  option: 針對各個圖層的 Style 設定與 Marker 的 popup 設定
  ```
  option: {
      projectAreaStyle (Object): 針對專案範圍 Style 的設定 (屬性之後再補上)
      routeStyle (Object): 針對巡檢範圍 Style 的設定 (屬性之後再補上)
      areaStyle (Object): 針對巡檢路徑 Style 的設定 (屬性之後再補上)
      eventMarker (Object): {
          option: {} 針對 Marker 的相關設定
          popupContent: function(event) {
              const content = `....放 popupContent 的內容(HTML String)`
              return content
          }
      }
  }
  ```
  
---  
  
#### 手繪計畫範圍與路線

* 開始畫線(路徑)
  ```
  LMap.startPolyline()
  ```
* 開始畫矩形(範圍)
  ```
  LMap.startPolygon()
  ```
* 手動畫點、線、面 (Drawing)
  ```
  LMap.drawing(latlng, iconStyle)
  
  // Use EX:
  LMap.on(LMap.map, 'click', (e) => {
      LMap.drawing(e.latlng)
  })
  ```
  參數：
  latlng (Array)：單一點的經緯度。EX：[xxxx, xxxx]
  iconStyle (String)：設定 Icon 的 Style。
  
* 設定 Point Style
  ```
  LMap.setPointStyle(style)
  ```
  參數：
  style (Object)：(設定種類太多，之後再補上)

* 設定 Polyline Style
  ```
  LMap.setPolylineStyle(style)
  ```
  參數：
  style (Object)：(設定種類太多，之後再補上)

* 設定 Polygon style
  ```
  LMap.setPolygonStyle(style)
  ```
  參數：
  style (Object)：(設定種類太多，之後再補上)
  
* 結束畫線
  ```
  LMap.endPolyline()
  ```

* 結束畫範圍
  ```
  LMap.endPolygon()
  ```

---

#### 取得經緯度

* 取得 View 的四個角落經緯度
  ```
  const boundsLatLng = LMap.getViewBoundsLatLng(layer)
  
  console.log(boundsLatLng)
  // boundsLatLng = {
  //   northWest: Latlng
  //   northEast: Latlng
  //   southEast: Latlng
  //   southWest: Latlng
  // }
  ```
  參數：
  layer (layer)：要取得邊界的圖層。
  
  ---
  
#### 客制 Marker Layer
* 製作具有文字的 Circle Marker
  ```
  const numberIcon = createNumberCircle(latLng, number, iconStyle)
  ```
  參數：
  latLng (Array)：經緯度。
  number (String)：要顯示的文字或數字。
  iconStyle (String)：使用 CSS Class 設定 Style。
  
  ---