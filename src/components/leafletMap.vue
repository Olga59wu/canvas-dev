<template>
  <div id="CSIMap" />
  <ImageFrame
    ref="refImageFrame"
    :image-url="imageUrl"
  />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { CSIMap } from '../script/CSIMap'
import {
  projectAreaOption,
  missionAreaOption,
  missionRouteOption,
  drawPolylineStyle,
  drawPolygonStyle,
} from '../script/leafletOption'
import { droneMission, imageOnMap } from '../fake/mission'
import ImageFrame from '../components/ImageFrame.vue'

// 存放 CSIMap 物件
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

// 暴露出去給父層使用
defineExpose({
  drawInspectionRecord,
  drawVector,
  setProjectView,
  clearAssignLayer,
  clearMissionGroup,
})

const emit = defineEmits(['getPorjectView'])

onMounted(() => {
  initMap(setMapOption)
  drawInspectionRecord(droneMission)
  // initImage(imageOnMap.url, imageOnMap.latlngs)
  // 測試
  getLayerInfo()
})

// 使用 CSIMap 模組：建立 Map 物件
function initMap(setMap) {
  LMap = new CSIMap('CSIMap', setMap.mapOption, setMap.mapView, setMap.mapSource)
  // 增加 Scale
  const scale = LMap.setScale({
    imperial: false,
  })
  LMap.addLayerTo(scale, LMap.map)
  LMap.setZoomPosition('bottomright')
}

// 使用 CSIMap 模組：製作畫出任務紀錄相關資訊
function drawInspectionRecord(record = droneMission) {
  const layer = {
    projectArea: record.projectArea,
    area: record.area,
    route: record.route,
    events: record.events,
  }
  const setRecordLayer = {
    projectAreaStyle: projectAreaOption,
    routeStyle: missionRouteOption,
    areaStyle: missionAreaOption,
    eventMarker: {
      option: {},
      popupContent: function(event) {
        const content = `<img id="eventPhoto" class="cursor-pointer" src="${event.photo}" alt="${event.photo}">
        <p>拍攝時間：${event.time}</p>
        <p>座標：${event.latlng[0]}, ${event.latlng[1]}</p>
        <p>類型：${event.type}</p>
        <p>處理等級：L${event.level}</p>`
        return content
      },
    },
  }
  const recordLayer = LMap.drawRecord(layer, setRecordLayer)
  setOpenLargeImageModel(recordLayer)
  // 匯入專案範圍後取得 View 的四個邊界角經緯度。
  const bounds = LMap.getViewBoundsLatLng(LMap.map)
  // console.log('目前四個邊界角經緯度  >>>', bounds)
}

// ================= 這兩個 function 之後要何在一起 ======================
// 將 Event Marker 加上點擊 Popup 裡的 img 後開啟大圖模式
function setOpenLargeImageModel(recordLayer) {
  const layerIDs = Object.keys(recordLayer._layers)
  let eventMarkers = null
  layerIDs.forEach((layer) => {
    if (Number(layer) === LMap.recordLayerID.event) {
      eventMarkers = recordLayer._layers[layer]._layers
    }
  })
  if (eventMarkers !== null) {
    const tempArray = Object.keys(eventMarkers)
    tempArray.forEach((key) => {
      const temp = eventMarkers[key]._popup._content
      const photo = temp.split(' ')[3].slice(5, -1)
      popupOpenImageFrame(eventMarkers[key], photo)
    })
  }
}

// 建立 leaflet 監聽，並監聽動作開啟 Imageframe 元件
let imageUrl = ref('')
const refImageFrame = ref()
function popupOpenImageFrame(marker, photo) {
  LMap.on(marker, 'popupopen', () => {
    const image = document.getElementById('eventPhoto')
    image.addEventListener('click', () => {
      refImageFrame.value.toggleModal()
      imageUrl.value = photo
    })
  })
}

// ================= 這兩個 function 之後要合在一起 ======================

// 使用 CSIMap 模組：畫線 or 畫範圍
function drawVector(vectorType) {
  LMap.off(LMap.map, 'click')
  switch (vectorType) {
    case 'polyline':
      LMap.endPolygon()
      LMap.startPolyline()
      LMap.setPolylineStyle(drawPolylineStyle)
      break
    case 'polygon':
      LMap.endPolyline()
      LMap.startPolygon()
      LMap.setPolygonStyle(drawPolygonStyle)
      break
  }
  LMap.setIconNumberStyle('numberIcon')
  LMap.on(LMap.map, 'click', (e) => {
    LMap.drawing(e.latlng)
  })
}

// 使用 CSIMap 模組：清除指定的 Draw 圖層
function clearAssignLayer(layer) {
  let removeLayerID = null
  switch (layer) {
    case 'clearPolyline':
      removeLayerID = LMap.drawLayer.polyline.layer._leaflet_id
      break
    case 'clearPolygon':
      removeLayerID = LMap.drawLayer.polygon.layer._leaflet_id
      break
  }
  LMap.clearAssignDrawLayer(removeLayerID)
}

// 使用 CSIMap 模組：清除整個任務圖層
function clearMissionGroup() {
  LMap.clearLayerGroup(LMap.layerGroup)
}

// 使用 CSIMap 模組：將圖片疊在地圖上
function initImage(img, imageBounds) {
  const photo = LMap.addImageOverlay(img, imageBounds)
  LMap.addLayerTo(photo, LMap.map)
  LMap.setFlyTo(imageBounds)
}

const view = ref({})
watch(() => view.value, (newValue) => {
  emit('getPorjectView', newValue)
})
// 使用 CSIMap 模組：設定並取得由使用者框出的專案可視範圍經緯度
function setProjectView() {
  LMap.on(LMap.map, 'boxzoomend', (e) => {
    const projectView = LMap.getViewBoundsLatLng(e)
    view.value = projectView
  })
}

// ===================== 測試與開發中的 ====================

// 取得被點取的 Polygon ID 並更改 Color
function getLayerInfo() {
  let clickPolygonID = null
  LMap.eachAllLayer(LMap.layerGroup, (layer) => {
    LMap.on(layer, 'click', (e) => {
      clickPolygonID = e.target._leaflet_id
      console.log(clickPolygonID)
      layer.setStyle({
        color: '#EC7F00',
        fillOpacity: 0.5,
      })
    })
  })
}

// ===================== 測試 Marker 移動(之後開發 RealTime 時可拿來參考) ======================
function droneMove(route) {
  const drone = LMap.createdMarker(route[0])
  LMap.addLayerTo(drone, LMap.map)
  route.forEach((item, index) => {
    setTimeout(() => {
      LMap.setLayerPosition(drone, item)
    }, 1000 * index)
  })
}

</script>

<style>
#CSIMap{
  width: 100vw;
  height: 100vh;
}
.dashLines {
  stroke-dasharray: 10;
}

/* 數字 Icon */
.numberIcon{
  width: 25px !important;
  height: 25px !important;
  color: #fff;
  background: #3360FF;
  border: 4px solid #fff;
  border-radius: 100%;
  margin-left: -12px !important;
  margin-top: -12px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
