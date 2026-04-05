import { Request, Response } from "express";
import { ApiResponse } from "../../core/response/api.response";
import { CampaignService } from "./campaign.service";
import { catchAsync } from "../../core/utils/catchAsync";

export const service = new CampaignService();

export class CampaignController {

  static create = catchAsync(async (req: Request, res: Response) => {
    const id = Date.now().toString();

    await service.createCampaign(id, req.body);

    return ApiResponse.success(res, "Campaign created successfully", id );
  });

  static start = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await service.startCampaign(id);

    return ApiResponse.success(res, "Campaign started successfully", id);
  });

  static pause = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await service.pauseCampaign(id);

    return ApiResponse.success(res, "Campaign paused successfully", id);
  });

  static resume = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await service.resumeCampaign(id);

    return ApiResponse.success(res, "Campaign resumed successfully", id);
  });

  static get = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const data = await service.getCampaign(id);

    return ApiResponse.success(res, "Campaign fetched successfully", data);
  });
}