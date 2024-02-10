import React, { useEffect, useState } from "react";
import Styles from "./Style.module.css";
import ModalPage from "../../Modal UI";

const padWithZero = (value) => {
  return String(value).padStart("2", "0");
};
// new functionality for min qty is added
const QuantitySelector = ({ onChange, value = 0, min = 0 }) => {
  const [qtyErrorModalOpen, setQtyErrorModalOpen] = useState(false);
  const [newQtyInput, setNewQtyInput] = useState(value);
  
  useEffect(() => {
    if (value !== 0 && value < min) {
      onChange?.(min);
    }
  }, [value, min]);
  const qtyChangeHandler=({previous,newQty=0})=>{
    if(newQty){
      if(newQty<min){
        setQtyErrorModalOpen(true)
      }else{
        if(newQty%min==0){
          onChange?.(newQty);
          setQtyErrorModalOpen(false)
        }else{
          setQtyErrorModalOpen(true)
        }
      }
    }else{
      onChange?.(newQty);
      setQtyErrorModalOpen(false)
    }
  };
  const customHandler = (value)=>{
    setNewQtyInput(parseInt(value))
  }

  return (
    <div className={`${Styles.ButtonControl}w-[85px] h-[27px] flex `}>
      {qtyErrorModalOpen ? (
        <ModalPage
          open
          content={
            <div className="d-flex flex-column gap-3">
              <h2 className={`${Styles.warning} `}>Warning</h2>
              <p className={`${Styles.warningContent} `}>
                Please Enter Multiple by {min} of product to add into bag
                <p className="mt-4">
                <input type="number" className={Styles.customPriceInput} onKeyUp={(e)=>customHandler(e.target.value||0)}/>
                {newQtyInput%min!=0 &&<p style={{color:'red',fontSize:'11px',textAlign:''}}>* invalid</p>}
                </p>
              </p>
              <div className="d-flex justify-content-around ">
                <button className={`${Styles.modalButton}`} onClick={()=>{ newQtyInput%min===0 &&qtyChangeHandler({newQty:parseInt(newQtyInput||0),previous:padWithZero(value)})}}>
                  Submit
                </button>
                <button className={`${Styles.modalButton}`} onClick={() => setQtyErrorModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          }
          onClose={() => {
            setQtyErrorModalOpen(false);
          }}
        />
      ) : null}
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

      <input type="number" value={padWithZero(value)} className="w-[25px] text-center text-[12px] leading-tight appearance-none border-t-[1px] border-b-[1px] border-solid border-black" onChange={(e)=>{qtyChangeHandler({newQty:parseInt(e.target.value||0),previous:padWithZero(value)})}}/>
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
