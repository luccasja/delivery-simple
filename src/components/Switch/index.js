import React, {useState} from 'react';
import './Switch.css';

const Switch = ({handleToggle, onColor='#06D6A0', btnSize, lableHeight, isOn, id = 'new'}) => {
    const btnStyle = btnSize !== undefined ? {height:btnSize, width:btnSize} : {}
    const lableStyle = lableHeight !== undefined ? {height:lableHeight, width:lableHeight*2, background: isOn && onColor} : {background: isOn && onColor}
    return (
        <>
          <input
            checked={isOn}
            onChange={handleToggle}
            className="react-switch-checkbox"
            id={id}
            type="checkbox"
          />
          <label
            style={lableStyle}
            className="react-switch-label"
            htmlFor={id}
          >
            <span className={`react-switch-button`} style={btnStyle} />
          </label>
        </>
      );
};

export default Switch;