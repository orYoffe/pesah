import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { storageRef } from '../helpers/firebase'

class FileInput extends Component {
    proptypes = {
        id: Proptypes.string,
        label: Proptypes.string,
        className: Proptypes.string,
        filePurpose: Proptypes.string.isRequired,
        userUid: Proptypes.string.isRequired,
        type: Proptypes.string.isRequired,
    }

    onFileChange = e => {
        e.stopPropagation()
        e.preventDefault()
        this.upload(e)
    }
    upload = (e) => {
        const { userUid, filePurpose, type } = this.props
        if (!userUid || !filePurpose) {
            return
        }
        const file = e.target.files[0]
        const metadata = {
            'contentType': file.type
        }
        let storageRoot = 'images'
        if (type === 'track') {
          storageRoot = 'tracks'
        }
        if (storageRoot === 'images' && metadata.contentType.startsWith('image/')) {
            storageRef.child(`${storageRoot}/${userUid}/${filePurpose}.png`).put(file, metadata).then(snapshot => {
                console.log('Uploaded', snapshot.totalBytes, 'bytes.')
                console.log(snapshot.metadata)
                const url = snapshot.downloadURL
                console.log('File available at', url)
                // TODO remove reload nad get the picture
                window.location.reload()
            }).catch((error) => {
                console.error('Upload failed:', error)
            })
        } else if (storageRoot === 'tracks' && metadata.contentType.startsWith('audio/')) {
            // let hasRightFormat = false
            //
            // switch (metadata.contentType) {
            //     case 'audio/flac':
            //     case 'audio/wav':
            //     case 'audio/aif':
            //         hasRightFormat = true
            //         break;
            //     default:
            //
            // }
            // if (hasRightFormat) {
                storageRef.child(`${storageRoot}/${userUid}/${filePurpose}.flac`).put(file, metadata).then(snapshot => {
                    console.log('Uploaded', snapshot.totalBytes, 'bytes.')
                    console.log(snapshot.metadata)
                    const url = snapshot.downloadURL
                    console.log('File available at', url)
                    // TODO remove reload nad get the picture
                    window.location.reload()
                }).catch((error) => {
                    console.error('Upload failed:', error)
                })
            // }
        }
    }

    render() {
        const { className, label, id } = this.props
        return (
            <div className={`form-group ${className} `}>
                <label htmlFor={id}>{label}</label>
                <input
                    className="form-control"
                    type="file"
                    onChange={this.onFileChange}
                    id={id} />
            </div>
        )
    }
}

export default FileInput
