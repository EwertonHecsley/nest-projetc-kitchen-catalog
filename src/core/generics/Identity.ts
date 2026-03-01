import { randomUUID } from "node:crypto";

export default class Identity{
    private readonly value:string;

    constructor(value?:string){
        this.value = value ?? randomUUID();
    }

    get id():string{
        return this.value;
    }
}