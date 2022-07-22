export enum IpcEvents {
  electronAppGetPath = 'electron.app.getPath',
  electronAppGetVersion = 'electron.app.getVersion',

  electronDialogShowOpenDialog = 'electron.dialog.showOpenDialog',
  electronDialogShowOpenDialogSync = 'electron.dialog.showOpenDialogSync',

  ttsMicrosoftPlay = 'tts.microsoft.play',
  ttsMicrosoftDownload = 'tts.microsoft.download',
  ttsMicrosoftDownloadStatusChange = 'tts.microsoft.download.status.change',
}
