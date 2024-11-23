import { z } from "zod";

export const TeamCompetitionForm = z.object({
  team: z
    .object({
      teamId: z.string(),
      name: z.string(),
    })
    .refine((team) => team.teamId.trim() !== "" && team.name.trim() !== "", {
      message: "Both team ID and team name must be provided.",
      path: ["team"], // Specify the field for better error targeting
    }),
  zone: z.string().refine((zone) => zone.trim() !== "", {
    message: "Zone must be provided.",
  }),
  category: z.string().refine((category) => category.trim() !== "", {
    message: "Category must be provided.",
  }),
  players: z
    .array(
      z.object({
        name: z.string().refine((name) => name.trim() !== "", {
          message: "Player name must be provided.",
        }),
        id: z.string().refine((id) => id.trim() !== "", {
          message: "Player ID must be provided.",
        }),
      })
    )
    .refine((players) => players.length >= 7, {
      message: "There must be at least 7 players.",
    }),
});
