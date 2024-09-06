import React, { useState } from 'react';
import axios from 'axios';
import VideoUploadModal from './VideoUploadModal';
import VideoPlayerModal from './VideoPlayerModal';
import PreviewModal from './PreviewModal';
import './VideoList.css'

const VideoList = ({ droppableId, videos, setVideos }) => {
    const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [videoToPlay, setVideoToPlay] = useState(null); // To track the selected video for playing

    const handleSelectVideo = (id) => {
        if (selectedVideoId === id) {
            setSelectedVideoId(null); // Deselect if already selected
        } else {
            setSelectedVideoId(id); // Select if not already selected
        }
    };

    const handleOpenVideo = (event, video) => {
        event.stopPropagation(); // Prevent event bubbling to handleSelectVideo
        setVideoToPlay(video); // Set the selected video for playing
    };

    const handleCloseVideo = () => {
        setVideoToPlay(null); // Close video when user finishes watching
    };

    const handleDelete = async(id) => {
        // Link with Backend
        try {
            await axios.delete(`http://localhost:8000/api/videos/${id}/`);
            setVideos(prevVideos => prevVideos.filter(video => video.id !== id));
        } catch (error) {
            console.error("Error deleting video:", error);
        }

        // // Only Frontend
        // const videoToRemove = videos.find(video => video.id === id);
        // if (videoToRemove && videoToRemove.file) {
        //     URL.revokeObjectURL(videoToRemove.file); // Clean up the object URL
        // }
        
        // const updateVideoList = videos.filter(video => video.id !== id);
        // setVideos(updateVideoList);
    }

    const handleUpload = () => {
        setShowVideoUploadModal(true);
    }

    const handleCloseVideoUploadModal = () => {
        setShowVideoUploadModal(false);
    }

    const handlePreview = () => {
        setShowPreviewModal(true);
    }

    const handleClosePreviewModal = () => {
        setShowPreviewModal(false);
    }

    return (
        <div className='video-list'>
            <h1 className='video-list-title'>Videos</h1>
            <div className='video-list-content'>
                {videos.map((video) => (
                    <div 
                    key={video.id} 
                    className={`video-list-item ${selectedVideoId === video.id ? 'selected' : ''}`} 
                    onClick={() => handleSelectVideo(video.id)}>
                        <div className='video-list-item-info'>
                            <p 
                                className='video-list-item-info-title'
                                onClick={(event) => handleOpenVideo(event, video)} // Open video on click
                            >
                                {video.title}
                            </p>
                        </div>
                        <div className='video-list-item-actions'>
                            <button onClick={() => handleDelete(video.id)} className='delete-button'>
                                <img src="/VideoPage/delete_icon.png" alt="delete-icon"/>
                            </button>
                        </div>
                    </div>
                ))
                }
            </div>
            <div className='video-list-buttons'>
                <button className='upload-button' onClick={handleUpload}>upload</button>
                <button className='preview-button' onClick={handlePreview}>preview</button>
            </div>
            <VideoUploadModal show={showVideoUploadModal} onClose={handleCloseVideoUploadModal} videos={videos} setVideos={setVideos}/>
            <VideoPlayerModal video={videoToPlay} onClose={handleCloseVideo}/>
            <PreviewModal show={showPreviewModal} onClose={handleClosePreviewModal} videos={videos} setVideos={setVideos}/>
        </div>
    );
}

export default VideoList;