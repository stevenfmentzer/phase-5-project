import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import '../styling/TextBox.css';

function TextBox({ inbox, onSubmit, onHeightChange }) {
    const [formData, setFormData] = useState({
        sender_id: '',
        recipient_id: '',
        message_body: '',
        delivery_time: '',
    });
    const [textareaHeight, setTextAreaHeight] = useState(37);
    const [delayTime, setDelayTime] = useState(0);
    const [sliderActive, setSliderActive] = useState(false);
    const [mouseDownTime, setMouseDownTime] = useState(0);
    const [thumbPosition, setThumbPosition] = useState(0); // New state for thumb position
    const sliderRef = useRef(null);

    // Reset delayTime when inbox changes
    useEffect(() => {
        setDelayTime(0);
        setThumbPosition(0)
    }, [inbox]);

    useEffect(() => {
        if (inbox && inbox.length > 0) {
            setFormData({
                sender_id: `${inbox[0].user_id}`,
                recipient_id: `${inbox[0].contact_user_id}`,
                message_body: ""
            });
        }
    }, [inbox]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        adjustTextareaHeight(e.target);
    };

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto';
        const newHeight = textarea.scrollHeight;
        setTextAreaHeight(newHeight);
        textarea.style.height = `${newHeight}px`;
    };

    useEffect(() => {
        onHeightChange(textareaHeight);
    }, [textareaHeight, onHeightChange]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, 'messages', 'POST');
        setTextAreaHeight(37);
    };

    const handleSliderMouseDown = () => {
        setSliderActive(true);
        setMouseDownTime(Date.now());
    };

    const handleSliderMouseUp = () => {
        setSliderActive(false);
    
        // Reset slider thumb position and transition
        const thumb = sliderRef.current.querySelector('.delay-slider-thumb');
        if (thumb) {
            thumb.style.transition = ''; // Reset transition
            thumb.style.bottom = '0%'; // Reset thumb position
        }
    
        const mouseUpTime = Date.now();
        const timeDifference = mouseUpTime - mouseDownTime;
        console.log(`Click Time: ${timeDifference}`)
        if (timeDifference < 250) {
            if (!delayTime) {
                const random = Math.floor(Math.random() * 1440) + 1
                setDelayTime(random)
                console.log(`Set Random Value: ${random}`);
            } else { 
                setDelayTime(0)
                console.log("Turn Off Delay")
            }
        }
    };

    const handleSliderMouseMove = (e) => {
        if (sliderActive) {
            const sliderRect = sliderRef.current.getBoundingClientRect();
            const sliderHeight = sliderRect.height;
            const offsetY = sliderRect.bottom - e.clientY; // Calculate offset from the bottom of the slider
            const newValue = Math.max(0, Math.min(1440, Math.round(offsetY / sliderHeight * 1440)));
            console.log(`Slider Value: ${newValue}`)
            setDelayTime(newValue);
            setThumbPosition((newValue / 1440) * 100); // Update thumb position
        }
    };

    useEffect(() => {
        if (sliderActive) {
            window.addEventListener('mousemove', handleSliderMouseMove);
            window.addEventListener('mouseup', handleSliderMouseUp);
        } else {
            window.removeEventListener('mousemove', handleSliderMouseMove);
            window.removeEventListener('mouseup', handleSliderMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleSliderMouseMove);
            window.removeEventListener('mouseup', handleSliderMouseUp);
        };
    }, [sliderActive, handleSliderMouseMove, handleSliderMouseUp]);


    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    return (
        <div className="textbox-wrapper">
            <div className='textbox-background-blur'></div>
            <div className="textbox-overlay"></div>
            <div className="textbox-container">
                <form onSubmit={handleSubmit}>
                    <div className="textbox-input-container">
                        <textarea
                            rows="1"
                            type="text"
                            name="message_body"
                            placeholder="Message..."
                            value={formData.message_body}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        {formData.message_body.length > 0 && (
                            <div className="button-wrapper">
                                <div className="delay-slider-container">
                                    <div className="delay-slider-track" ref={sliderRef}>
                                        <div
                                            className="delay-slider-thumb"
                                            onMouseDown={handleSliderMouseDown}
                                            style={{ bottom: `${thumbPosition}%` }} // Set thumb position
                                        >
                                            <Icon
                                                name="clock outline"
                                                style={{
                                                    fontSize: '1.5em',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: delayTime > 0 ? '#5E8EF8' : 'lightgrey',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="send-button"
                                    type="submit"
                                >
                                {delayTime ? (
                                    <p
                                        style={{
                                        
                                            color: 'white',
                                            position: 'relative',
                                            top: '-9px',
                                            fontFamily: 'Fugaz One',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {formatTime(Date.now() + delayTime * 60000)}
                                    </p>
                                ) : (
                                    <Icon
                                        name="paper plane large"
                                        style={{
                                            color: 'white',
                                            position: 'relative',
                                            top: '-2.5px',
                                            marginRight: '3px',
                                            transform: 'rotate(29deg)'
                                        }}
                                    />
                                )}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TextBox;