import {
  CampaignConfig,
  CallHandler,
  RetryItem,
  IClock,
  ICampaign,
} from "./campaign.types";

class CampaignState {
  pendingQueue: string[] = [];
  retryQueue: RetryItem[] = [];
  activeCalls = 0;
  completed = new Set<string>();
  failed = new Set<string>();
  dailyMinutes = 0;
}

export class CampaignEngine implements ICampaign {
  private state = new CampaignState();
  private isPaused = false;

  constructor(
    private config: CampaignConfig,
    private callHandler: CallHandler,
    private clock: IClock
  ) {
    this.state.pendingQueue = [...config.phones];
  }

  start() {
    this.scheduleNext();
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.scheduleNext();
  }

  private scheduleNext() {
    if (this.isPaused) return;

    const now = this.clock.now();

    if (!this.isWithinWorkingHours(now)) {
      const next = this.getNextWorkingTime(now);
      this.clock.setTimeout(() => this.scheduleNext(), next - now.getTime());
      return;
    }

    if (this.state.dailyMinutes >= this.config.maxDailyMinutes) {
      const nextDay = this.getNextDayStart(now);
      this.state.dailyMinutes = 0;

      this.clock.setTimeout(() => this.scheduleNext(), nextDay - now.getTime());
      return;
    }

    while (
      this.state.activeCalls < this.config.maxConcurrentCalls &&
      this.hasWork()
    ) {
      const task = this.getNextTask();
      if (!task) break;

      this.executeCall(task);
    }
  }

  private getNextTask(): RetryItem | null {
    const now = this.clock.now().getTime();

    const retryIndex = this.state.retryQueue.findIndex(
      (r) => r.nextRetryTime <= now
    );

    if (retryIndex !== -1) {
      return this.state.retryQueue.splice(retryIndex, 1)[0];
    }

    const phone = this.state.pendingQueue.shift();
    if (!phone) return null;

    return { phone, attempts: 0, nextRetryTime: 0 };
  }

  private async executeCall(task: RetryItem) {
    this.state.activeCalls++;

    try {
      const result = await this.callHandler(task.phone);

      this.state.dailyMinutes += result.duration;

      if (result.success) {
        this.state.completed.add(task.phone);
      } else {
        this.handleRetry(task);
      }
    } catch {
      this.handleRetry(task);
    } finally {
      this.state.activeCalls--;
      this.scheduleNext();
    }
  }

  private handleRetry(task: RetryItem) {
    if (task.attempts >= this.config.maxRetries) {
      this.state.failed.add(task.phone);
      return;
    }

    task.attempts++;
    task.nextRetryTime =
      this.clock.now().getTime() + this.config.retryDelay;

    this.state.retryQueue.push(task);
  }

  private isWithinWorkingHours(now: Date) {
    const h = now.getHours();
    return h >= this.config.startTime && h < this.config.endTime;
  }

  private getNextWorkingTime(now: Date) {
    const next = new Date(now);
    next.setHours(this.config.startTime, 0, 0, 0);

    if (now.getHours() >= this.config.endTime) {
      next.setDate(next.getDate() + 1);
    }

    return next.getTime();
  }

  private getNextDayStart(now: Date) {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(this.config.startTime, 0, 0, 0);
    return next.getTime();
  }

  private hasWork() {
    return (
      this.state.pendingQueue.length > 0 ||
      this.state.retryQueue.length > 0
    );
  }

  getStatus() {
    return {
      pending: this.state.pendingQueue.length,
      retry: this.state.retryQueue.length,
      active: this.state.activeCalls,
      completed: this.state.completed.size,
      failed: this.state.failed.size,
    };
  }
}