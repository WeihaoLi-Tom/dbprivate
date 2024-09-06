import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './VideoUploadModal.css';

const VideoUploadModal = ({ show, onClose, videos, setVideos }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(null);  // 'success', 'error', or null
    const [errorMessage, setErrorMessage] = useState('');      // Error message to display
    const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(null);

    // Helper function to reduce code repetition
    const resetModal = (status = null) => {
        setUploadStatus(status);
        setErrorMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    }

    // Clear upload status + error message on modal close
    useEffect(() => {
        if (!show) {
            resetModal();
        }
    }, [show]);

    if (!show) {
        return null;
    }

    //check file type
    const allowedTypes = ['video/mp4', 'image/gif', 'image/jpeg'];

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setUploadProgress(0);  // Reset progress bar
        setUploadStatus(null);  // Clear any previous upload status
        setErrorMessage('');    // Clear any previous error message
        setEstimatedTimeLeft(null);
    };

    const handleUpload = async () => {

        // Detect same name video, need to be tested
        const sameNameVideo = videos.some(video => video.title === selectedFile.name);
        if (sameNameVideo) {
            alert("A video with the same name already exists!");
            return;
        }

        if (selectedFile) {
            // Link with backend
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', selectedFile.name);
            // todo - currently fixed, should be passed from outside this page
            formData.append('show', 2)

            const startTime = Date.now(); // Set the start time when the upload begins

            try {
                // Upload file to Django backend
                const response = await axios.post('http://localhost:8000/api/videos/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);

                        // Calculate elapsed time
                        const elapsedTime = (Date.now() - startTime) / 1000; // in seconds

                        // Avoid division by zero or negative values
                        if (elapsedTime > 0 && progressEvent.loaded > 0) {
                            // Calculate average speed (bytes per second)
                            const averageSpeed = progressEvent.loaded / elapsedTime;

                            // Estimate remaining time (seconds)
                            const remainingBytes = progressEvent.total - progressEvent.loaded;
                            const timeLeft = remainingBytes / averageSpeed;

                            setEstimatedTimeLeft(timeLeft);
                        }
                    }
                });

                // Add the uploaded video to the video list
                setVideos(prevVideos => [
                    ...prevVideos,
                    response.data, // Assuming response contains video details
                ]);
                // Clear uploaded file in modal
                resetModal('success');
            } catch (error) {
                console.error("Error uploading file:", error);
                // Handle error response
                if (error.response && error.response.data && error.response.data.file) {
                    setErrorMessage(error.response.data.file);
                } else {
                    setErrorMessage('An unexpected error occurred.');
                }
                setUploadStatus('error');
            }
        }
    }

    const renderUploadFeedback = () => {
        if (uploadStatus === 'success') {
            return <p className="upload-feedback success">Upload successful!</p>;
        }
        if (uploadStatus === 'error') {
            return <p className="upload-feedback error">Upload failed: {errorMessage}</p>;
        }
        return null;
    };

    return (
        <div class="upload-modal">
            <div className="upload-modal-content">
                <button onClick={() => { onClose(); resetModal(); }} className="back-button">X</button>
                <h1>Upload Videos</h1>
                <input type="file" accept={allowedTypes} ref={fileInputRef} onChange={handleFileChange} />
                {selectedFile && (
                    <>
                        <div className='upload-progress-bar'>
                            <div
                                className='upload-progress-bar-fill'
                                style={{ width: `${uploadProgress + '%'}` }} />
                        </div>
                        <p>{uploadProgress}% completed</p>
                        {estimatedTimeLeft !== 0 && <p>Estimated time left: {Math.round(estimatedTimeLeft)} seconds</p>}
                        <button onClick={handleUpload}>Upload Video</button>
                    </>
                )}
                {uploadStatus && renderUploadFeedback()}
            </div>
        </div>
    )
}

export default VideoUploadModal;