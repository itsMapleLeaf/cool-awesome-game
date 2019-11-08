import React, { useRef } from "react"
import { Canvas, useFrame } from "react-three-fiber"

function DemoBox() {
  const ref = useRef<any>()

  useFrame(() => {
    ref.current!.rotation.x = ref.current!.rotation.y += 0.01
  })

  return (
    <mesh
      ref={ref}
      onClick={() => console.log("click")}
      onPointerOver={() => console.log("hover")}
      onPointerOut={() => console.log("unhover")}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas>
      <DemoBox />
    </Canvas>
  )
}
