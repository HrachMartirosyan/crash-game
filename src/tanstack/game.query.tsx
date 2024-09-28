import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./client.tanstack.tsx";
import { gameInit_api, getGameConfig_api } from "../api/game.api.tsx";

export const useGameConfigQuery = () => {
  return useQuery({
    queryKey: [queryKeys.GET_GAME_CONFIG],
    queryFn: async () => {
      return getGameConfig_api();
    },
  });
};

export const useGameInitMutation = () => {
  return useMutation({
    mutationFn: () => gameInit_api(),
    onSuccess: ({ data }) => {
      return data;
    },
  });
};
