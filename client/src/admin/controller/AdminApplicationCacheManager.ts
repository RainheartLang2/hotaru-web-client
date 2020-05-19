import CacheSettings from "../../core/CacheSettings";
import AdminAppController from "./AdminAppController";
import {CacheVolatility} from "../../CacheVolaitlity";
import {CacheUtils} from "../../core/CacheUtils";
import CacheKey from "../../core/CacheKey";
import ExecutableCache from "../../core/ExecutableCache";
import AdminApplicationState from "../state/AdminApplicationState";
import {fetchUserZoneRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {Clinic} from "../../common/beans/Clinic";
import EmployeeAppController from "./EmployeeAppController";
import EmployeeApplicationStore from "../state/EmployeeApplicationStore";

export default class CacheManager {

    private controller: EmployeeAppController
    private store: EmployeeApplicationStore
    private settings: CacheSettings

    private clinicCacheKey = new CacheKey("clinic", CacheVolatility.EXTRA_LOW)
    private _clinicCache: ExecutableCache

    constructor(controller: EmployeeAppController, store: EmployeeApplicationStore) {
        this.controller = controller
        this.store = store
        this.settings = new CacheSettings(CacheUtils.getCacheLifetineSettings(),
            [this.clinicCacheKey])
        this._clinicCache = new ExecutableCache(this.settings, [this.clinicCacheKey], callback => this.loadClinicList(callback))
    }

    get clinicCache(): ExecutableCache {
        return this._clinicCache;
    }

    private loadClinicList(callback: Function): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClinics,
            successCallback: result => {
                this.store.setState({userList: result})
                callback()
            },
        })
    }
}
