import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

function LuxuryBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const sphereGeometry = new THREE.SphereGeometry(2.4, 48, 48);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x111827,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const pointsGeometry = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i < 700; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.4 + (Math.random() - 0.5) * 0.15;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      points.push(x, y, z);
    }
    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
    });
    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointCloud);

    const gridGeometry = new THREE.BufferGeometry();
    const gridVertices = [];
    const gridSize = 18;
    const step = 0.9;
    for (let x = -gridSize; x <= gridSize; x += step) {
      for (let z = -gridSize; z <= gridSize; z += step) {
        gridVertices.push(x * 0.06, -3.8, z * 0.06);
      }
    }
    gridGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(gridVertices, 3)
    );
    const gridMaterial = new THREE.PointsMaterial({
      color: 0x1e293b,
      size: 0.02,
      transparent: true,
      opacity: 0.8,
    });
    const gridPoints = new THREE.Points(gridGeometry, gridMaterial);
    scene.add(gridPoints);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x38bdf8, 0.8, 0, 2);
    pointLight.position.set(4, 3, 6);
    scene.add(pointLight);
    const warmLight = new THREE.PointLight(0xfbbf24, 0.7, 0, 2);
    warmLight.position.set(-4, -3, 6);
    scene.add(warmLight);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      sphere.rotation.y = t * 0.12;
      sphere.rotation.x = Math.sin(t * 0.08) * 0.08;
      pointCloud.rotation.y = t * 0.18;
      pointCloud.rotation.x = Math.sin(t * 0.12) * 0.12;
      gridPoints.position.z = ((t * 0.45) % 4) * -1.4;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      sphereGeometry.dispose();
      pointsGeometry.dispose();
      gridGeometry.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#02020a] text-white">
      <LuxuryBackground />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(250,204,21,0.14),_transparent_55%)]" />
        <div className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#facc15] via-[#f97316] to-transparent opacity-40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-gradient-to-tl from-[#38bdf8] via-[#4f46e5] to-transparent opacity-40 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.08)_1px,_transparent_1px)] bg-[size:120px_120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-24 text-center sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.26em] text-white/60 backdrop-blur">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-[#facc15] via-[#fde68a] to-[#38bdf8] shadow-[0_0_14px_rgba(250,204,21,0.65)]" />
            Investment Intelligence Ecosystem
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance font-serif text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl lg:text-6xl"
          >
            Where Capital Meets Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
          >
            Advanced investment analytics, valuation intelligence, and risk
            architecture designed for modern venture ecosystems. Built for
            institutions that treat every decision as a signal.
          </motion.p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow:
                  "0 0 0 1px rgba(250,204,21,0.45), 0 0 40px rgba(59,130,246,0.65)",
              }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-[radial-gradient(circle_at_10%_0,#facc15,transparent_55%),radial-gradient(circle_at_80%_0,#38bdf8,transparent_60%)] px-8 py-3 text-sm font-semibold tracking-[0.14em] text-black shadow-[0_0_0_1px_rgba(250,204,21,0.65)] transition-colors"
            >
              Enter the Platform
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
                backgroundColor: "rgba(15,23,42,0.85)",
              }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-white/18 bg-black/40 px-7 py-3 text-sm font-medium tracking-[0.14em] text-white/80 backdrop-blur-lg transition"
            >
              Explore Intelligence Engine
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
