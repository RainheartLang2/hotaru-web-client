import CacheSettings from "../../core/CacheSettings";
import {CacheVolatility} from "../../CacheVolaitlity";
import {CacheUtils} from "../../core/CacheUtils";
import CacheKey from "../../core/CacheKey";
import ExecutableCache from "../../core/ExecutableCache";
import {fetchUserZoneRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import EmployeeAppController from "./EmployeeAppController";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState,
    EmployeeStateContext
} from "../state/EmployeeApplicationStore";
import {SalesCategory, SalesCategoryBean} from "../../common/beans/SalesCategory";

export default class CacheManager {

    private controller: EmployeeAppController
    private store: EmployeeApplicationStore
    private settings: CacheSettings

    private clinicCacheKey = new CacheKey("clinic", CacheVolatility.EXTRA_LOW)
    private speciesCacheKey = new CacheKey("species", CacheVolatility.LOW)
    private breedCacheKey = new CacheKey("breed", CacheVolatility.LOW)
    private animalColorCacheKey = new CacheKey("animalColor", CacheVolatility.LOW)
    private salesCategoriesCacheKey = new CacheKey("salesCategories", CacheVolatility.LOW)

    private _clinicCache: EmployeeAppCache
    private _speciesCache: EmployeeAppCache
    private _breedCache: EmployeeAppCache
    private _animalColorCache: EmployeeAppCache
    private _salesCategoriesCache: EmployeeAppCache

    constructor(controller: EmployeeAppController, store: EmployeeApplicationStore) {
        this.controller = controller
        this.store = store
        this.settings = new CacheSettings(CacheUtils.getCacheLifetineSettings(),
            [
                this.clinicCacheKey,
                this.speciesCacheKey,
                this.breedCacheKey,
                this.animalColorCacheKey,
                this.salesCategoriesCacheKey
            ])


        this._clinicCache = new ExecutableCache(this.settings, [this.clinicCacheKey],
            (callback, context) => this.loadClinicList(callback, context))
        this._speciesCache = new ExecutableCache(this.settings, [this.speciesCacheKey],
            (callback, context) => this.loadSpecies([], callback, context))
        this._breedCache = new ExecutableCache(this.settings, [this.breedCacheKey],
            (callback, context) => this.loadBreeds([], callback, context))
        this._animalColorCache = new ExecutableCache(this.settings, [this.animalColorCacheKey],
            (callback, context) => this.loadAnimalColors(callback, context))
        this._salesCategoriesCache = new ExecutableCache(this.settings, [this.salesCategoriesCacheKey],
            (callback, context) => this.loadSalesCategories(callback, context))
    }

    get clinicCache(): EmployeeAppCache{
        return this._clinicCache;
    }

    get speciesCache(): EmployeeAppCache {
        return this._speciesCache;
    }

    get breedCache(): EmployeeAppCache {
        return this._breedCache;
    }

    get animalColorCache(): EmployeeAppCache {
        return this._animalColorCache;
    }

    get salesCategoriesCache(): EmployeeAppCache {
        return this._salesCategoriesCache;
    }

    private loadClinicList(callback: Function, context?: EmployeeStateContext): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClinics,
            successCallback: result => {
                this.store.setState({clinicList: result}, context)
                callback()
            },
        })
    }

    private loadSpecies(params: any[] = [], callback: Function = () => {}, context?: EmployeeStateContext): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllSpecies,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    speciesList: result
                }, context)
                callback(result)
            },
        })
    }

    private loadBreeds(params: any[] = [], callback: Function = () => {}, context?: EmployeeStateContext): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllBreeds,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    breedsList: result
                }, context)
                callback(result)
            },
        })
    }

    private loadAnimalColors(callback: Function = () => {}, context?: EmployeeStateContext): void {
        this.controller.dictionariesActions.loadList(RemoteMethods.getAllAnimalColors,
            "animalColorsList",
            callback,
            context)
    }

    private loadSalesCategories(callback: Function = () => {}, context?: EmployeeStateContext): void {
        this.controller.dictionariesActions.loadList(RemoteMethods.getAllSalesCategories,
            "salesCategoriesList",
            callback,
            context,
            result => {
                return (result as SalesCategoryBean[]).map(bean => new SalesCategory(bean))
            },
            )
    }
}

type EmployeeAppCache = ExecutableCache<EmployeeAppState, EmployeeAppSelectors>