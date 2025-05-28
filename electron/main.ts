import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  })

  mainWindow.loadURL('https://pyrenzai.com')

  mainWindow.on('closed', () => (mainWindow = null))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
