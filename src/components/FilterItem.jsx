import React, { useState } from "react";
import Page from "../pages/page.module.css";

export const FilterItem = ({ label, options, onChange, minWidth, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`relative filterItem ${Page.FilterNoneClass}`}>
      <div
        className="flex justify-center items-center gap-1 leading-tight cursor-pointer select-none "
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {value ? options?.find((option) => option.value === value)?.label : label}
        <img src={"/assets/images/downArrowWhite.svg"} alt="img" />
      </div>
      {isOpen ? (
        <ul
          className="bg-white z-10 rounded-[5px] shadow-sm text-black absolute py-2 pr-2 flex flex-col gap-2 list-disc"
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
