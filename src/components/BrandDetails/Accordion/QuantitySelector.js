import React, { useEffect } from "react";
import Styles from "./Style.module.css";

const padWithZero = (value) => {
  return String(value).padStart("2", "0");
};

const QuantitySelector = ({ onChange, value = 0, min = 0 }) => {
  useEffect(() => {
    if (value !== 0 && value < min) {
      onChange?.(min);
    }
  }, [value, min]);

  return (
    <div className={`${Styles.ButtonControl}w-[85px] h-[27px] flex `}>
      <button
        onClick={() => {
          let newValue = value;
          if (newValue > min) {
            // newValue = newValue - 1;
            // new functionality
            if (min===0){
              newValue -= 1;
            }
            else{
              newValue-=min
            }
          } else {
            newValue = 0;
          }
          onChange?.(newValue);
        }}
        className="px-[8px] h-full bg-[#f8fafb] border border-solid border-black"
      >
        -
      </button>

      <input type="number" value={padWithZero(value)} className="w-[25px] text-center text-[12px] leading-tight appearance-none border-t-[1px] border-b-[1px] border-solid border-black" />
      <button
        onClick={() => {
          // functionality for 1 addition
          // let newValue = value + 1;
          // onChange?.(newValue);
          // new functionality
          let newValue;
          if (min === 0) {
            newValue = value + 1;
          } else {
            newValue = value + min;
          }
          onChange?.(newValue);
        }}
        className="px-[8px] h-full bg-[#f8fafb] border border-solid border-black"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
