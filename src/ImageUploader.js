import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from './firebase';
import firebase from 'firebase';
import './ImageUploader.css';

function ImageUploader({ username }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }

    };

    const handleUpload = () => {
        //uploading code
        const uploadTask = storage.ref('images/' + (image.name)).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //complete
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()  //download link for uploaded data
                    .then(url => {
                        //post image in database
                        db.collection('Posts').add({
                            //timestamp for sorting chronologically
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    })
            }
        );
    };

    return (
        <div className='uploadImage'>
            <progress value={progress} max='100' />
            {/* <div className='uploadImage-input'> */}
            <input type='text' className='input-addingComment' placeholder='Enter a caption' onChange={(event) => setCaption(event.target.value)} value={caption} />
            <input type='file' className='input-chooseFile' onChange={handleChange} />
            {/* </div> */}
            <Button onClick={handleUpload}> UPLOAD </Button>
        </div>
    )
}

export default ImageUploader
