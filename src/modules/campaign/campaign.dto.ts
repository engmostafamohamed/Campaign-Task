import { z } from 'zod';
export const CreateCampaignDto = z.object({
    customerList: z.array(z.string()).min(1, "At least one customer is required"),
    startTime: z.string(),
    endTime: z.string(),
    maxConcurrentCalls: z.number().int().positive().min(1, "Max concurrent calls must be at least 1"),
    maxDailyMinutes: z.number().int().positive().min(1, "Max daily minutes must be at least 1"),
    maxRetries: z.number().int().nonnegative().default(2),
    retryDelayMs: z.number().int().nonnegative().default(3600000),
    timezone: z.string().default("UTC").optional(),
});

export type CreateCampaignDtoType = z.infer<typeof CreateCampaignDto>;

export const UpdateCampaignDto = z.object({
    customerList: z.array(z.string()).min(1, "At least one customer is required").optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    maxConcurrentCalls: z.number().int().positive().min(1, "Max concurrent calls must be at least 1").optional(),
    maxDailyMinutes: z.number().int().positive().min(1, "Max daily minutes must be at least 1").optional(),
    maxRetries: z.number().int().nonnegative().default(2).optional(),
    retryDelayMs: z.number().int().nonnegative().default(3600000).optional(),
    timezone: z.string().default("UTC").optional(),
});

export type UpdateCampaignDtoType = z.infer<typeof UpdateCampaignDto>;