import CacheSettings from "../../core/CacheSettings";
import {CacheVolatility} from "../../CacheVolaitlity";
import {CacheUtils} from "../../core/CacheUtils";
import CacheKey from "../../core/CacheKey";
import ExecutableCache from "../../core/ExecutableCache";
import {fetchUserZoneRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import EmployeeAppController from "./EmployeeAppController";
import EmployeeApplicationStore from "../state/EmployeeApplicationStore";

export default class CacheManager {

    private controller: EmployeeAppController
    private store: EmployeeApplicationStore
    private settings: CacheSettings

    private clinicCacheKey = new CacheKey("clinic", CacheVolatility.EXTRA_LOW)
    private speciesCacheKey = new CacheKey("species", CacheVolatility.LOW)
    private breedCacheKey = new CacheKey("breed", CacheVolatility.LOW)
    private animalColorCacheKey = new CacheKey("animalColor", CacheVolatility.LOW)

    private _clinicCache: ExecutableCache
    private _speciesCache: ExecutableCache
    private _breedCache: ExecutableCache
    private _animalColorCache: ExecutableCache

    constructor(controller: EmployeeAppController, store: EmployeeApplicationStore) {
        this.controller = controller
        this.store = store
        this.settings = new CacheSettings(CacheUtils.getCacheLifetineSettings(),
            [this.clinicCacheKey, this.speciesCacheKey, this.breedCacheKey, this.animalColorCacheKey])
        this._clinicCache = new ExecutableCache(this.settings, [this.clinicCacheKey], callback => this.loadClinicList(callback))
        this._speciesCache = new ExecutableCache(this.settings, [this.speciesCacheKey], callback => this.loadSpecies([], callback))
        this._breedCache = new ExecutableCache(this.settings, [this.breedCacheKey], callback => this.loadBreeds([], callback))
        this._animalColorCache = new ExecutableCache(this.settings, [this.animalColorCacheKey], callback => this.loadAnimalColors(callback))
    }

    get clinicCache(): ExecutableCache {
        return this._clinicCache;
    }

    get speciesCache(): ExecutableCache {
        return this._speciesCache;
    }

    get breedCache(): ExecutableCache {
        return this._breedCache;
    }

    get animalColorCache(): ExecutableCache {
        return this._animalColorCache;
    }

    private loadClinicList(callback: Function): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClinics,
            successCallback: result => {
                this.store.setState({clientList: result})
                callback()
            },
        })
    }

    private loadSpecies(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllSpecies,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    speciesList: result
                })
                callback(result)
            },
        })
    }

    private loadBreeds(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllBreeds,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    breedsList: result
                })
                callback(result)
            },
        })
    }

    private loadAnimalColors(callback: Function = () => {}): void {
        this.controller.dictionariesActions.loadList(RemoteMethods.getAllAnimalColors, "animalColorsList", callback)
    }
}