<template>
  <div v-show="modalShow" class="mask">
    <div class="modal">
      <div class="modal-header">
        <button @click="toggleModal">X</button>
      </div>
      <div ref="refModalBody" class="modal-body">
        <!-- <img :src="props.imageUrl" alt=""> -->
        <canvas id="photoCanvas" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
    default: '',
  },
})

// defineExpose：將此元件的 function 暴露出去(父層才能呼叫使用)
defineExpose({
  toggleModal,
})

// Image Show Toggle
const modalShow = ref(false)
function toggleModal() {
  modalShow.value = !modalShow.value
  if (modalShow.value) {
    nextTick(() => {
      drawMark()
    })
  }
}

// Canvas [方法二：使用者手動自己標示]
// 1. 基本功能已完成，待討論照片大小問題再繼續做編輯過後的照片儲存功能。
// 2. 之後要改成 slide 方式呈現。
const refModalBody = ref(null)
function drawMark() {
  // 建立 Canvas 物件，並將寬高設定跟父層一樣
  const canvas = document.getElementById('photoCanvas')
  const ctx = canvas.getContext('2d')
  canvas.width = refModalBody.value.scrollWidth
  canvas.height = refModalBody.value.scrollHeight

  // 產生 eventPhoto 的 img 並帶入到 Canvas 中
  const img = new Image()
  img.src = props.imageUrl
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }

  // 設定筆畫顏色與寬度
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 2

  // 針對 User 畫的動作建立相對監聽並執行相對 function
  let isPainting = false
  let startX, startY, width, height
  const marks = []
  canvas.addEventListener('mousedown', startPaint)
  canvas.addEventListener('mousemove', paint)
  canvas.addEventListener('mouseup', stopPaint)
  function startPaint(e) {
    isPainting = true
    startX = e.clientX - canvas.offsetLeft
    startY = e.clientY - canvas.offsetTop
  }
  function paint(e) {
    if (!isPainting) return

    const currentX = e.clientX - canvas.offsetLeft
    const currentY = e.clientY - canvas.offsetTop
    width = currentX - startX
    height = currentY - startY

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    marks.forEach((item) => {
      ctx.strokeRect(item[0], item[1], item[2], item[3])
    })
    ctx.strokeRect(startX, startY, width, height)
  }
  function stopPaint() {
    isPainting = false
    marks.push([startX, startY, width, height])
  }
}

</script>
