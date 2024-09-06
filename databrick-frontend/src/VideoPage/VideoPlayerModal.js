import React, { useRef, useEffect, useState } from "react";
import "./VideoPlayerModal.css";

const VideoPlayerModal = ({ video, onClose }) => {
    const videoRef = useRef(null);  // Reference to the video element
    // const [videoSrc, setVideoSrc] = useState('');

    // useEffect(() => {
    //     if (video) {
    //         const fetchVideo = async () => {
    //             try {
    //                 const response = await fetch(video.file); 
    //                 const videoBlob = await response.blob();
    //                 const videoObjectURL = URL.createObjectURL(videoBlob);
    //                 setVideoSrc(videoObjectURL);
    //             } catch (error) {
    //                 console.error('Error fetching video:', error);
    //             }
    //         };

    //         fetchVideo();

    //         // Cleanup: Revoke the object URL when the component unmounts or the video changes
    //         return () => {
    //             if (videoSrc) {
    //                 URL.revokeObjectURL(videoSrc); 
    //             }
    //         };
    //     }
    // }, [video]); // Add videoSrc to dependencies to handle URL cleanup properly

    if (!video)
        return;

    return (
        <div className="video-player-modal">
            <div className="video-player-content">
                <button onClick={onClose} className="close-button">X</button>
                <h1>{video.title}</h1>
                <video ref={videoRef} controls autoPlay src={video.file} className='video-player'/>
            </div>
        </div>
    )
}

export default VideoPlayerModal;