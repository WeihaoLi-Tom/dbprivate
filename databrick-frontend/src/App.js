
import React, { useState, useEffect } from "react";
import HomePage from './HomePage';
import "./App.css"; 

// Header
const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src="/main/university_logo.webp" alt="University Logo" />
                <h1 style={{margin: 10}}>Science Gallery</h1>
            </div>
            <button className="back-button">Back</button>
        </header>
    );
};

const App = () => {
    // Demo data retrieval
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // todo - find a way to take this url from .env VITE_API_URL
        const url = "http://127.0.0.1:8000/api/posts/";
        // const url = "http://127.0.0.1:8000/api/videos/";
        console.log("Fetching: ", url)

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) { return <div>Loading...</div>; }
    if (error) { return <div>Error: {error}</div>; }

    return (
        <div className="App">
            <Header/>
            <HomePage/>
        </div>
    );
};

export default App;
