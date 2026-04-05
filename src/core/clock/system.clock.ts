export class SystemClock {
  now(): number {
    return Date.now();
  }

  setTimeout(fn: () => void, delay: number): any {
    return setTimeout(fn, delay);
  }
}