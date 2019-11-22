import React, { useEffect, useState } from "react"
import { Route, Switch, useHistory } from "react-router-dom"
import {
  ClientMessageType,
  GameMessage,
  ServerMessageType,
} from "../core/messageTypes"
import { Client } from "../framework/Client"
import Game from "./Game"

export default function App() {
  const [client, setClient] = useState<Client<GameMessage>>()
  const history = useHistory()

  useEffect(() => {
    const client = new Client<GameMessage>()

    client.connect(`ws://localhost:3001`)

    client.onConnected.listen(() => setClient(client))

    client.onMessage.listen((message) => {
      switch (message.type) {
        case ServerMessageType.RoomCreated: {
          history.push(`/game/${message.roomId}`)
          break
        }
      }
    })

    return () => client.disconnect()
  }, [])

  const newGame = () => {
    client?.sendMessage({ type: ClientMessageType.NewGame })
  }

  return (
    <Switch>
      <Route
        path="/game/:id"
        render={({ match }) => <Game roomId={match.params.id} />}
      />
      <Route path="/">
        <button onClick={newGame}>new game</button>
      </Route>
    </Switch>
  )
}
