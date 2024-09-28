import { AxiosResponse } from "axios";

import { instance } from "./axios.tsx";
import { GetPlayerResDto } from "../dto/player.dto.ts";

const BASE: string = "/player";

export async function getPlayer_api(): Promise<AxiosResponse<GetPlayerResDto>> {
  return await instance.get(`${BASE}`);
}
