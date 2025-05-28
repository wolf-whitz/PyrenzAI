import { app, BrowserWindow } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  const devURL = 'http://localhost:5173' 
  const prodURL = `file://${path.join(__dirname, '../build/index.html')}`

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(devURL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(prodURL)
  }

  mainWindow.on('closed', () => (mainWindow = null))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
