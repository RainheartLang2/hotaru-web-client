import CrudNode from "../../../core/mvc/crud/CrudNode";
import Breed from "../../../common/beans/Breed";
import {AdminStateProperty} from "../AdminApplicationState";
import Species from "../../../common/beans/Species";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class BreedNode extends CrudNode<Breed> {

    constructor(store: ApplicationStoreFriend) {
        super(store)

        this.store.registerProperty(AdminStateProperty.BreedPageSelectedSpecies, null)
        this.store.registerSelector(AdminStateProperty.BreedsBySpecies, {
            dependsOn: [AdminStateProperty.BreedsList],
            get: map => {
                const breedsList = this.getList()
                return CollectionUtils.mapArrayByPredicate(breedsList, breed => breed.speciesId)
            }
        })
        this.store.registerSelector(AdminStateProperty.BreedsForCurrentSpecies, {
            dependsOn: [AdminStateProperty.BreedPageSelectedSpecies, AdminStateProperty.BreedsBySpecies],
            get: map => {
                const breedsBySpecies = map.get(AdminStateProperty.BreedsBySpecies) as Map<number, Breed[]>
                const selectedSpecies = map.get(AdminStateProperty.BreedPageSelectedSpecies) as Species
                if (selectedSpecies && selectedSpecies.id && breedsBySpecies.get(selectedSpecies.id)) {
                    return breedsBySpecies.get(selectedSpecies.id)
                } else {
                    return []
                }
            }
        })

        this.store.registerProperty(AdminStateProperty.EditedBreedId, null)
        this.store.registerProperty(AdminStateProperty.EditedBreedName, "")
        this.store.registerField(AdminStateProperty.AddedBreedName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(200),
            ])
    }

    buildBasedOnFields(): Breed {
        return {
            id: this.store.getPropertyValue(AdminStateProperty.EditedBreedId),
            name: this.store.getPropertyValue(AdminStateProperty.EditedBreedName),
            speciesId: (this.store.getPropertyValue(AdminStateProperty.BreedPageSelectedSpecies) as Species).id
        }
    }

    protected getListPropertyName(): string {
        return AdminStateProperty.BreedsList;
    }

    protected getMapByIdPropertyName(): string {
        return AdminStateProperty.BreedsListById;
    }

    public getAddedBreedName(): string {
        return this.store.getFieldValue(AdminStateProperty.AddedBreedName)
    }

    public getSelectedSpecies(): Species {
        return this.store.getPropertyValue(AdminStateProperty.BreedPageSelectedSpecies)
    }
}