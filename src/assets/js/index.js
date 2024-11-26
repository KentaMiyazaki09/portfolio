import * as THREE from 'three';

// GUIここから
// import GUI from 'lil-gui'
// const gui = new GUI()

// let spotlightPos = {
//   x: 0,
//   y: 0,
//   z: 1,
// }
// gui.add(spotlightPos, 'x', 0, 100, 0.1)
// gui.add(spotlightPos, 'y', 0, 100, 0.1)
// gui.add(spotlightPos, 'z', -100, 100, 0.1)
// gui.onChange(() => {
//   directionalLight.position.set(0, 0, spotlightPos.z)
// })
// GUIここまで

function random (num, last=100) {
  return Math.random() * num * 2 - last
}

function easeOutQuad(x) {
  const b = 0; const c = 1; const d = 1
  return -c * (x /= d) * (x - 2) + b
}
function lerp(x, y, a) {
  return x + (y - x) * easeOutQuad(a)
}

// 慣性スクロールの値
let inertialScroll = 0
// 慣性スクロールのパーセント値(0~100)
let inertialScrollPercent = 0

/**
 * パーセントのスケール
 */
function scalePercent(start, end) {
  return (inertialScrollPercent - start) / (end - start);
}

let scene, camera, renderer
const animationScripts = [
  {
    start: 0,
    end: 100,
    func: () => {
      camera.position.z = lerp(100, 0, scalePercent(0, 100))
      camera.rotation.z = lerp(0, -Math.PI / 2, scalePercent(0, 100))
    }
  },
 ]

 /**
   * 慣性スクロールのためにスクロール値を取得する
   */
function setScrollPercent() {
  inertialScroll +=
    ((document.documentElement.scrollTop || document.body.scrollTop) - inertialScroll) * 0.08;

  // 慣性スクロールでのパーセント
  inertialScrollPercent = (inertialScroll / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight) * 100).toFixed(2)
  document.getElementById('percent').innerText = inertialScrollPercent
}

function playScrollAnimations() {
  animationScripts.forEach((item) => {
    if (inertialScrollPercent >= item.start && inertialScrollPercent < item.end) {
      item.func()
    }
  })
}

function addLight() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  scene.add(directionalLight)

  const spotLight = new THREE.SpotLight(0xffffff, 2, 0, Math.PI * 0.1, 0, 0.1)
  spotLight.position.set(0, 0, 1)
  scene.add(spotLight)
}
function addCamera ({ width, height }) {
  camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000)
  camera.position.set(0, 0, 0)
  camera.rotation.set(0, 0, 0)
}

function createBox () {
  // for(let i = 0; i < 1000; i++) {
  //   const geometry = new THREE.BoxGeometry(1, 1, 1)
  //   const material =  new THREE.MeshLambertMaterial({ color: 'rgb(225, 157, 115)' })
  //   const box =  new THREE.Mesh(geometry, material)

  //   const radian = i / 100 * Math.PI * 2
  //   const posX = 28 * Math.cos(radian)
  //   const posY = 28 * Math.sin(radian)
  //   const posZ = -10 + i * 0.1
  //   box.position.set(posX, posY, posZ)
  //   box.rotation.set(random(Math.PI*2), random(Math.PI*2), random(Math.PI*2))

  //   scene.add(box)
  // }
}

let sphere = null
let sphereColor = null
function createSphere() {
  // const geometry = new THREE.SphereGeometry(2, 32, 16)
  // const material = new THREE.MeshLambertMaterial({ color: 'rgb(144, 196, 255)' })
  // sphere = new THREE.Mesh(geometry, material)
  // sphere.name = 'blue sphere'
  // sphere.position.set(0, 0, -8)
  // scene.add(sphere)
}

const raycaster = new THREE.Raycaster()
let moveFlg = false
let mouse = null
// マウスの座標を記録
function getMousePos() {
  mouse = new THREE.Vector2()
  canvas.addEventListener('mousemove', (event) => {
    const element = event.currentTarget

    // canvas上のXY座標
    const x = event.clientX - element.offsetLeft
    const y = event.clientY - element.offsetTop

    // canvas要素の幅・高さ
    const w = element.offsetWidth
    const h = element.offsetHeight

    mouse.x = (x / w) * 2 - 1
    mouse.y = -(y / h) * 2 + 1
  })
}

// ホバーイベントをチェック
function checkHover(mouse, camera) {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  // blue sphereのマウスホバー
  if (intersects.length > 0 && intersects[0].object.name === 'blue sphere') {
    // moveFlg = true
    // sphere.material.color.setRGB(0, 0, 0.1)
  } else {
    moveFlg = false
    sphere.material.color.setRGB(sphereColor.r, sphereColor.g, sphereColor.b)
  }
}

// クリックイベントをチェック
function handleClick() {
  canvas.addEventListener('click', () => {
    // blue sphereのクリックイベント
    // if (moveFlg) {
    //   window.open('https://www.rhino-inc.jp/')
    // }
  })
}

function render() {
  checkHover(mouse, camera)
  renderer.render(scene, camera)
  setScrollPercent()
  window.requestAnimationFrame(render)
  // playScrollAnimations()
}

let canvas  = null
function init() {
  canvas = document.querySelector('#bg')
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x333333)

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    transparent: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  addCamera(canvas)
  addLight()

  createBox()
  // createSphere()

  sphereColor = {
    r: sphere.material.color.r,
    g: sphere.material.color.g,
    b: sphere.material.color.b,
  }

  getMousePos()

  handleClick()

  render()
}

window.addEventListener('load', init)