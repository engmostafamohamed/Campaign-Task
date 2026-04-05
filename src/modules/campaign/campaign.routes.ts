import { Router } from "express";
import { CreateCampaignDto } from "./campaign.dto";
import { validate } from "../../middleware/validation.middleware";
import { CampaignController } from './campaign.controller';
const router = Router();

// Define your campaign routes here
router.post("/", validate(CreateCampaignDto), CampaignController.create);
router.post("/:id/start", CampaignController.start);
router.post("/:id/pause", CampaignController.pause);
router.post("/:id/resume", CampaignController.resume);
router.get("/:id", CampaignController.get);

export default router;