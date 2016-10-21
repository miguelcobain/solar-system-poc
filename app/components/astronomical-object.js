import Ember from 'ember';
import { ChildMixin, RenderBlockMixin } from 'ember-composability-tools';
import godsToolset from '../utils/gods-toolset';
const { Component, computed, assert, String: { classify } } = Ember;
/* global THREE */

export default Component.extend(ChildMixin, RenderBlockMixin, {

  tagName: '',
  shouldRender: true,

  didReceiveAttrs({ newAttrs }) {
    this._super(...arguments);
    if (newAttrs.name && this.mesh) {
      // name has changed. simulate a rerender
      this.willRemoveParent();
      this.didInsertParent();
    }
  },

  didInsertParent() {
    this.mesh = this.createMesh();

    let scene = this.get('parentComponent').scene;
    scene.add(this.mesh);

    let cssScene = this.get('parentComponent').cssScene;

    let element = this.get('destinationElement');
    element.className = 'object-name';
    /*var element = document.createElement('div');
		element.style.width = '480px';
		element.style.height = '360px';
		element.style.backgroundColor = '#000';
		var iframe = document.createElement('iframe');
		iframe.style.width = '480px';
		iframe.style.height = '360px';
		iframe.style.border = '0px';
		iframe.src = 'http://learningthreejs.com';
		element.appendChild(iframe);*/

    let cssObject = new THREE.CSS3DObject(element);
    // we reference the same position and rotation
    cssObject.position.set(0, -50, -1240);
		cssObject.rotation.y = 0;
    // add it to the css scene
    cssScene.add(cssObject);

  },

  willRemoveParent() {
    this.get('parentComponent').scene.remove(this.mesh);
  },

  methodName: computed('name', function() {
    let name = this.get('name');
    return `create${classify(name)}`;
  }),

  createMesh() {
    let methodName = this.get('methodName');
    assert('Please provide a valid `name` property.', godsToolset[methodName]);
    return godsToolset[methodName]();
  },

  animate() {
    this.mesh.rotation.y -= 0.001;
  }
});
