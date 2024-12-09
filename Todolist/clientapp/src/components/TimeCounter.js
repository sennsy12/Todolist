// components/TimeCounter.jsx
import React, { useState, useEffect } from 'react';
import './TimeCounter.css';

const TimeCounter = ({ dueDateTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [status, setStatus] = useState('normal');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const due = new Date(dueDateTime).getTime();
            const difference = due - now;

            if (difference <= 0) {
                setStatus('expired');
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });

            // status basert på gjenværende tid
            if (days === 0 && hours < 24) {
                setStatus(hours < 2 ? 'critical' : 'warning');
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [dueDateTime]);

    return (
        <div className={`time-counter ${status}`}>
            {status === 'expired' ? (
                <span>Forfalt</span>
            ) : (
                <div className="time-segments">
                    {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
                    <span>{timeLeft.hours}t </span>
                    <span>{timeLeft.minutes}m </span>
                    <span>{timeLeft.seconds}s</span>
                </div>
            )}
        </div>
    );
};

export default TimeCounter;
