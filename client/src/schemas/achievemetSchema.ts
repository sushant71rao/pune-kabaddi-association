import { z } from "zod";

export const achievementSchema = z.object({
  achievementYear: z.string(),
  achievementTitle: z.string(),
  achievementDocument: z.any(),
});
