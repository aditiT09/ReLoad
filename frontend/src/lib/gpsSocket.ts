// src/lib/gpsSocket.ts
// WebSocket client for real-time GPS telemetry with auto-reconnect and exponential backoff

export interface GPSPayload {
  lat: number;
  lng: number;
  speed?: number | null;
  heading?: number | null;
  accuracy?: number | null;
  timestamp?: number | string;
}

export type GPSSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface GPSSocketOptions {
  bookingId: string;
  token: string;
  onStatusChange?: (status: GPSSocketStatus) => void;
  onMessage?: (data: any) => void;
  onError?: (err: Event | Error) => void;
  maxReconnectDelay?: number;
  initialReconnectDelay?: number;
}

export class GPSSocket {
  private bookingId: string;
  private token: string;
  private ws: WebSocket | null = null;
  private isExplicitlyClosed: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimer: any = null;
  private status: GPSSocketStatus = 'disconnected';

  private onStatusChange?: (status: GPSSocketStatus) => void;
  private onMessage?: (data: any) => void;
  private onError?: (err: Event | Error) => void;

  private maxReconnectDelay: number;
  private initialReconnectDelay: number;

  constructor(options: GPSSocketOptions) {
    this.bookingId = options.bookingId;
    this.token = options.token;
    this.onStatusChange = options.onStatusChange;
    this.onMessage = options.onMessage;
    this.onError = options.onError;
    this.initialReconnectDelay = options.initialReconnectDelay || 1000;
    this.maxReconnectDelay = options.maxReconnectDelay || 16000;
  }

  private setStatus(newStatus: GPSSocketStatus) {
    this.status = newStatus;
    if (this.onStatusChange) {
      this.onStatusChange(newStatus);
    }
  }

  public getStatus(): GPSSocketStatus {
    return this.status;
  }

  public connect() {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    this.setStatus(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting');

    // Build ws:// or wss:// URL based on API_URL or window.location
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const wsBase = apiUrl.replace(/^http/, 'ws');
    const wsUrl = `${wsBase}/api/v1/ws/gps/${this.bookingId}?token=${encodeURIComponent(this.token)}`;

    try {
      this.ws = new WebSocket(wsUrl);
    } catch (err) {
      if (this.onError) this.onError(err as Error);
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessage) this.onMessage(data);
      } catch {
        if (this.onMessage) this.onMessage(event.data);
      }
    };

    this.ws.onerror = (event) => {
      if (this.onError) this.onError(event);
    };

    this.ws.onclose = (event) => {
      this.ws = null;
      if (!this.isExplicitlyClosed) {
        // WS_1008_POLICY_VIOLATION (4008 or 1008) means invalid auth / unauthorized
        if (event.code === 1008 || event.code === 4008) {
          this.setStatus('disconnected');
          if (this.onError) {
            this.onError(new Error('WebSocket authentication rejected (Invalid or expired token)'));
          }
          return;
        }
        this.scheduleReconnect();
      } else {
        this.setStatus('disconnected');
      }
    };
  }

  private scheduleReconnect() {
    if (this.isExplicitlyClosed) return;

    this.setStatus('reconnecting');
    this.reconnectAttempts += 1;

    // Exponential backoff with jitter: delay = min(maxDelay, initialDelay * 2^(attempts-1)) + jitter
    const exponential = Math.min(
      this.maxReconnectDelay,
      this.initialReconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    );
    const jitter = Math.random() * 500;
    const delay = exponential + jitter;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public sendPing(payload: GPSPayload): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      const message = JSON.stringify({
        lat: payload.lat,
        lng: payload.lng,
        speed: payload.speed ?? null,
        heading: payload.heading ?? null,
        accuracy: payload.accuracy ?? null,
        timestamp: typeof payload.timestamp === 'number'
          ? new Date(payload.timestamp).toISOString()
          : (payload.timestamp || new Date().toISOString()),
      });
      this.ws.send(message);
      return true;
    } catch (err) {
      if (this.onError) this.onError(err as Error);
      return false;
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setStatus('disconnected');
  }
}

export function createGPSSocket(options: GPSSocketOptions): GPSSocket {
  const socket = new GPSSocket(options);
  socket.connect();
  return socket;
}
