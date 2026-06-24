import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGalaxyStore } from '@/store/galaxyStore';
import { easeOutQuart, lerp } from '@/utils/math';

export function CameraController() {
  const { camera } = useThree();
  const cameraTarget = useGalaxyStore((s) => s.cameraTarget);
  const isTransitioning = useGalaxyStore((s) => s.isTransitioning);
  const setTransitioning = useGalaxyStore((s) => s.setTransitioning);
  const view = useGalaxyStore((s) => s.view);

  const progressRef = useRef(0);
  const startPosRef = useRef(new THREE.Vector3());
  const targetPosRef = useRef(new THREE.Vector3());
  const baseFOV = 60;

  useEffect(() => {
    if (isTransitioning) {
      startPosRef.current.copy(camera.position);
      progressRef.current = 0;

      if (view === 'galaxy') {
        targetPosRef.current.set(0, 20, 60);
      } else if (view === 'planet') {
        const [x, y, z] = cameraTarget;
        targetPosRef.current.set(x, y + 8, z + 20);
      } else if (view === 'token') {
        const [x, y, z] = cameraTarget;
        // pull back far enough to fit the ribbon graph; sit higher so content
        // drops into the lower ~65% of the screen, clear of the top info box
        targetPosRef.current.set(x, y + 6, z + 24);
      }
    }
  }, [isTransitioning, view, cameraTarget, camera]);

  useFrame((_, delta) => {
    if (!isTransitioning) {
      const fovCam = camera as THREE.PerspectiveCamera;
      if (Math.abs(fovCam.fov - baseFOV) > 0.01) {
        fovCam.fov = lerp(fovCam.fov, baseFOV, delta * 4);
        camera.updateProjectionMatrix();
      }
      return;
    }

    progressRef.current = Math.min(progressRef.current + delta * 0.75, 1);
    const eased = easeOutQuart(progressRef.current);

    camera.position.lerpVectors(startPosRef.current, targetPosRef.current, eased);
    camera.lookAt(cameraTarget[0], cameraTarget[1] + 3, cameraTarget[2]);

    const fovPerspective = camera as THREE.PerspectiveCamera;
    const warpFOV = progressRef.current < 0.3
      ? lerp(baseFOV, baseFOV + 25, progressRef.current / 0.3)
      : lerp(baseFOV + 25, baseFOV, (progressRef.current - 0.3) / 0.7);
    fovPerspective.fov = warpFOV;
    camera.updateProjectionMatrix();

    if (progressRef.current >= 1) {
      setTransitioning(false);
    }
  });

  return (
    <OrbitControls
      enabled={!isTransitioning}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      minDistance={view === "token" ? 14 : view === "planet" ? 8 : 20}
      maxDistance={view === "galaxy" ? 200 : view === "token" ? 40 : 60}
      enablePan={false}
      target={[cameraTarget[0], cameraTarget[1] + 3, cameraTarget[2]]}
    />
  );
}
