# SeaBattle

Classic sea battle. Game are played with a time control. Each turn player has 30 seconds to move. 
A player wins the game if he first sinks all opponent's ships or opponent runs out of time.

## Demo
[Live DEMO]()

## The project was build using the following technologies
* React
* Redux & Redux thunk
* React router v4
* Webpack
* Socket.io
* PostCSS
* Canvas

## Development mode scripts

- runs server on 3333 port
    ```
    npm run server
    ```
- runs application on 3000 port ([http://localhost:3000](http://localhost:3000))
    ```
    npm run dev
    ```
- for playing on one computer you need open two or more tabs using browser's incognito mode

## Features

### Ship placement
- place ships using mouse (push space to rotate)
- place ships randomly using the button
- clear grid using button or mouse

### Game types

- random game - random opponent, without spectator
- own game - creates room (room creator should share url with his friends),
 room member can choose his type (player or spectator); 
 the game will start when the room will be two players
 