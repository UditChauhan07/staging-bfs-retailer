import React, { useEffect, useState } from "react";
import Page from "../pages/page.module.css";

export const FilterItem = ({ label, options, onChange, minWidth, value,name='drop-down1',containNullValue=false  }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(()=>{
    const onMouseEnter = () => {
      setIsOpen(true)
    };
    
    const onMouseLeave = () => {
      setIsOpen(false)
    };
    document.getElementById(name)?.addEventListener("mouseenter", onMouseEnter);
    document.getElementById(name)?.addEventListener("mouseleave", onMouseLeave);
  },[])
  return (
    <div className={`relative filterItem ${Page.FilterNoneClass}  d-flex align-self-center`} id={name}>
      <div
        className="flex justify-center items-center gap-1 leading-tight cursor-pointer select-none "
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {value||containNullValue ? options?.find((option) => option.value === value)?.label : label}
        <img src={"/assets/images/downArrowWhite.svg"} alt="img" />
      </div>
      {isOpen ? (
        <ul
          className="bg-white z-10 rounded-[5px] shadow-sm text-black absolute py-2 pr-2 flex flex-col  list-disc"
          style={{ minWidth: minWidth || "120px", maxHeight: "450px", overflow: "auto" }}
        >
          {options?.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`cursor-pointer hover:bg-[#eeeeef] p-1 hover:rounded-lg ${option.value === value ? `bg-[lightgrey] rounded` : null}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
