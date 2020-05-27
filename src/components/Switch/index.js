import React from 'react';
import './Switch.css';

const Switch = ({handleToggle, onColor='#06D6A0', offColor='grey', btnSize, lableHeight, isOn, id = 'new'}) => {
    /*Exemplo de utilização: 
    <Switch btnSize={26} 
        lableHeight={30} 
        offColor='#EF476F' 
        isOn={value}
        handleToggle={() => setValue(!value)}
    />
    */

    const btnStyle = btnSize !== undefined ? {height:btnSize, width:btnSize} : {}
    const lableStyle = lableHeight !== undefined 
        ? {height:lableHeight, width:lableHeight*2, background: isOn ? onColor : offColor} 
        : {background: isOn ? onColor : offColor}
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