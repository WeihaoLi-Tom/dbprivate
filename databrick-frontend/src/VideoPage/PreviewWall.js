import React, { useState, useEffect, useRef } from 'react';
import "./PreviewWall.css";
import { westWallBricks, eastWallBricks } from "./Wall.js";
import VideoPlayerModal from "./VideoPlayerModal.js";

const PreviewWall = ({ isWest, videos, setVideos }) => {
    const [brickWall, setBrickWall] = useState({});
    const [columnNumber, setColumnNumber] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null); 
    const [isPlaying, setIsPlaying] = useState(false); // Simultaneouly play videos 
    const videoRefs = useRef({}); // store Ref

    useEffect(() => {
        if (isWest) {
            setBrickWall(westWallBricks);
            setColumnNumber(26);
        } else {
            setBrickWall(eastWallBricks);
            setColumnNumber(21);
        }
    }, [isWest]);

    useEffect(() => {
        videoRefs.current = {}; // Reset refs
        const videoElements = Array.from(document.querySelectorAll('video'));

        const handleCanPlay = (video) => {
            // Handle video ready to play
        };

        const handleError = (video) => {
            // Handle video load error
            console.error(`Failed to load video: ${video.src}`);
        };

        videoElements.forEach(videoElement => {
            videoElement.addEventListener('canplay', () => handleCanPlay(videoElement));
            videoElement.addEventListener('error', () => handleError(videoElement));
        });

        return () => {
            videoElements.forEach(videoElement => {
                videoElement.removeEventListener('canplay', () => handleCanPlay(videoElement));
                videoElement.removeEventListener('error', () => handleError(videoElement));
            });
        };
    }, [videos]);

    useEffect(() => {
        if (isPlaying) {
            Object.values(videoRefs.current).forEach(videoRef => {
                if (videoRef) {
                    videoRef.currentTime = 0; // Reset time to start
                    videoRef.play();
                }
            });
        } else {
            Object.values(videoRefs.current).forEach(videoRef => {
                if (videoRef) {
                    videoRef.pause();
                }
            });
        }
    }, [isPlaying]);

    const columns = Array.from({ length: columnNumber }, (_, i) => i + 1);

    const handleClickVideo = (video) => {
        setSelectedVideo(video);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const generateGrid = () => {
        const rows = [];
        const letters = "ABCDEFGHIJKL";

        for (let i = 0; i < 12; i++) { // 13 Rows
            const bricks = [];

            for (let j = 1; j <= columnNumber; j++) { // Columns
                const brickLoc = `${letters[i]}${isWest ? j : j + 26}`;
                const brickId = brickWall[brickLoc];
                
                // matching each brick with its video
                const assignedVideo = videos.find(video => { return video.locations.some(location => location.location_number === Number(brickId));})

                bricks.push(
                    <div
                        key={brickLoc}
                        className={`preview-grid ${brickId ? 'preview-brick ' + brickId : ''}`}
                        onClick={() => assignedVideo && handleClickVideo(assignedVideo)} // Click a video for detail
                    >
                        {assignedVideo ? (
                            <div className="preview-video-container">
                                <video
                                    ref={el => (videoRefs.current[brickLoc] = el)} // Use brickLoc as unique key for ref
                                    className='preview-video-hidden' // Apply the class to hide controls
                                    src={assignedVideo.file}
                                    preload="auto"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : ''}
                    </div>
                );
            }

            rows.push(
                <div
                    key={letters[i]}
                    className='preview-grid-row'
                >
                    <div className="preview-row-label">
                        {letters[i]}
                    </div>
                    {bricks}
                </div>
            );
        }

        return rows;
    };

    return (
        <div className="preview-wall-container">
            <div className="preview-grid-container">
                <div className="preview-wall-header">
                    <h1 className='preview-wall-title'>{isWest ? "WEST WALL" : "EAST WALL"}</h1>
                    <div className="preview-controls">
                        <button className={"preview-play-button"} onClick={handlePlayPause}>
                            {isPlaying ? 'Pause All' : 'Play All'}
                        </button>
                    </div>
                </div>
                <div className="preview-column-header">
                    <div></div> {/* Empty grid for alignment */}
                    {columns.map(col => (
                        <div key={col} className="preview-column-header">
                            {col}
                        </div>
                    ))}
                </div>
                {generateGrid()}
            </div>
            {selectedVideo && <VideoPlayerModal video={selectedVideo} onClose={handleCloseVideo}/>}
        </div>
    );
};

export default PreviewWall;