import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const queryKeys = {
  GET_GAME_CONFIG: "getGameConfig",
  GET_PLAYER: "getPlayer",
};
