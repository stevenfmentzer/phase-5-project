import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import '../styling/DelayForm.css';

function DelayForm({ formData, setFormData, onSubmit, textBoxRef, setShowDelayForm }) {
    const [delayTime, setDelayTime] = useState(0);
    const [sliderActive, setSliderActive] = useState(false);
    const [mouseDownTime, setMouseDownTime] = useState(0);
    const [thumbPosition, setThumbPosition] = useState(0); 
    const sliderRef = useRef(null);
    const delayFormRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            e.preventDefault()
            if (
                delayFormRef.current && 
                !delayFormRef.current.contains(e.target) &&
                textBoxRef && 
                textBoxRef.current && 
                !textBoxRef.current.contains(e.target)
            ) {
                setShowDelayForm(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [textBoxRef, setShowDelayForm]);

    const handleSliderMouseDown = (e) => {
        e.stopPropagation();
        setSliderActive(true);
        setMouseDownTime(Date.now());
    };

    const handleSliderMouseUp = () => {
        setSliderActive(false);

        const mouseUpTime = Date.now();
        const timeDifference = mouseUpTime - mouseDownTime;
        console.log(`Click Time: ${timeDifference}`);
        if (timeDifference < 250) {
            if (!delayTime) {
                const random = Math.floor(Math.random() * 1440) + 1;
                setDelayTime(random);
                console.log(`Set Random Value: ${random}`);
            } else {
                setDelayTime(0);
                console.log("Turn Off Delay");
            }
        }
    };

    const handleSliderMouseMove = (e) => {
        if (sliderActive) {
            const sliderRect = sliderRef.current.getBoundingClientRect();
            const sliderHeight = sliderRect.height;
            const offsetY = sliderRect.bottom - e.clientY; 
            const sliderMinutes = Math.max(0, Math.min(1440, Math.round(offsetY / sliderHeight * 1440)));
            const currentDate = new Date();
            console.log(currentDate)
            currentDate.setMinutes(currentDate.getMinutes() + sliderMinutes);
            setFormData({ ...formData, delivery_time: currentDate });
            setThumbPosition((sliderMinutes / 1440) * 87.5); 
            console.log(currentDate)
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

    const formatDeliveryTime = (deliveryTime) => {
        const options = { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Intl.DateTimeFormat('en-US', options).format(deliveryTime);
    };

    const handleOptionButtonHover = (minutes) => {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() + minutes);
        setFormData({ ...formData, delivery_time: currentDate });
        setThumbPosition(0); 
    };

    return (
        <div className="delay-form-container" ref={delayFormRef}>
            <h3 className='delay-display'>Deliver: {formatDeliveryTime(formData.delivery_time)}</h3>
            <div className="delay-option-row">
                <button className="delay-option-button" onMouseEnter={() => handleOptionButtonHover(120)} onClick={onSubmit}>
                    <div className="icon-container">
                        <span className="option-text">2hr</span>
                        <Icon name="paper plane" className="icon-plane" style={{ transform: 'rotate(29deg)' }} />
                    </div>
                </button>
                <button className="delay-option-button" onMouseEnter={() => handleOptionButtonHover(240)} onClick={onSubmit}>
                    <div className="icon-container">
                        <span className="option-text">4hr</span>
                        <Icon name="paper plane" className="icon-plane" style={{ transform: 'rotate(29deg)' }} />
                    </div>
                </button>
            </div>
            <div className="delay-option-row">
                <button className="delay-option-button" onMouseEnter={() => handleOptionButtonHover(480)} onClick={onSubmit}>
                    <div className="icon-container">
                        <span className="option-text">8hr</span>
                        <Icon name="paper plane" className="icon-plane" style={{ transform: 'rotate(29deg)' }} />
                    </div>
                </button>
                <button className="delay-option-button" onMouseEnter={() => handleOptionButtonHover(720)} onClick={onSubmit}>
                    <div className="icon-container">
                        <span className="option-text">12hr</span>
                        <Icon name="paper plane" className="icon-plane" style={{ transform: 'rotate(29deg)' }} />
                    </div>
                </button>
            </div>
            <div className="delay-option-row">
                <button className="delay-option-button" onMouseEnter={() => handleOptionButtonHover(1440)} onClick={onSubmit}>
                    <div className="icon-container">
                        <span className="option-text">24hr</span>
                        <Icon name="paper plane" className="icon-plane" style={{ transform: 'rotate(29deg)' }} />
                    </div>
                </button>
                <button className="delay-option-button" onMouseEnter={() => handleOptionButtonHover(Math.floor(Math.random() * (1440 - 15)) + 15)} onClick={onSubmit}>
                    <Icon name="random" className="option-text"/>
                    <Icon name="paper plane" className="icon-plane" style={{ transform: 'rotate(29deg)' }} />
                </button>
            </div>
            <div className="delay-slider-container">
                <div className="delay-slider-track" ref={sliderRef}></div>
                <div
                    className="delay-slider-thumb"
                    onMouseDown={handleSliderMouseDown}
                    style={{ bottom: `${thumbPosition}%` }}
                ></div>
            </div>
        </div>
    );
}

export default DelayForm;