import fakeImg from './damaged.jpg'
import photo from './test.png'

// 假資料
export const droneMission = (
  {
    dronId: 0,
    date: '2023/03/09',
    field: '台北大巨蛋',
    projectArea: [
      [25.043619800936977, 121.55766841104789],
      [25.043590640414752, 121.56183525624226],
      [25.041072009113723, 121.56194787377069],
      [25.041101170234835, 121.55752361372558],
    ],
    executor: '阿毛',
    type: '太陽能板巡檢',
    area: [
      [25.043148371607128, 121.55817867347544],
      [25.043133791290828, 121.560624082664],
      [25.041495924725133, 121.56057045526951],
      [25.041612568764837, 121.5580767814259],
    ],
    route: [
      [25.043124071078992, 121.55822273754457],
      [25.041840996354548, 121.55840518929654],
      [25.04308519022397, 121.55912426384822],
      [25.041670890743074, 121.5594247726161],
      [25.04301714869802, 121.56009018488787],
      [25.041879877604035, 121.56034776383174],
      [25.043153231712154, 121.5582012726326],
    ],
    events: [
      {
        id: 2023030901,
        time: '2023/03/09 16:00',
        type: '熱斑',
        level: 1,
        latlng: [25.041957099995543, 121.55846967605834],
        photo: fakeImg,
      },
      {
        id: 2023030902,
        type: '髒污',
        time: '22023/03/09 16:13',
        level: 2,
        latlng: [25.042379932521545, 121.55951072428996],
        photo: fakeImg,
      },
    ],
  }
)

// 疊圖資料
export const imageOnMap = {
  url: photo,
  latlngs: [
    [24.106796, 120.391040],
    [24.105104, 120.394714],
    [24.103096, 120.392441],
    [24.103090, 120.388858],
  ],
}
