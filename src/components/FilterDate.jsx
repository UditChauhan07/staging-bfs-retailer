import React from "react";
const FilterDate = ({ label, onChange, value, minWidth }) => {
  return (
    <div className="flex">
      <label htmlFor={label}>{label}</label>
      <input
        type="date"
        className="bg-black placeholder:uppercase placeholder:text-white placeholder:underline placeholder:underline-offset-2 focus:outline-none leading-tight placeholder:font-[Montserrat-500] font-[Montserrat-500] placeholder:tracking-[1.2px] outline-none tracking-[1.2px] appearance-auto	dark:text-white flex justify-center	items-center ms-1"
        onChange={onChange}
        style={{ width: minWidth || "100px",colorScheme:"dark" }}
        id={label}
        defaultValue={value}
        value={value}
      />
    </div>
  );
};

export default FilterDate;
