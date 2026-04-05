import { DateTime } from "luxon";

type RetryItem = {
  phone: string;
  attempts: number;
  nextRetryTime: number;
};

export class CampaignEngine {
  private pendingQueue: string[];
  private retryQueue: RetryItem[] = [];

  private activeCalls = 0;
  private paused = false;
  private status: 'idle' | 'running' | 'paused' | 'completed' = 'idle';

  private dailyMinutes = 0;

  constructor(
    private config: any,
    private callHandler: (phone: string) => Promise<{ success: boolean; duration: number }>,
    private clock: any
  ) {
    this.pendingQueue = [...config.customerList];

    // start daily reset
    this.scheduleDailyReset();
  }

  // start campaign
  start() {
    if (this.status === 'running') return;

    this.status = 'running';
    this.processQueue();
  }

  pause() {
    this.paused = true;
    this.status = 'paused';
  }

  resume() {
    this.paused = false;
    this.status = 'running';
    this.processQueue();
  }

  // main loop
  private processQueue() {
    if (this.paused || this.status !== 'running') return;

    while (this.canStartCall()) {
      const next = this.getNextCall();
      if (!next) break;

      this.startCall(next);
    }
  }

  // check conditions
  private canStartCall(): boolean {
    return (
      !this.paused &&
      this.activeCalls < this.config.maxConcurrentCalls &&
      this.isWithinWorkingHours() &&
      this.dailyMinutes < this.config.maxDailyMinutes
    );
  }

  // working hours (timezone aware)
  private isWithinWorkingHours(): boolean {
    const zone = this.config.timezone || "UTC";

    const now = DateTime.fromMillis(this.clock.now(), { zone });

    const [sh, sm] = this.config.startTime.split(":").map(Number);
    const [eh, em] = this.config.endTime.split(":").map(Number);

    const start = now.set({ hour: sh, minute: sm, second: 0 });
    const end = now.set({ hour: eh, minute: em, second: 0 });

    return now >= start && now <= end;
  }

  // pick next call
  private getNextCall(): string | null {
    const now = this.clock.now();

    // retry has priority
    const retry = this.retryQueue.find(r => r.nextRetryTime <= now);

    if (retry) {
      this.retryQueue = this.retryQueue.filter(r => r !== retry);
      return retry.phone;
    }

    return this.pendingQueue.shift() || null;
  }

  // simulate call
  private startCall(phone: string) {
    this.activeCalls++;

    this.callHandler(phone).then((res) => {
      this.activeCalls--;

      this.dailyMinutes += res.duration;

      if (!res.success) {
        this.handleRetry(phone);
      }

      this.checkCompletion();
      this.processQueue();
    });
  }

  // retry logic
  private handleRetry(phone: string) {
    const existing = this.retryQueue.find(r => r.phone === phone);
    const attempts = existing ? existing.attempts + 1 : 1;

    if (attempts > this.config.maxRetries) return;

    this.retryQueue.push({
      phone,
      attempts,
      nextRetryTime: this.clock.now() + this.config.retryDelayMs,
    });
  }

  // reset daily minutes
  private scheduleDailyReset() {
    const now = new Date(this.clock.now());
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    const delay = nextMidnight.getTime() - now.getTime();

    this.clock.setTimeout(() => {
      this.dailyMinutes = 0;
      this.scheduleDailyReset();
    }, delay);
  }

  // completion check
  private checkCompletion() {
    if (
      this.pendingQueue.length === 0 &&
      this.retryQueue.length === 0 &&
      this.activeCalls === 0
    ) {
      this.status = "completed";
    }
  }

  // optional status getter
  getStatus() {
    return {
      status: this.status,
      pending: this.pendingQueue.length,
      retries: this.retryQueue.length,
      activeCalls: this.activeCalls,
      dailyMinutes: this.dailyMinutes,
    };
  }
}