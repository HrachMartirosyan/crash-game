import { Player } from "./player.dto.ts";

export type InitResDto = {
  sessionID: string;
  player: Player;
};

export type ConfigResDto = {
  minBet: number;
  maxBet: number;
  bets: number[];
  createdAt: Date;
};
