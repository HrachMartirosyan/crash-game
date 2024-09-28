import { AxiosResponse } from "axios";

import { instance } from "./axios.tsx";
import { ConfigResDto, InitResDto } from "../dto/game.dto.ts";

const BASE: string = "/game";

export async function getGameConfig_api(): Promise<
  AxiosResponse<ConfigResDto>
> {
  return await instance.get(`${BASE}/config`);
}

export async function gameInit_api(): Promise<AxiosResponse<InitResDto>> {
  return await instance.post(`${BASE}/init`);
}
