# Loxone Light Control Dashboard

A web-based dashboard to control and monitor lights using Loxone Miniserver.

## Features

- Real-time light status updates
- Toggle light on/off
- WebSocket communication with Loxone Miniserver
- Threejs light animation

## Installation

Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/Am10aN16/loxone-light-dashboard.git

# Navigate to the project directory
cd loxone-light-dashboard

# Install server dependencies
npm install

# Navigate to the client directory
cd client

# Install client dependencies
npm install

# Navigate back to the project root
cd ..

# Start the server
npm start

# Open another terminal window and navigate to the client directory
cd client

# Start the client
npm start
```

## Deployment

<div align="center"><a href="https://glitch.com"><img src="https://www.svgrepo.com/show/353793/glitch-icon.svg" alt="Glitch.com" width="75px" /></a> <img src="https://static.thenounproject.com/png/877484-200.png" width="75px" /> <a href="https://github.com"><img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="Github.com" width="75px" /></a></div>

## Screenshots

[<img src="./images/s1.png" width="50%" alt="Light off" />](./images/s1.png)[<img src="./images/s2.png" width="50%" alt="Light on" />](./images/s2.png)

## Limitations

- The server goes to sleep due to inactivity and may take a minute or two after prolonged website visit. You may try refreshing the page.
- The websocket server response takes few seconds to send response.
