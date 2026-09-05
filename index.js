const WebSocket = require("ws");
const net = require("net");

// 🔧 Change this to your Apex Hosting server address + port
const MINECRAFT_SERVER_HOST = "136.243.83.105";
const MINECRAFT_SERVER_PORT = 22815;

// Start WebSocket server on port 8081 (Eaglercraft default)
const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", function connection(ws) {
  console.log("Eaglercraft player connected!");

  const mcSocket = net.createConnection(
    { host: MINECRAFT_SERVER_HOST, port: MINECRAFT_SERVER_PORT },
    () => {
      console.log("Connected to Minecraft server");
    }
  );

  // Forward Minecraft server → Eagler client
  mcSocket.on("data", (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  // Forward Eagler client → Minecraft server
  ws.on("message", (message) => {
    mcSocket.write(message);
  });

  ws.on("close", () => {
    mcSocket.end();
    console.log("Eaglercraft player disconnected");
  });

  mcSocket.on("end", () => {
    ws.close();
    console.log("Lost connection to Minecraft server");
  });
});

console.log("✅ EaglerProxy running on port 8081");
