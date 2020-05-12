import {CacheVolatility} from "../CacheVolaitlity";

export default class CacheKey {
    private _name: string
    private _volatility: CacheVolatility


    constructor(name: string, volatility: CacheVolatility) {
        this._name = name;
        this._volatility = volatility;
    }


    get name(): string {
        return this._name;
    }

    get volatility(): CacheVolatility {
        return this._volatility;
    }
}