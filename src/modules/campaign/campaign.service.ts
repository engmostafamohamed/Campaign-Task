import { CampaignEngine } from './campaign.engine';
import { SystemClock } from '../../core/clock/system.clock';

type ServiceResult<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

export class CampaignService {
  private campaigns = new Map<string, CampaignEngine>();

  async createCampaign(id: string, config: any): Promise<ServiceResult> {
    try {
      const engine = new CampaignEngine(
        config,
        this.mockCallHandler,
        new SystemClock()
      );

      this.campaigns.set(id, engine);

      return {
        success: true,
        message: "Campaign created successfully",
        data: { id }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to create campaign"
      };
    }
  }

  async startCampaign(id: string): Promise<ServiceResult> {
    try {
      const campaign = this.campaigns.get(id);

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found"
        };
      }

      campaign.start();

      return {
        success: true,
        message: "Campaign started successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to start campaign"
      };
    }
  }

  async pauseCampaign(id: string): Promise<ServiceResult> {
    try {
      const campaign = this.campaigns.get(id);

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found"
        };
      }

      campaign.pause();

      return {
        success: true,
        message: "Campaign paused successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to pause campaign"
      };
    }
  }

  async resumeCampaign(id: string): Promise<ServiceResult> {
    try {
      const campaign = this.campaigns.get(id);

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found"
        };
      }

      campaign.resume();

      return {
        success: true,
        message: "Campaign resumed successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to resume campaign"
      };
    }
  }

  async getCampaign(id: string): Promise<ServiceResult> {
    try {
      const campaign = this.campaigns.get(id);

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found"
        };
      }

      return {
        success: true,
        message: "Campaign fetched successfully",
        data: campaign.getStatus()
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to fetch campaign"
      };
    }
  }

  private async mockCallHandler() {
    return new Promise<{ success: boolean; duration: number }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: Math.random() > 0.3,
          duration: Math.floor(Math.random() * 5) + 1,
        });
      }, 1000);
    });
  }
}