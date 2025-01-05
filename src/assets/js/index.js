import * as THREE from 'three'
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as lil from 'lil-gui'

/**
 * UIデバッグ
 */
const gui = new lil.GUI()
gui.close()

/**
 * three
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

let scene, canvas, camera, renderer

/**
 * ライト
 */
const addLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(0.53, 0.56, 0.68)
  scene.add(directionalLight)

  const folderLight = gui.addFolder("Light")
  folderLight.add(directionalLight.position, 'x', -1, 1, 0.01)
  folderLight.add(directionalLight.position, 'y', -1, 1, 0.01)
  folderLight.add(directionalLight.position, 'z', -1, 1, 0.01)
}

/**
 * カメラ
 */
const addCamera = () => {
  camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.set(0, 0, 12)
}

/**
 * オブジェクト
 */
let meshes = []
const createMesh = () => {
  const material = new THREE.MeshPhysicalMaterial({
    color: '#1f80ff',
    metalness: 0.67,
    roughness: 0.43,
    flatShading: true,
  })

  gui.addColor(material, "color")
  gui.add(material, 'metalness', 0, 1, 0.01)
  gui.add(material, 'roughness', 0, 1, 0.01)

  const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
  const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material)
  const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)
  const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material)

  mesh1.position.set(2, 0, 0)
  mesh2.position.set(-1, 0, 0)
  mesh3.position.set(2, 0, -6)
  mesh4.position.set(5, 0, 3)

  scene.add(mesh1, mesh2, mesh3, mesh4)
  meshes.push(mesh1, mesh2, mesh3, mesh4)

  // パーティクル
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 700
  const positionArray = new Float32Array(particlesCount * 3)
  for(let i = 0; i < particlesCount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionArray, 3)
  )

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.025,
    color: '#ffffff'
  })
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)
}

// オブジェクト回転のトリガー
const triggers = {
  sec1: false,
  sec2: false,
  sec3: false,
  sec4: false,
}
const triggerKeys = Object.keys(triggers)
function setTrigger(rotationCos, rotationSin, targetName) {
  const cos = Math.round(rotationCos * 100)
  const sin = Math.round(rotationSin * 100)
  
  if (20 > cos && cos > -80 && 98 > sin && sin > 60 && !triggers[targetName]) {
    for(const key of triggerKeys) {
      if (key !== targetName) {
        document.querySelector(`#${key}`).classList.remove('is-active')
        triggers[key] = false
      }
    }

    document.querySelector(`#${targetName}`).classList.add('is-active')
    triggers[targetName] = true
  }
}

let speed = 0
let rotation = 0
function rot() {
  rotation += speed
  speed *= 0.93

  const rotationCos = Math.cos(rotation)
  const rotationSin = Math.sin(rotation)
  meshes[0].position.x = 2 + 3.8 * rotationCos
  meshes[0].position.z = -3 + 3.8 * rotationSin
  setTrigger(rotationCos, rotationSin, 'sec1')

  const rotation2 = rotation + Math.PI / 2
  const rotation2Cos = Math.cos(rotation2)
  const rotation2Sin = Math.sin(rotation2) 
  meshes[1].position.x = 2 + 3.8 * rotation2Cos
  meshes[1].position.z = -3 + 3.8 * rotation2Sin
  setTrigger(rotation2Cos, rotation2Sin, 'sec2')

  const rotation3 = rotation + Math.PI
  const rotation3Cos = Math.cos(rotation3)
  const rotation3Sin = Math.sin(rotation3) 
  meshes[2].position.x = 2 + 3.8 * Math.cos(rotation3)
  meshes[2].position.z = -3 + 3.8 * Math.sin(rotation3)
  setTrigger(rotation3Cos, rotation3Sin, 'sec3')

  const rotation4 = rotation + 3* (Math.PI / 2)
  const rotation4Cos = Math.cos(rotation4)
  const rotation4Sin = Math.sin(rotation4) 
  meshes[3].position.x = 2 + 3.8 * Math.cos(rotation4)
  meshes[3].position.z = -3 + 3.8 * Math.sin(rotation4)
  setTrigger(rotation4Cos, rotation4Sin, 'sec4')

  window.requestAnimationFrame(rot)
}

// マウスフリックイベント
let startPoint = 0
let endPoint = 0
window.addEventListener('mousedown', (event) => {
  startPoint = event.clientX
})
window.addEventListener('touchstart', (event) => {
  startPoint = event.touches[0].pageX
})
function handleSpeed(start, end) {
  speed += (start - end) * 0.0008
}
window.addEventListener('mouseup', (event) => {
  endPoint = event.clientX
  handleSpeed(startPoint, endPoint)
})
window.addEventListener('touchend', (event) => {
  endPoint = event.changedTouches[0].pageX
  handleSpeed(startPoint, endPoint)
})

// 描画
const clock = new THREE.Clock()
const render = () => {
  renderer.render(scene, camera)

  // 回転
  let getDeltaTime = clock.getDelta()
  for(const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltaTime
    mesh.rotation.y += 0.12 * getDeltaTime
  }

  window.requestAnimationFrame(render)
}

// 初期動作まとめ
const init = () => {
  scene = new THREE.Scene()
  canvas = document.querySelector('#bg-canvas')
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    transparent: true,
    preserveDrawingBuffer: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // light & camera
  addCamera()
  addLight()

  // オブジェクトの追加
  createMesh()

  render()

  rot()
}

// ロード
window.onload = () => {
  init()
}

// リサイズ
window.onresize = () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(window.devicePixelRatio)
}