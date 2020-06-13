import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import EmployeeAppController from "../../../controller/EmployeeAppController";

export default class EmployeesWorkSchedulePage extends React.Component<Properties, State> {
    render() {
        return (<>
            <PageHeader label={<Message messageKey={"page.employeesWorkSchedule.title"} args={["ФИО"]}/>}
                        hasButton={false}
                        buttonOnClick={() => {}}
            />
            {/*<div>*/}
                {/*<div>*/}
                    {/*<ConnectedSelect<Clinic, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>*/}
                        {/*controller={this.props.controller}*/}
                        {/*variant={"outlined"}*/}
                        {/*mapProperty={"clinicsByIdWithDefaultWorkSchedule"}*/}
                        {/*selectedItemProperty={"clinicsWorkScheduleSelectedClinic"}*/}
                        {/*itemToString={clinic => clinic.name!}*/}
                        {/*getKey={clinic => clinic && clinic.id ? clinic.id : 0}*/}
                        {/*label={<Message messageKey={"page.clinicsWorkSchedule.clinicSelect"}/>}*/}
                    {/*/>*/}
                    {/*{this.state.showDefaultScheduleCheckBox &&*/}
                    {/*<ConnectedCheckbox<EmployeeAppState>*/}
                        {/*controller={this.props.controller}*/}
                        {/*label={<Message messageKey={"page.clinicsWorkSchedule.userDefaultSchedule.label"}/>}*/}
                        {/*onClick={(checked: boolean) => this.props.controller.clinicsWorkScheduleActions.setUsesDefault(checked)}*/}
                        {/*value={this.state.useDefaultWorkSchedule}*/}
                    {/*/>*/}
                    {/*}*/}
                    {/*<div className={styles.workScheduleWrapper}>*/}
                        {/*<WorkScheduleTemplate*/}
                            {/*controller={this.props.controller}*/}
                            {/*schedule={this.state.workSchedule*/}
                                {/*? this.state.workSchedule.schedule*/}
                                {/*: new WorkSchedule(7)}*/}
                            {/*scheduleLength={"week"}*/}
                            {/*disabled={this.state.editingDisabled}*/}
                            {/*disabledTooltipLabel={<Message messageKey={"page.clinicsWorkSchedule.defaultWorkSchedule.disable.tooltip.label"}/>}*/}
                        {/*/>*/}
                    {/*</div>*/}
                {/*</div>*/}
            {/*</div>*/}
            {/*<DeviationsSection*/}
                {/*disabled={this.state.editingDisabled}*/}
                {/*controller={this.props.controller}*/}
            {/*/>*/}
        </>)
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {

}