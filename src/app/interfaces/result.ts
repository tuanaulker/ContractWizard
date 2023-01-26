import { RoomType } from "./roomType";

export interface Result {
    roomTypecode: RoomType["code"],
    roomTypeName: RoomType["name"],
    priceName: string,
    multiplier: number,
    price: number[]   
}