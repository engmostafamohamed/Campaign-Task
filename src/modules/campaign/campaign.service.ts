import { CampaignEngine } from './campaign.engine';
import { SystemClock } from '../../core/clock/system.clock';
import { CreateCampaignDtoType } from './campaign.dto';
import { CampaignConfig } from './campaign.types';

export class CampaignService {
  [x: string]: any;
  private campaigns = new Map<string, CampaignEngine>();

  async createCampaign(id: string, dto: CreateCampaignDtoType){
    const config = this.mapToConfig(dto);
    const engine = new CampaignEngine(
      config,
      this.mockCallHandler,
      new SystemClock()
    );

    this.campaigns.set(id, engine);
    return { id };
    
  }

  async startCampaign(id: string){
    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    campaign.start();

    return { message: "Campaign started successfully" };

  }

  async pauseCampaign(id: string){
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error("Campaign not found");

    campaign.pause();
    return {message: "Campaign paused successfully"};

    
  }

  async resumeCampaign(id: string){
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error("Campaign not found");

    campaign.resume();
    return { message: "Campaign resumed successfully" };
  }

  async getCampaign(id: string){
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error("Campaign not found");

    return  campaign.getStatus();
  }

  private async mockCallHandler(phone: string) {
    return new Promise<{ success: boolean; duration: number }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: Math.random() > 0.3,
          duration: Math.floor(Math.random() * 5) + 1,
        });
      }, 1000);
    });
  }
  private mapToConfig(dto: CreateCampaignDtoType): CampaignConfig {
    return {
      phones: dto.customerList,
      maxConcurrentCalls: dto.maxConcurrentCalls,
      maxRetries: dto.maxRetries,
      retryDelay: dto.retryDelayMs,
      maxDailyMinutes: dto.maxDailyMinutes,
      startTime: this.parseHour(dto.startTime),
      endTime: this.parseHour(dto.endTime),
    };
  }

  private parseHour(time: string): number {
    return parseInt(time.split(":")[0]);
  }
}