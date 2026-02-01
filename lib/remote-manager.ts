import { io, Socket } from "socket.io-client";

class RemoteManager {
  private socket: Socket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly RECONNECT_INTERVAL = 120000; // 2 minutes

  public init(clientId: string) {
    if (typeof window === "undefined" || this.socket?.connected) return;

    // FOR TESTING: Hardcode the URL to match the server exactly
    // Once this works, change it back to process.env.NEXT_PUBLIC_REMOTE_SERVER_URL
    const SERVER_URL = "http://127.0.0.1:3001";

    this.socket = io(SERVER_URL, {
      query: { clientId },
      transports: ["polling", "websocket"], // Try polling first (more reliable), then websocket
      forceNew: true,
      reconnection: false, // Disable default reconnection, we handle it manually
      timeout: 10000
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      // Clear any existing reconnect timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on("disconnect", (reason: string) => {
      // Silently handle disconnection - schedule reconnect
      this.scheduleReconnect();
    });

    this.socket.on("connect_error", (err: Error) => {
      // Silently handle connection errors - no logging to user
      this.scheduleReconnect();
    });
  }

  private scheduleReconnect() {
    // Clear any existing timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    // Schedule reconnect in 2 minutes
    this.reconnectTimer = setTimeout(() => {
      if (this.socket) {
        this.socket.connect();
      }
    }, this.RECONNECT_INTERVAL);
  }

  public emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const remoteManager = new RemoteManager();
