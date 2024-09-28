import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./client.tanstack.tsx";
import { getPlayer_api } from "../api/player.api.tsx";
import { useRecoilState } from "recoil";
import { PlayerState } from "../atoms/player.atom.ts";

export const usePlayerQuery = () => {
  const [, setPlayer] = useRecoilState(PlayerState);

  return useQuery({
    queryKey: [queryKeys.GET_PLAYER],
    queryFn: async () => {
      const response = await getPlayer_api();
      setPlayer(response.data);
      return response;
    },
  });
};
