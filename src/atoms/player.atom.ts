import { atom } from "recoil";
import { Player } from "../dto/player.dto.ts";

export const PlayerState = atom<Player | null>({
  key: "player",
  default: null,
});
