import { IClock } from "../../modules/campaign/campaign.types";
export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }

  setTimeout(fn: () => void, delay: number): any {
    return setTimeout(fn, delay);
  }
}