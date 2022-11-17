export enum IpcEvents {
  electronAppGetPath = 'electron.app.getPath',
  electronAppGetVersion = 'electron.app.getVersion',
  electronDialogShowOpenDialog = 'electron.dialog.showOpenDialog',
  electronDialogShowOpenDialogSync = 'electron.dialog.showOpenDialogSync',

  // ttsMicrosoftPlay = 'tts.microsoft.play',
  ttsMicrosoftPlayStream = 'tts.microsoft.play.stream',
  ttsMicrosoftDownload = 'tts.microsoft.download',
  ttsMicrosoftDownloadStatusChange = 'tts.microsoft.download.status.change',
  ttsMidrosoftDownloadRemove = 'tts.microsoft.download.remove',

  transferDevicesUpdate = 'transfer.devices.update',
  transferServerStarted = 'transfer.server.started',
  transferSSEData = 'transfer.sse.data',

  subWindowOpen = 'subWindow.open',
  subWindowInitialData = 'subWindow.initial.data',

  themeChange = 'theme.change',
}
