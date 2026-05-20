/* Three.js animated hero background — floating geometry + particles */
(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf6f4ee, 7, 22);

  const camera = new THREE.PerspectiveCamera(58, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearColor(0x000000, 0);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight(0x1f5d43, 0.95);
  keyLight.position.set(6, 5, 8);
  scene.add(keyLight);
  const rim = new THREE.DirectionalLight(0x9fb8a5, 0.8);
  rim.position.set(-6, -3, 4);
  scene.add(rim);

  // Materials
  const matEmerald = new THREE.MeshStandardMaterial({ color: 0x1f5d43, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0.85 });
  const matSage = new THREE.MeshStandardMaterial({ color: 0x9fb8a5, roughness: 0.55, metalness: 0.05, transparent: true, opacity: 0.78 });
  const matGold = new THREE.MeshStandardMaterial({ color: 0xb4894a, roughness: 0.3, metalness: 0.3, transparent: true, opacity: 0.7 });
  const matIvory = new THREE.MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.7, metalness: 0, transparent: true, opacity: 0.85 });

  // Shapes
  const shapes = [];
  const geoms = [
    new THREE.IcosahedronGeometry(0.9, 0),
    new THREE.TorusGeometry(0.7, 0.18, 16, 60),
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.TetrahedronGeometry(0.85, 0),
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    new THREE.TorusKnotGeometry(0.45, 0.14, 80, 16),
  ];
  const mats = [matEmerald, matSage, matGold, matIvory];

  const layout = [
    { x: -4.2, y:  1.6, z: -1, scale: 1.2 },
    { x:  4.4, y:  1.2, z: -2, scale: 1.4 },
    { x: -3.0, y: -1.8, z:  0, scale: 0.9 },
    { x:  3.6, y: -1.6, z:  1, scale: 1.0 },
    { x:  0.2, y:  2.4, z: -3, scale: 1.6 },
    { x: -1.8, y: -0.2, z:  1, scale: 0.75 },
    { x:  2.2, y: -0.4, z: -1, scale: 0.85 },
  ];

  for (let i = 0; i < layout.length; i++) {
    const g = geoms[i % geoms.length];
    const m = mats[i % mats.length];
    const mesh = new THREE.Mesh(g, m);
    const c = layout[i];
    mesh.position.set(c.x, c.y, c.z);
    mesh.scale.setScalar(c.scale);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      rs: { x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.004 },
      bob: Math.random() * Math.PI * 2,
      bobSpeed: 0.0008 + Math.random() * 0.0009,
      bobAmp: 0.15 + Math.random() * 0.25,
      basePos: { x: c.x, y: c.y, z: c.z },
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Particles
  const particleCount = 320;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
  }
  const pGeom = new THREE.BufferGeometry();
  pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x1f5d43,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeom, pMat);
  scene.add(particles);

  // Mouse parallax
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // Resize
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * window.devicePixelRatio || canvas.height !== h * window.devicePixelRatio) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }
  window.addEventListener('resize', resize);

  // Loop
  let t = 0;
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function loop() {
    resize();
    t++;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;

    for (const s of shapes) {
      s.rotation.x += s.userData.rs.x + 0.001;
      s.rotation.y += s.userData.rs.y + 0.001;
      s.userData.bob += s.userData.bobSpeed * 16;
      s.position.y = s.userData.basePos.y + Math.sin(s.userData.bob) * s.userData.bobAmp;
      s.position.x = s.userData.basePos.x + mouse.x * (s.userData.basePos.z * 0.1 + 0.2);
    }

    particles.rotation.y = t * 0.0004 + mouse.x * 0.3;
    particles.rotation.x = mouse.y * 0.3;

    camera.position.y = -scrollY * 0.0014 + mouse.y * 0.6;
    camera.position.x = mouse.x * 0.8;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
})();
