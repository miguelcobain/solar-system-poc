/* global THREE */

const BASE_URL = '/images/';

export function createStarfield() {
  let texture = THREE.ImageUtils.loadTexture(`${BASE_URL}galaxy_starfield.png`);
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
  });
  let geometry = new THREE.SphereGeometry(100, 32, 32);
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export function createSun() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
  let texture = THREE.ImageUtils.loadTexture(`${BASE_URL}sunmap.jpg`);
  let material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export function createMercury() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
  let material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture(`${BASE_URL}mercurymap.jpg`),
    bumpMap: THREE.ImageUtils.loadTexture(`${BASE_URL}mercurybump.jpg`),
    bumpScale: 0.005
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export function createVenus() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
  let material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture(`${BASE_URL}venusmap.jpg`),
    bumpMap: THREE.ImageUtils.loadTexture(`${BASE_URL}venusbump.jpg`),
    bumpScale: 0.005
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export function createEarth() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
	let material = new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture(`${BASE_URL}earthmap1k.jpg`),
		bumpMap: THREE.ImageUtils.loadTexture(`${BASE_URL}earthbump1k.jpg`),
		bumpScale: 0.05,
		specularMap: THREE.ImageUtils.loadTexture(`${BASE_URL}earthspec1k.jpg`),
		specular: new THREE.Color('grey')
	});
	let mesh = new THREE.Mesh(geometry, material);
  mesh.add(createEarthCloud());
	return mesh;
}

export function createEarthCloud() {
  // create destination canvas
  let canvasResult = document.createElement('canvas');
  canvasResult.width = 1024;
  canvasResult.height	= 512;
  let contextResult	= canvasResult.getContext('2d');

  // load earthcloudmap
  let imageMap = new Image();
  imageMap.addEventListener('load', function() {

    // create dataMap ImageData for earthcloudmap
    let canvasMap	= document.createElement('canvas');
    canvasMap.width	= imageMap.width;
    canvasMap.height = imageMap.height;
    let contextMap = canvasMap.getContext('2d');
    contextMap.drawImage(imageMap, 0, 0);
    let dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

    // load earthcloudmaptrans
    let imageTrans = new Image();
    imageTrans.addEventListener('load', function() {
      // create dataTrans ImageData for earthcloudmaptrans
      let canvasTrans	= document.createElement('canvas');
      canvasTrans.width	= imageTrans.width;
      canvasTrans.height = imageTrans.height;
      let contextTrans = canvasTrans.getContext('2d');
      contextTrans.drawImage(imageTrans, 0, 0);
      let dataTrans	= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
      // merge dataMap + dataTrans into dataResult
      let dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
      for (let y = 0, offset = 0; y < imageMap.height; y++) {
        for (let x = 0; x < imageMap.width; x++, offset += 4) {
          dataResult.data[offset+0]	= dataMap.data[offset+0];
          dataResult.data[offset+1]	= dataMap.data[offset+1];
          dataResult.data[offset+2]	= dataMap.data[offset+2];
          dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0];
        }
      }
      // update texture with result
      contextResult.putImageData(dataResult, 0, 0);
      material.map.needsUpdate = true;
    });
    imageTrans.src = `${BASE_URL}earthcloudmaptrans.jpg`;
  }, false);
  imageMap.src = `${BASE_URL}earthcloudmap.jpg`;

  let geometry = new THREE.SphereGeometry(0.51, 32, 32);
  let material = new THREE.MeshPhongMaterial({
    map: new THREE.Texture(canvasResult),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export function createMars() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
	let material = new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture(`${BASE_URL}marsmap1k.jpg`),
		bumpMap: THREE.ImageUtils.loadTexture(`${BASE_URL}marsbump1k.jpg`),
		bumpScale: 0.05
	});
	let mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

export function createJupiter() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
	let texture	= THREE.ImageUtils.loadTexture(`${BASE_URL}jupitermap.jpg`);
	let material = new THREE.MeshPhongMaterial({
		map: texture,
		bumpMap: texture,
		bumpScale: 0.02
	});
	let mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

export function createSaturn() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
	let texture	= THREE.ImageUtils.loadTexture(`${BASE_URL}saturnmap.jpg`);
	let material = new THREE.MeshPhongMaterial({
		map: texture,
		bumpMap: texture,
		bumpScale: 0.05
	});
	let mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
	mesh.castShadow	= true;
  let ring = createSaturnRing();
	ring.receiveShadow = true;
	ring.castShadow	= true;
	mesh.add(ring);
	return mesh;
}

export function createSaturnRing() {
  // create destination canvas
  let canvasResult = document.createElement('canvas');
  canvasResult.width = 915;
  canvasResult.height	= 64;
  let contextResult	= canvasResult.getContext('2d')	;

  // load earthcloudmap
  let imageMap = new Image();
  imageMap.addEventListener('load', function() {

    // create dataMap ImageData for earthcloudmap
    let canvasMap	= document.createElement('canvas');
    canvasMap.width	= imageMap.width;
    canvasMap.height = imageMap.height;
    let contextMap = canvasMap.getContext('2d');
    contextMap.drawImage(imageMap, 0, 0);
    let dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

    // load earthcloudmaptrans
    let imageTrans = new Image();
    imageTrans.addEventListener('load', function() {
      // create dataTrans ImageData for earthcloudmaptrans
      let canvasTrans	= document.createElement('canvas');
      canvasTrans.width	= imageTrans.width;
      canvasTrans.height = imageTrans.height;
      let contextTrans = canvasTrans.getContext('2d');
      contextTrans.drawImage(imageTrans, 0, 0);
      let dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
      // merge dataMap + dataTrans into dataResult
      let dataResult = contextMap.createImageData(canvasResult.width, canvasResult.height);
      for (let y = 0, offset = 0; y < imageMap.height; y++) {
        for (let x = 0; x < imageMap.width; x++, offset += 4) {
          dataResult.data[offset+0]	= dataMap.data[offset+0];
          dataResult.data[offset+1]	= dataMap.data[offset+1];
          dataResult.data[offset+2]	= dataMap.data[offset+2];
          dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0] / 4;
        }
      }
      // update texture with result
      contextResult.putImageData(dataResult,0,0);
      material.map.needsUpdate = true;
    });
    imageTrans.src = `${BASE_URL}saturnringpattern.gif`;
  }, false);
  imageMap.src = `${BASE_URL}saturnringcolor.jpg`;

  let geometry = new THREE.RingGeometry(0.65, 1.05, 64);
  let material = new THREE.MeshPhongMaterial({
    map: new THREE.Texture(canvasResult),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.lookAt(new THREE.Vector3(0.5, 4, 1));
  return mesh;
}

export function createUranus() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
  let texture	= THREE.ImageUtils.loadTexture(`${BASE_URL}uranusmap.jpg`);
  let material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export function createNeptune() {
  let geometry = new THREE.SphereGeometry(0.5, 32, 32);
  let texture	= THREE.ImageUtils.loadTexture(`${BASE_URL}neptunemap.jpg`);
  let material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

export default {
  createStarfield,
  createSun,
  createMercury,
  createVenus,
  createEarth,
  createMars,
  createJupiter,
  createSaturn,
  createUranus,
  createNeptune
};