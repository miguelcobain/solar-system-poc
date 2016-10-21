import Ember from 'ember';
import { ParentMixin } from 'ember-composability-tools';
import { createStarfield } from '../utils/gods-toolset';
const { Component, run } = Ember;
/* global THREE */

export default Component.extend(ParentMixin, {

  classNames: ['universe'],

  didInsertParent() {
    this._super(...arguments);
    this.initScene();
  },

  didRender() {
    this._super(...arguments);
    this.draw();
    //render children
  },

  draw() {
    requestAnimationFrame(() => this.draw());

    this.get('childComponents').invoke('animate');

    this.renderer.render(this.scene, this.camera);
    this.cssRenderer.render(this.cssScene, this.camera);
  },

  initScene() {
    let cssRenderer = this.cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(this.element.offsetWidth, this.element.offsetHeight);
    cssRenderer.domElement.style.position	= 'absolute';
    cssRenderer.domElement.style.top	= 0;
    cssRenderer.domElement.style.margin	= 0;
    cssRenderer.domElement.style.padding	= 0;
    this.element.appendChild(cssRenderer.domElement);
    this.cssScene = new THREE.Scene();

    let renderer = this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(this.element.offsetWidth, this.element.offsetHeight);
    renderer.shadowMap.enabled	= true;
    this.element.appendChild(renderer.domElement);

    let scene = this.scene = new THREE.Scene();
    let camera = this.camera = new THREE.PerspectiveCamera(45, this.element.offsetWidth / this.element.offsetHeight, 0.01, 150);
    camera.position.z = 4;
    camera.position.y = -0.5;

    // LET THERE BE LIGHT!
    let ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    let light	= new THREE.DirectionalLight(0xffffff, 1);
  	light.position.set(5,5,5);
  	scene.add(light);
  	light.castShadow = true;
  	light.shadow.camera.near = 0.01;
  	light.shadow.camera.far	= 15;
  	light.shadow.camera.fov	= 45;
  	light.shadow.camera.left = -1;
  	light.shadow.camera.right	= 1;
  	light.shadow.camera.top	= 1;
  	light.shadow.camera.bottom = -1;
  	// light.shadowCameraVisible = true
  	light.shadow.bias = 0.001;
  	light.shadow.darkness = 0.2;
  	light.shadow.mapSize.width = 1024;
  	light.shadow.mapSize.height	= 1024;

    // AND THEN HE CREATED THE STARS
    let starSphere = createStarfield();
    scene.add(starSphere);

    window.addEventListener('resize', run.bind(this, this.onWindowResize), false);
  },

  onWindowResize() {
    this.camera.aspect = this.element.offsetWidth / this.element.offsetHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.element.offsetWidth, this.element.offsetHeight);
		this.cssRenderer.setSize(this.element.offsetWidth, this.element.offsetHeight);
  }

});
