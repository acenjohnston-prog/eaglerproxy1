const WebSocket = require("ws");
const net = require("net");

// 🔧 Your Apex Hosting server address + port
const MINECRAFT_SERVER_HOST = "136.243.83.105";
const MINECRAFT_SERVER_PORT = 22815;

// Dynamically use the port provided by Render/Replit, or fallback to 8081 locally
const PORT = process.env.PORT || 8081;
const wss = new WebSocket.Server({ port: PORT });

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

  mcSocket.on("error", (err) => {
    console.error("Minecraft socket error:", err.message);
    ws.close();
  });

  mcSocket.on("end", () => {
    ws.close();
    console.log("Lost connection to Minecraft server");
  });
});

console.log(`✅ EaglerProxy running on port ${PORT}`);
