import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

ReactDOM.render(<App />, document.getElementById("root"))

const socket = new WebSocket("ws://localhost:3001")

socket.onmessage = ({ data }) => {
  console.log(data)
}
