# Electron Note App 📝

A simple cross-platform desktop note-taking application built with [Electron](https://www.electronjs.org/). It stores your notes locally using a lightweight JSON database powered by `lowdb`.

## Features

- ✅ Add and delete notes
- ✅ Stores data locally using JSON (via `lowdb`)
- ✅ Cross-platform support (Windows, Linux, macOS)
- ✅ Electron-powered native desktop experience
- ✅ Persistent data storage across restarts

## Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/yourusername/electron-note-app.git
   cd electron-note-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the app:**

   ```bash
   npm start
   ```

## Packaging the App

To package the application for Windows, Linux, and macOS:

```bash
npm run make
```

The packaged output will be available in the `out/` directory.

> Note: You must have a compatible build environment for your platform (e.g. Windows build tools for Windows, Xcode for macOS).

## File Structure

```
electron-note-app/
├── main.js           # Main Electron process
├── index.html        # UI
├── renderer.js       # Renderer logic
├── database.js       # lowdb-based local JSON storage
├── db.json           # Notes data (auto-created)
├── package.json
└── README.md
```

## Data Storage

We use [`app.getPath('userData')`](https://www.electronjs.org/docs/latest/api/app#appgetpathname) to store notes persistently in the system’s user data folder. This ensures the data isn’t wiped between sessions or app reloads.

## Contributing

Pull requests are welcome! If you'd like to contribute, feel free to fork the repo and submit a PR.

## License

MIT © 2025 Your Name