import React, { useRef } from "react"
import { Canvas, useFrame } from "react-three-fiber"
import { Mesh } from "three"
import { ClientContoller } from "./ClientController"
import { useWindowEvent } from "./useWindowEvent"

function DemoBox() {
  const ref = useRef<Mesh>()

  useFrame(() => {
    ref.current!.rotation.x = ref.current!.rotation.y += 0.01
  })

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}

type Props = {
  controller: ClientContoller
}

export default function App({ controller }: Props) {
  useWindowEvent("keydown", (event) => {
    const bindings: { [_ in string]?: () => void } = {
      ArrowLeft: () => controller.move(-1),
      ArrowRight: () => controller.move(1),
    }

    // TODO: use optional chaining lol
    const fn = bindings[event.key]
    if (fn) fn()
  })

  return (
    <Canvas gl2>
      <DemoBox />
    </Canvas>
  )
}
