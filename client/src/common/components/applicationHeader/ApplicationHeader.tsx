import * as React from "react";
import {AppHeader} from "../../../core/components";
import SettingsIcon from '@material-ui/icons/SettingsSharp';
import CustomContentButton from "../../../core/components/iconButton/CustomContentButton";
import {Message} from "../../../core/components/Message";
import CustomPopover from "../../../core/components/customPopover/CustomPopover";
import EmployeeAppController from "../../../admin/controller/EmployeeAppController";
import SettingsPopoverContent from "./subcomponents/settingsPopoverContent/SettingsPopoverContent";

var styles = require("./styles.css");

export default class ApplicationHeader extends React.Component<Properties> {
    private settingsPopover: CustomPopover | null = null

    render() {
        const closeSettingsPopover = () => {
            if (this.settingsPopover) {
                this.settingsPopover.close()
            }
        }
        const settingsPopoverContent = <SettingsPopoverContent
            controller={this.props.controller}
            onAnyMenuItemClick={closeSettingsPopover}/>

        return (<AppHeader position={"static"}>
            <div className={styles.applicationHeader}>
                <div className={styles.navigationMenu}>
                    {this.props.children}
                </div>
                <div className={styles.profileAreaWrapper}>
                    <div className={styles.profileArea}>
                        <CustomPopover
                            popoverContent={() => settingsPopoverContent}
                            getRef={(popover: CustomPopover) => this.settingsPopover = popover}
                        >
                            <CustomContentButton
                                onClick={() => {}}
                                tooltipContent={<Message messageKey={"navigationMenu.settingsIcom.tooltip.label"}/>}
                            >
                                <SettingsIcon color={"inherit"} fontSize={"small"}/>
                            </CustomContentButton>
                        </CustomPopover>
                        <div className={styles.profileSeparator}/>
                        <CustomContentButton
                            onClick={() => this.props.onUserNameClick()}
                            tooltipContent={<Message messageKey={"navigationMenu.editProfile.tooltip.label"}/>}
                        >
                            {this.props.userName}
                        </CustomContentButton>
                        <div className={styles.profileSeparator}/>
                        <CustomContentButton
                            onClick={() => this.props.onLogOutClick()}
                            tooltipContent={<Message messageKey={"navigationMenu.logout.tooltip.label"}/>}
                        >
                            <Message messageKey={"navigationMenu.logout.label"}/>
                        </CustomContentButton>
                    </div>
                </div>
            </div>
        </AppHeader>)
    }
}

type Properties = {
    controller: EmployeeAppController
    userName: string,
    onUserNameClick: () => void;
    onLogOutClick: () => void;
}