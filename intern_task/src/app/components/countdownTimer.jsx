"use client";
import { useEffect, useState } from "react";
import styles from "./countdownTimer.module.css"; // Import CSS module

export default function CountdownTimer() {
    const eventDate = new Date("2025-05-06T00:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [progress, setProgress] = useState(100);

    function calculateTimeLeft() {
        const now = new Date().getTime();
        const difference = eventDate - now;

        return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const time = calculateTimeLeft();
            setTimeLeft(time);
            const initialDuration = eventDate - new Date("2024-09-01T00:00:00").getTime();
            const progressPercentage = (time.total / initialDuration) * 100;
            setProgress(progressPercentage);
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.subtitleContainer}>
                <p className={styles.subtitle}>See You In</p>
                <hr className={styles.line} />
            </div>
            {/* Timer Container */}
            <div className={styles.timerContainer}>
                <TimeBlock value={timeLeft.days} label="DAY" />
                <TimeBlock value={timeLeft.hours} label="HOUR" />
                <TimeBlock value={timeLeft.minutes} label="MIN" />
                <TimeBlock value={timeLeft.seconds} label="SEC" />
            </div>

        </div>
    );
}



function TimeBlock({ value, label }) {
    return (
        <div className={styles.timeBlock}>
            <p className={styles.timeValue}>{value}</p>
            <span className={styles.label}>{label}</span>
        </div>
    );
}
