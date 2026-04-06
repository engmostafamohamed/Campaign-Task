import { Request, Response } from "express";
import { ApiResponse } from "../../core/response/api.response";
import { CampaignService } from "./campaign.service";
import { catchAsync } from "../../core/utils/catchAsync";

export const service = new CampaignService();

export class CampaignController {

  static create = catchAsync(async (req: Request, res: Response) => {
    const id = Date.now().toString();

    const result = await service.createCampaign(id, req.body);

    return ApiResponse.success(res, "Campaign created successfully", result );
  });

  static start = catchAsync(async (req: Request, res: Response) => {
    const result=await service.startCampaign(req.params.id as string);
    return ApiResponse.success(res, "Campaign started successfully", result.message);
  });

  static pause = catchAsync(async (req: Request, res: Response) => {
    const result =await service.pauseCampaign(req.params.id as string);
    return ApiResponse.success(res, "Campaign paused successfully", result.message);
  });

  static resume = catchAsync(async (req: Request, res: Response) => {
    const result = await service.resumeCampaign(req.params.id as string);
    return ApiResponse.success(res, "Campaign resumed successfully", result.message);
  });

  static get = catchAsync(async (req: Request, res: Response) => {
    const data = await service.getCampaign(req.params.id as string);
    return ApiResponse.success(res, "Campaign fetched successfully", data);
  });
}