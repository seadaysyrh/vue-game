// ===== Electron のメインプロセス =====
// ビルドした dist を、デスクトップのウィンドウで表示する。
// file:// で開くと Vue Router の URL（/game・/docs）が使えないので、
// app:// という自前の場所を作って、そこから dist のファイルを返す
const { app, BrowserWindow, protocol, net, shell } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const { pathToFileURL } = require('node:url')

const DIST = path.join(__dirname, '..', 'dist')

// app:// を「ふつうの Web サイトと同じ扱い」にする（fetch・localStorage・動画が使えるように）
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
])

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    title: '放課後リライト',
    webPreferences: {
      // 画面から Node.js を使わせない（このゲームは Node の機能を使わないので、橋もいらない）
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  win.loadURL('app://game/')

  // 外のサイトへのリンクは、アプリの中ではなくふつうのブラウザで開く
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const { pathname } = new URL(request.url)
    let file = path.join(DIST, decodeURIComponent(pathname))
    // dist の外は読ませない。ファイルがない URL（/game・/docs）は index.html を返す（Vue Router のため）
    const inside = file === DIST || file.startsWith(DIST + path.sep)
    if (!inside || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(DIST, 'index.html')
    }
    // Range などのヘッダーもそのまま渡す（エンディングの動画を途中から読めるように）
    return net.fetch(pathToFileURL(file).toString(), { headers: request.headers })
  })
  createWindow()
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
