import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import LaunchCalendar from "../components/LaunchCalendar/LaunchCalendar";
import { FilterItem } from "../components/FilterItem";

const MarketingCalendar = () => {
  const [brand,setBrand] = useState(null);
  let brands = [
    { value: null, label: "All" },
    {value:"Susanne Kaufmann",label:"Susanne Kaufmann"},
    {value:"RMS Beauty",label:"RMS Beauty"},
    {value:"Bobbi Brown",label:"Bobbi Brown"},
    {value:"Bumble and Bumble",label:"Bumble and Bumble"},
    {value:"BY TERRY",label:"BY TERRY"},
    {value:"Diptyque",label:"Diptyque"},
    {value:"Kevyn Aucoin Cosmetics",label:"Kevyn Aucoin Cosmetics"},
    {value:"L'Occitane",label:"L'Occitane"},
    {value:"Maison Margiela",label:"Maison Margiela"},
    {value:"ReVive",label:"ReVive"},
    {value:"Smashbox",label:"Smashbox"},
    {value:"AERIN",label:"AERIN"},
    {value:"ARAMIS",label:"ARAMIS"},
    {value:"Byredo",label:"Byredo"},
    {value:"ESTEE LAUDER",label:"ESTEE LAUDER"},
    {value:"Re-Nutriv",label:"Re-Nutriv"},
    {value:"Victoria Beckham Beauty",label:"Victoria Beckham Beauty"}
  ]
  return (
    <AppLayout 
    filterNodes={
      <>
        <FilterItem
          minWidth="220px"
          label="All Brand"
          value={brand}
          options={brands}
          onChange={(value) => {
            setBrand(value)
          }}
        />
        <button
              className="border px-2.5 py-1 leading-tight"
              onClick={() => {
                setBrand(null)
              }}
            >
              CLEAR ALL
            </button>
      </>
    }
    >
      <LaunchCalendar brand={brand}/>
    </AppLayout>
  );
};

export default MarketingCalendar;
