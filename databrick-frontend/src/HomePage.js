import React from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./HomePage.css";
import VideoPage from "./VideoPage/VideoPage";

// Main Section Backgroung image
const MainSectionBackground = () => {
    return (
        <div className="main-section-background">
            <img 
                src="/main/background_image.jpg" 
                alt="databrick"
            />
        </div>
    );
};

// Main Section
const MainSection = () => {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('video-page');
    };

    return (
        <div className="main-section">
                <h1 className="title">DATABRICK</h1>
                <button className="showcase-button">Showcase Your Digital Art</button>
                <button className="login-button" onClick={handleLoginClick}>Artist Login</button>
        </div>
    );
};

// Featured Artists
const FeaturedArtists = () => {
    return (
        <section className="featured-artists">
            <h2>Featured Artists</h2>
            <div className="john-smith">
                <img src="/main/John_Smith.webp" alt="John Smith" />
                <h1>John Smith</h1>
                <h1>Co-Founder of Pixelwave Collective</h1>
            </div>
            <div className="emily-davis">
                <img src="/main/Emily_Davis.webp" alt="Emily Davis" />
                <h1>Emily Davis</h1>
                <h1>Digital Art Curator at ArtHub</h1>
            </div>
            <div className="max-cooper">
                <img src="/main/Max_Cooper.webp" alt="Max Cooper" />
                <h1>Max Cooper</h1>
                <h1>Lead Visual Designer at TechVisions</h1>
            </div>
            <div className="ava-johnson">
                <img src="/main/Ava_Johnson.webp" alt="Ava Johnson" />
                <h1>Ava Johnson</h1>
                <h1>Freelance Digital Illustrator</h1>
            </div>
        </section>
    );
};

const HomePage = () => {

    return(
        <Router>
            <Routes>
                <Route path="/" element={<>
                                            <MainSectionBackground/>
                                            <MainSection/>
                                            <FeaturedArtists/>
                                        </>}/>
                <Route path="/video-page" element={<VideoPage/>}/>
            </Routes>
        </Router>
    );
}

export default HomePage;