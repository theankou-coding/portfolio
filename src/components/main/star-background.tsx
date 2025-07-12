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
    // Fix: Use proper array size divisible by 3
    const starCount = 1667; // Number of stars you want
    const arr = new Float32Array(starCount * 3); // Each star needs x, y, z coordinates

    try {
      // Generate random points in a sphere
      inSphere(arr, { radius: 1.2 });

      // Validate and clean the array for any NaN or invalid values
      for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i]) || !isFinite(arr[i])) {
          console.warn(`Invalid value at index ${i}, replacing with 0`);
          arr[i] = 0;
        }
      }

      console.log(
        `Generated ${starCount} stars with ${arr.length} coordinates`
      );
      return arr;
    } catch (error) {
      console.error("Error generating sphere points:", error);

      // Fallback: Create manual random points if inSphere fails
      const fallbackCount = 1000;
      const fallbackArr = new Float32Array(fallbackCount * 3);

      for (let i = 0; i < fallbackCount; i++) {
        const i3 = i * 3;
        // Generate random points in a sphere manually
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = Math.cbrt(Math.random()) * 1.2; // Cube root for uniform distribution

        fallbackArr[i3] = r * Math.sin(phi) * Math.cos(theta); // x
        fallbackArr[i3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
        fallbackArr[i3 + 2] = r * Math.cos(phi); // z
      }

      console.log("Using fallback star generation");
      return fallbackArr;
    }
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false} // Disable frustum culling for background stars
        {...props}
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          alphaTest={0.01}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => {
  return (
    <div className="w-full h-auto fixed inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 1],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};
