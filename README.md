# Real-Time Resource Monitor

A full-stack monorepo application built with **Vanilla JavaScript** and **Node.js** for real-time monitoring of system resources such as CPU load, memory usage, and running processes.

## Requirements

- Node.js ≥ 24.3.0
- npm ≥ 11.3.0

### Windows

1. Go to the official website: https://nodejs.org
2. Download the LTS version for Windows
3. Run the installer and follow the setup wizard
4. Open Command Prompt and verify installation:

```bash
# Verify installation
node -v
npm -v
```

### Linux (Debian/Ubuntu-based):

```bash

curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# Install Node.js and npm
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

## Installation

To install all the necessary dependencies for both the frontend and the backend, run the following command:

```bash
npm install
```

## Project startup

In order to run the application, the server and client parts must be run in different terminals. Everything is done at the root level of the project.

To start server:

```bash
npm run server
```

To start client:

```bash
npm run client
```
