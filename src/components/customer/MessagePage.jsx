import React from 'react';
import { useLocation } from 'react-router-dom';

const MessagePage = () => {
    const location = useLocation();
    const message = new URLSearchParams(location.search).get('message');

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>
                {message}
            </h1>
        </div>
    );
};

export default MessagePage;
