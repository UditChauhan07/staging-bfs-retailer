import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import LaunchCalendar from "../components/LaunchCalendar/LaunchCalendar";
import { FilterItem } from "../components/FilterItem";
import html2pdf from 'html2pdf.js';
import { MdOutlineDownload } from "react-icons/md";
const MarketingCalendar = () => {
  const [brand,setBrand] = useState(null);
  const generatePdf = () => {
    const element = document.getElementById('CalenerContainer'); // The HTML element you want to convert
    // element.style.padding = "10px"
    let filename = `Marketing Calender `;
    if(brand){
      filename = brand+" "
    }
    filename += new Date();
    const opt = {
      margin: 1,
      filename: filename+'.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    html2pdf().set(opt).from(element).save();
  };
  let brands = [
    { value: null, label: "All" },
    // {value:"Susanne Kaufmann",label:"Susanne Kaufmann"},
    { value: "AERIN", label: "AERIN" },
    { value: "ARAMIS", label: "ARAMIS" },
    { value: "Bobbi Brown", label: "Bobbi Brown" },
    { value: "Bumble and Bumble", label: "Bumble and Bumble" },
    { value: "Byredo", label: "Byredo" },
    { value: "BY TERRY", label: "BY TERRY" },
    { value: "Diptyque", label: "Diptyque" },
    { value: "Kevyn Aucoin Cosmetics", label: "Kevyn Aucoin Cosmetics" },
    { value: "ESTEE LAUDER", label: "ESTEE LAUDER" },
    { value: "L'Occitane", label: "L'Occitane" },
    { value: "Maison Margiela", label: "Maison Margiela" },
    { value: "ReVive", label: "ReVive" },
    { value: "RMS Beauty", label: "RMS Beauty" },
    { value: "Smashbox", label: "Smashbox" },
    { value: "Re-Nutriv", label: "Re-Nutriv" },
    { value: "Victoria Beckham Beauty", label: "Victoria Beckham Beauty" },
  ];
const [month, setMonth] = useState("");
let months = [
  { value: null, label: "All" },
  // {value:"Susanne Kaufmann",label:"Susanne Kaufmann"},
  { value: "JAN", label: "JAN" },
  { value: "FEB", label: "FEB" },
  { value: "MAR", label: "MAR" },
  { value: "APR", label: "APR" },
  { value: "MAY", label: "MAY" },
  { value: "JUN", label: "JUN" },
  { value: "JULY", label: "JULY" },
  { value: "AUG", label: "AUG" },
  { value: "SEP", label: "SEP" },
  { value: "OCT", label: "OCT" },
  { value: "NOV", label: "NOV" },
  { value: "DEC", label: "DEC" },
  { value: "TBD", label: "TBD" },
 
];
  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="All Brand"
            name="All-Brand"
            value={brand}
            options={brands}
            onChange={(value) => {
              setBrand(value);
            }}
          />
          <FilterItem
            minWidth="220px"
            label="JUN-DEC"
            name="JIN-DEC"
            value={month}
            options={months}
            onChange={(value) => {
              setMonth(value);
            }}
          />
          
       
          <button
            className="border px-2.5 py-1 leading-tight"
            onClick={() => {
              setBrand(null);
              setMonth(null);
            }}
          >
            CLEAR ALL
          </button>
        </>
      }
    >
      <LaunchCalendar brand={brand} month={month} 
      // ShipDate={ShipDate} 
      />
    </AppLayout>
  );
};

export default MarketingCalendar;
