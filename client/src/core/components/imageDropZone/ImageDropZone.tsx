import * as React from "react";
import {DropEvent, DropzoneOptions, useDropzone} from "react-dropzone";
import {Message} from "../Message";
import {FileUtils} from "../../utils/FileUtils";

var styles = require("./styles.css");

export default class ImageDropZone extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            image: null,
        }
    }

    render() {
        return (
            <DropZone
                onDropAccepted={(files: File[], event: DropEvent) => {
                    FileUtils.fileToBase64(files[0], (result: string) => this.props.onImageChange(result))
                }}
                image={this.props.image}
                dropZoneNoteKey={this.props.dropZoneNoteKey}
            />
        )
    }
}

function DropZone(props: DropZoneProperties) {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        onDropAccepted: props.onDropAccepted,
        accept: 'image/jpeg, image/png',
    })

    return (
            <div {...getRootProps({className: styles.container})}>
                <input {...getInputProps()} />
                {props.image
                    ? <img width={300} height={300} src={props.image}/>
                    : <div className={styles.dropZoneArea}>
                        <div className={styles.content}>
                            <div>
                                <Message messageKey={props.dropZoneNoteKey}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
    )
}

type Properties = {
    dropZoneNoteKey: string,
    image: string | null,
    onImageChange: (image: string) => void,
}

type DropZoneProperties = {
    onDropAccepted: (files: File[], event: DropEvent) => void,
    image: string | null,
    dropZoneNoteKey: string
}

type State = {
}