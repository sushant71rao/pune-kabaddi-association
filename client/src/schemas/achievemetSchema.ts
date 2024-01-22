import { z } from "zod";

export const achievementSchema = z.object({
    achievementYear: z.string(),
    achievementTitle: z.string(),
    achievementDocument: z.string(), // Assuming achievementDocument is a file path or base64 representation
  });
  