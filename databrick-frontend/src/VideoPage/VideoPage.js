import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import './VideoPage.css';
import VideoList from './VideoList';
import Wall from './Wall';

const VideoPage = () => {

    const [westWallVideos, setWestWallVideos] = useState([]);
    const [eastWallVideos, setEastWallVideos] = useState([]);
    const [videoList, setVideoList] = useState([]);

    useEffect(() => {
        // Fetch video data from Django backend
        Promise.all([
            axios.get('http://localhost:8000/api/videos/'),
            axios.get('http://localhost:8000/api/locations/')
        ])
        .then(([videoResponse, locationResponse]) => {
            const videos = videoResponse.data;
            const locations = locationResponse.data;

            // matching each video with its assigned locations
            const updatedVideos = videos.map(video => {
                const relatedLocations = locations.filter(location => location.video === video.id && location.show === video.show);
                return {
                    ...video,
                    locations: relatedLocations
                };
            });

            setVideoList(updatedVideos);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '100px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '80%', position: 'relative' }}>
                <Wall isWest={true} />
                <Wall isWest={false} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <VideoList droppableId="video-list" videos={videoList} setVideos={setVideoList} style={{ position: 'fixed' }} />
            </div>
        </div>
    );
}

export default VideoPage;