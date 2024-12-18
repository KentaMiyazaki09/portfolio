import * as THREE from 'three'
// import mv from "./_modules/_mv"
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, canvas, camera, renderer
const addLight = () => {
  // const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  // directionalLight.position.set(1, 1, 1);
  // scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
}
const addCamera = ({width, height}) => {
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 100)
  camera.position.set(0, 0, 10)
  camera.rotation.set(0, 0, 0)
}

const createBox = () => {
  const geometry = new THREE.BoxGeometry(10, 8, 0.5)
  const loader = new THREE.TextureLoader()
  const texture = loader.load('assets/img/sample01.jpg')
  texture.colorSpace = THREE.SRGBColorSpace
  const material = [
    new THREE.MeshBasicMaterial({ color: 'rgb(225, 157, 115)' }),
    new THREE.MeshBasicMaterial({ color: 'rgb(225, 157, 115)' }),
    new THREE.MeshBasicMaterial({ color: 'rgb(225, 157, 115)' }),
    new THREE.MeshBasicMaterial({ color: 'rgb(225, 157, 115)' }),
    new THREE.MeshBasicMaterial({map: texture}),
    new THREE.MeshBasicMaterial({ color: 'rgb(225, 157, 115)' }),
  ]
  const box = new THREE.Mesh(geometry, material)
  box.position.set(0, 0, -8)
  box.rotation.set(0.4, -0.5, 0)

  scene.add(box)
}

const render = () => {
  renderer.render(scene, camera)
  // window.requestAnimationFrame(render)
}
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
  addCamera(canvas)
  addLight()

  // new OrbitControls(camera, canvas)

  // オブジェクトの追加
  createBox()

  render()
}

window.onload = () => {
  init()
  // mv()
}