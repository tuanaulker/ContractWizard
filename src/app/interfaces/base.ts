import { RoomType } from "./roomType";

export interface Base{
    code: RoomType["code"];
    name: RoomType["name"];
    basePrice: number[];
    dateId: number;
}