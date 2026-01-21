 

module.exports = {
  language: "en",
  ownerID: ["921743618316836875", ""], 
  mongodbUri : "mongodb+srv://spella:sonic@spella.xmdijfx.mongodb.net/?appName=Spella",
  spotifyClientId : "d92baed9605a45a39ed7c2a2d960b1c1",
  spotifyClientSecret : "e9b29f6739de4315bc03b6d8a8e93b03",
  setupFilePath: './commands/setup.json',
  commandsDir: './commands',  
  embedColor: "#1db954",
  activityName: "YouTube Music", 
  activityType: "LISTENING",  // Available activity types : LISTENING , PLAYING
  SupportServer: "https://discord.gg/QHzdUj2VqN",
  embedTimeout: 5,
  showProgressBar: false,  // Show progress bar in track embed
  showVisualizer: false,  // Show visualizer on music card (disabled for low-memory optimization)
  generateSongCard: true,  // custom song card image, if false uses thumbnail
  //usageWebhookUrl: "https://discord.com/api/webhooks/1449465170547179682/SEzyGmwRMFD-bZtjxGzDYmudzfFsFcDdaJ-LVltV8vWmWxzgiMNB1fGaU0M4IWF8bwYH",
  // Performance optimizations for low-memory environments (512MB RAM)
  lowMemoryMode: true,  // Enable optimizations for low-memory hosting
  errorLog: "", 
  nodes: [
     {
      name: "GlceYT",
      password: "glace",
      host: "de-01.strixnodes.com",
      port: 2010,
      secure: false
    }
  ]
}
