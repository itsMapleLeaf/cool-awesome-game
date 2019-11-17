import React, { useEffect, useRef } from "react"
import { Route, useHistory } from "react-router-dom"
import { Canvas, useFrame } from "react-three-fiber"
import { Mesh } from "three"
import { ClientContoller } from "./ClientController"

export default function App() {
  const controller = useRef(new ClientContoller())
  const history = useHistory()

  useEffect(() => {
    controller.current.connect()
  }, [])

  const joinNewGame = async () => {
    const roomId = await controller.current.joinNewGame()
    history.push(`/game/${roomId}`)
  }

  return (
    <>
      <Route exact path="/">
        <button onClick={joinNewGame}>join new game</button>
      </Route>
      <Route exact path="/game/:roomId">
        <Canvas gl2>
          <DemoBox />
        </Canvas>
      </Route>
    </>
  )

  // useWindowEvent("keydown", (event) => {
  //   const bindings: { [_ in string]?: () => void } = {
  //     ArrowLeft: () => controller.move(-1),
  //     ArrowRight: () => controller.move(1),
  //   }
  //   // TODO: use optional chaining lol
  //   const fn = bindings[event.key]
  //   if (fn) fn()
  // })
  // return (
  //   <Canvas gl2>
  //     <DemoBox />
  //   </Canvas>
  // )
}

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
