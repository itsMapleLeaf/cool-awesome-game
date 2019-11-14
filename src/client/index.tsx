import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { ClientContoller } from "./ClientController"
import "./styles.css"

async function main() {
  const controller = new ClientContoller()

  // probably wanna use the less stupid history package later
  // or even full on react router?
  const gamePathRegex = /^\/?game\/([a-z0-9-]+)$/i
  let pathMatch: RegExpMatchArray | null

  if (window.location.pathname === "/") {
    const gameId = await controller.joinNewGame()
    window.history.replaceState(undefined, document.title, `/game/${gameId}`)
  } else if ((pathMatch = window.location.pathname.match(gamePathRegex))) {
    controller.joinGame(pathMatch[1])
  }

  ReactDOM.render(
    <App controller={controller} />,
    document.getElementById("root"),
  )
}

main().catch(console.error)
