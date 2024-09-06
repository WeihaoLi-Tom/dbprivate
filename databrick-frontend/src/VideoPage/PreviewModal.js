import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './PreviewModal.css';
import PreviewWall from './PreviewWall';

const PreviewModal = ({ show, onClose, videos, setVideos }) => {

    // Helper function to reduce code repetition
    const resetModal = (status = null) => {

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

    return (
        <div class="preview-modal">
            <div className='preview-modal-content'>
                <button onClick={() => { onClose(); resetModal(); }} className="preview-modal-back-button">X</button>
                <div style={{ display: 'flex', flexDirection: 'column', width: '75%', position: 'relative' }}>
                    <PreviewWall isWest={true} videos={videos} setVideos={videos} />
                    <PreviewWall isWest={false} videos={videos} setVideos={videos}/>
                </div>
            </div>
        </div>
    )
}

export default PreviewModal;