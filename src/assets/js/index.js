import * as THREE from 'three';
import mv from "./_modules/_mv"

let scene, canvas, camera, renderer, cssrender
const addLight = () => {
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
  // scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
}
const addCamera = ({width, height}) => {
  camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000)
  camera.position.set(0, 0, 0)
  camera.rotation.set(0, 0, 0)
}

const createBox = () => {
  const geometry = new THREE.BoxGeometry(10, 8, 2)
  const material = new THREE.MeshLambertMaterial({ color: 'rgb(225, 157, 115)' })
  const box = new THREE.Mesh(geometry, material)
  box.position.set(0, 0, -8)
  box.rotation.set(0.2, -0.3, 0)

  scene.add(box)
}

const render = () => {
  renderer.render(scene, camera)
  // window.requestAnimationFrame(render)
}
const init = () => {
  scene = new THREE.Scene()
  canvas = document.querySelector('#mv-gallery')
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    transparent: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // light & camera
  addCamera(canvas)
  addLight()

  // オブジェクトの追加
  createBox()

  render()
}

window.onload = () => {
  init()
  mv()
}