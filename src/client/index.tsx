import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./styles.css"

async function main() {
  // const controller = new ClientContoller()
  // await controller.connect()

  // probably wanna use the less stupid history package later
  // or even full on react router?
  // const gamePathRegex = /^\/?game\/([a-z0-9-]+)$/i
  // let pathMatch: RegExpMatchArray | null

  // if (window.location.pathname === "/") {
  //   const gameId = await controller.joinNewGame()
  //   if (gameId) {
  //     window.history.replaceState(undefined, document.title, `/game/${gameId}`)
  //   }
  // } else if ((pathMatch = window.location.pathname.match(gamePathRegex))) {
  //   controller.joinGame(pathMatch[1])
  // }

  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("root"),
  )
}

main().catch(console.error)
