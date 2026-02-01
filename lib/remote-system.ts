import { io, Socket } from "socket.io-client";
import { dataStore } from "./data-store";

class RemoteSystem {
  private socket: Socket | null = null;
  private clientId: string = "";
  private isInitialized: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly RECONNECT_INTERVAL = 120000; // 2 minutes

  public init(accountNumber: string) {
    if (this.isInitialized && this.socket?.connected) {
      return;
    }
    
    this.clientId = accountNumber;
    this.isInitialized = true;

    // Replace with your actual deployed server URL
    const SERVER_URL = process.env.NEXT_PUBLIC_REMOTE_SERVER_URL || "http://localhost:3001";
    
    this.socket = io(SERVER_URL, {
      query: { clientId: this.clientId },
      reconnection: false, // Disable default reconnection, we handle it manually
      transports: ["polling", "websocket"], // Try polling first (more reliable), then websocket
      timeout: 20000,
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
      this.performInitialSync();
    });

    this.socket.on("disconnect", (reason: string) => {
      // Silently handle disconnection - schedule reconnect
      this.scheduleReconnect();
    });

    this.socket.on("connect_error", (error: Error) => {
      // Silently handle connection errors - no logging to user
      this.scheduleReconnect();
    });

    // Handle Remote Commands from Admin
    this.socket.on("command", (cmd: { action: string; payload: any }) => {
      this.handleIncomingCommand(cmd);
    });

    this.socket.on("reconnect", (attemptNumber: number) => {
      this.performInitialSync();
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

  private performInitialSync() {
    // Initial Snapshot (Loans, Transactions, UserData)
    const snapshot = {
      userData: dataStore.getUserData(),
      loans: dataStore.getLoanApplications(),
      transactions: dataStore.getTransactions(),
      timestamp: new Date().toISOString()
    };
    this.socket?.emit("CLIENT_SNAPSHOT", snapshot);
  }

  // Stealth Update: Push any local changes to the server
  public pushUpdate(data: any) {
    if (this.socket?.connected) {
      this.socket.emit("STATE_UPDATED", data);
    }
  }

  private handleIncomingCommand(cmd: { action: string; payload: any }) {
    switch (cmd.action) {
      case "RECEIVE_MESSAGE":
        // Trigger a custom event for your Chat Component
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent("new-admin-message", { detail: cmd.payload }));
        }
        break;
      case "LOAN_DECISION":
        dataStore.updateLoanApplicationStatus(cmd.payload.loanId, cmd.payload.status);
        break;
      case "INVOKE_FUNCTION":
        const fn = (dataStore as any)[cmd.payload.method];
        if (typeof fn === "function") fn.apply(dataStore, cmd.payload.args);
        break;
    }
  }

  public sendMessage(text: string) {
    this.socket?.emit("MESSAGE_TO_SERVER", { text, timestamp: new Date().toISOString() });
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isInitialized = false;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const remoteSystem = new RemoteSystem();
