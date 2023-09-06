<template>
  <div class="relative">
    <ul class="onMapList">
      <li>
        <label
          for="drawMissionArea"
          :class="['onMapList-base', {'onMapList-base-action': mapStateIsDraw}]"
        >
          規劃任務
          <input
            id="drawMissionArea"
            v-model="mapStateIsDraw"
            type="checkbox"
            name="drawMissionArea"
            hidden
          >
        </label>
        <ul :class="['opMapList-content', { 'onMapList-content-action': mapStateIsDraw}]">
          <li>
            <label for="drawPolyline">
              <input
                id="drawPolyline"
                v-model="drawType.polyline"
                type="checkbox"
                name="draw"
              >
              {{ `${ drawType.polyline ? 'Drawing' : 'Not Draw' } Polyline` }}
            </label>
          </li>
          <li>
            <label for="drawPolygon">
              <input
                id="drawPolygon"
                v-model="drawType.polygon"
                type="checkbox"
                name="draw"
              >
              {{ `${ drawType.polygon ? 'Drawing' : 'Not Draw' } Polygon` }}
            </label>
          </li>
        </ul>
      </li>
      <li>
        <label
          for="setProductView"
          :class="['onMapList-base', {'onMapList-base-action': setProjectView}]"
        >
          設定專案範圍
          <input
            id="setProductView"
            v-model="setProjectView"
            type="checkbox"
            name="setProductView"
            hidden
          >
        </label>
        <ul :class="['opMapList-content', { 'onMapList-content-action': setProjectView}]">
          <li>
            <label for="NorthWest">
              <input
                id="NorthWest"
                v-model="viewLatlng.northWest"
                type="text"
                placeholder="NorthWest"
              >
            </label>
          </li>
          <li>
            <label for="NorthEast">
              <input
                id="NorthEast"
                v-model="viewLatlng.northEast"
                type="text"
                placeholder="NorthEast"
              >
            </label>
          </li>
          <li>
            <label for="SouthEast">
              <input
                id="SouthEast"
                v-model="viewLatlng.southEast"
                type="text"
                placeholder="SouthEast"
              >
            </label>
          </li>
          <li>
            <label for="SouthWest">
              <input
                id="SouthWest"
                v-model="viewLatlng.southWest"
                type="text"
                placeholder="SouthWest"
              >
            </label>
          </li>
        </ul>
      </li>
    </ul>
    <LeafletMap ref="refLeaflet" @get-porject-view="getPorjectView" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import LeafletMap from '../components/leafletMap.vue'

// 地圖元件
const refLeaflet = ref()

// 規劃任務
const mapStateIsDraw = ref(false)
const drawType = ref({
  polyline: false,
  polygon: false,
})

// 監聽"規劃任務" Toggle
watch(() => mapStateIsDraw.value, (newValue) => {
  if (newValue) {
    refLeaflet.value.clearMissionGroup()
  } else {
    drawType.value.polyline = false
    drawType.value.polygon = false
    refLeaflet.value.drawInspectionRecord()
  }
})

// 監聽"畫線"
watch(() => drawType.value.polyline, (newValue) => {
  if (newValue) {
    refLeaflet.value.drawVector('polyline')
  } else {
    refLeaflet.value.clearAssignLayer('clearPolyline')
  }
})

// 監聽"畫面"
watch(() => drawType.value.polygon, (newValue) => {
  if (newValue) {
    refLeaflet.value.drawVector('polygon')
  } else {
    refLeaflet.value.clearAssignLayer('clearPolygon')
  }
})


// 設定專案範圍
const setProjectView = ref(false)
const viewLatlng = ref({
  northWest: 'northWest',
  northEast: 'northEast',
  southEast: 'southEast',
  southWest: 'southWest',
})

watch(() => setProjectView.value, (newValue) => {
  if (newValue) {
    refLeaflet.value.setProjectView()
  } else {
    console.log('false')
  }
})

function getPorjectView(view) {
  viewLatlng.value.northWest = `${view.northWest.lat}, ${view.northWest.lng}`
  viewLatlng.value.northEast = `${view.northEast.lat}, ${view.northEast.lng}`
  viewLatlng.value.southEast = `${view.southEast.lat}, ${view.southEast.lng}`
  viewLatlng.value.southWest = `${view.southWest.lat}, ${view.southWest.lng}`
}

</script>
