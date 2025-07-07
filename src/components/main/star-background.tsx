"use client";
import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { inSphere } from "maath/random";
import { useRef, Suspense, useMemo } from "react";
import type { Points as PointsType } from "three";
import type { ComponentProps } from "react";

type PointsProps = ComponentProps<typeof Points>;

export const StarBackground = (props: PointsProps) => {
  const ref = useRef<PointsType>(null);

  const sphere = useMemo(() => {
    const arr = new Float32Array(5000); // Should be divisible by 3 for XYZ
    inSphere(arr, { radius: 1.2 });
    return arr;
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => (
  <div className="w-full h-auto fixed inset-0 -z-10">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);
