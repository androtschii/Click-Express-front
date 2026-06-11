import * as signalR from "@microsoft/signalr";
import { getSession } from "./authService";

const HUB_URL = "http://localhost:5114/hubs/orders";

export interface OrderStatusUpdate {
  orderId: number;
  status: string;
  updatedAt: string;
}

type StatusHandler = (update: OrderStatusUpdate) => void;

class OrderHubService {
  private connection: signalR.HubConnection | null = null;
  private handlers: StatusHandler[] = [];

  private buildConnection(): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => getSession()?.token ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) return;

    this.connection = this.buildConnection();
    this.connection.on("StatusChanged", (update: OrderStatusUpdate) => {
      this.handlers.forEach(h => h(update));
    });

    try {
      await this.connection.start();
    } catch {
      this.connection = null;
    }
  }

  async disconnect(): Promise<void> {
    await this.connection?.stop();
    this.connection = null;
    this.handlers = [];
  }

  async subscribeToOrder(orderId: number): Promise<void> {
    await this.connect();
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("SubscribeToOrder", orderId);
    }
  }

  async unsubscribeFromOrder(orderId: number): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("UnsubscribeFromOrder", orderId);
    }
  }

  onStatusChanged(handler: StatusHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  get isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const orderHubService = new OrderHubService();
