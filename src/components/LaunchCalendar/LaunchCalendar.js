import React, { useEffect, useState } from "react";
import "./Style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function LaunchCalendar({ brand }) {
  const [products, setProducts] = useState([
    {
      month: "Jan",
      content: [
        {
          brand: "RMS Beauty",
          date: "29/JAN/2024",
          OCDDate: "ASAP",
          image: "/assets/images/02.png",
          name: "LipNight",
          size: "09 g",
          description:
            "Naturally fragranced and flavored with Vanilla and soothing Chamomile Oil, this overnight treatment sweetly blankets and soothes lips while you slumber.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        {
          brand: "RMS Beauty",
          date: "29/JAN/2024",
          OCDDate: "ASAP",
          image: "/assets/images/03.png",
          name: "Skin2Skin Everything Brush",
          size: "N/A",
          description:
            "xpertly designed using luxuriously soft imitation goat hair, our Skin2SKin Everything Brush helps to deposit just the right amount of product to the face, while its flexible bristles make it easy to control and blend for a natural look.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        {
          brand: "RMS Beauty",
          date: "29/JAN/2024",
          OCDDate: "28/FEB/2024",
          image: "/assets/images/04.png",
          name: "Kakadu Luxe Cream",
          size: "50 ML",
          description:
            "A luscious creamy mousse enriched with a high concentration of antioxidants and Vitamin A, C & E to help nourish and revitalise your skin.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        // Add more products for January
      ],
    },
    {
      month: "Feb",
      content: [
        {
          brand: "RMS Beauty",
          date: "TBD",
          OCDDate: "01/FEB/2024",
          image: "/assets/images/11.png",
          name: "INTERNATIONAL formula",
          size: "30 ml",
          description:
            "A tinted skin nourishing, mineral-based daily sunscreen serum and soft focus complexion corrector with natural-looking illumination and SPF 30 broad spectrum protection.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        {
          brand: "RMS Beauty",
          date: "26/FEB/2024",
          OCDDate: "26/MAR/2024",
          image: "/assets/images/05.png",
          name: "Re Dimension Hydra",
          size: "30 ml",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        // Add more products for February
      ],
    },

    {
      month: "Mar",
      content: [
        {
          brand: "Smashbox",
          date: "01/MAR/2024",
          OCDDate: "04/APR/2024",
          image: "/assets/images/07.png",
          name: "Sculpt & Glow Face Palette",
          size: "N/A",
          description:
            "Our versatile powders can be used to shape, highlight, and add a flush of color in a variety of ways.",
          brandLogo: "/assets/images/smashbox_logo.png",
        },
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "01/MAR/2024",
          OCDDate: "04/APR/2024",
          image: "/assets/images/10.png",
          name: "Face Forward Color Correcting Wheel",
          size: "N/A",
          description:
            "Color correcting is a concealer technique that professional makeup artists have used for years and that went mainstream after social media got wind of the trend.",
          brandLogo: "/assets/images/kevy_logo.png",
        },

      ],
    },

    {
      month: "APR",
      content: [
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "01/APR/2024",
          OCDDate: "30/MAY/2024",
          image: "/assets/images/12.png",
          name: "Single-Ended Brushes",
          size: "N/A",
          description:
            "The secret to beautiful, natural-looking makeup is the right tools, including these makeup brushes from Kevyn Aucoin Beauty.",
          brandLogo: "/assets/images/kevy_logo.png",
        },
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "01/APR/2024",
          OCDDate: "30/MAY/2024",
          image: "/assets/images/11.png",
          name: "Micro Sculpting Brow",
          size: "N/A",
          description:
            "The Color Stick is a pigment-rich, ultra-creamy, & lightweight blush that offers buildable color, a skin-softening finish, and long-lasting wear.",
          brandLogo: "/assets/images/kevy_logo.png",
        },
        {
          brand: "BY TERRY",
          date: "01/APR/2024",
          OCDDate: "30/MAY/2024",
          image: "/assets/images/08.png",
          name: "Crayon Blackstar Shade Extension",
          size: "N/A",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          brandLogo: "/assets/images/Byterry_logo.png",
        },
        {
          brand: "RMS Beauty",
          date: "26/02/2024",
          OCDDate: "30/JAN/2024",
          image: "/assets/images/05.png",
          name: "Re Dimension Hydra",
          size: "30 ml",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        // Add more products for February
      ],
    },
    {
      month: "MAY",
      content: [
        {
          brand: "BY TERRY",
          date: "01/MAY/2024",
          OCDDate: "30/JUN/2024",
          image: "/assets/images/09.png",
          name: "Brightening CC Foundation",
          size: "N/A",
          description:
            "New radiant foundation- supercharged as a serum, lightweight as a skin tint, and glowy as youthful skin.",
          brandLogo: "/assets/images/Byterry_logo.png",
        },

        {
          brand: "RMS Beauty",
          date: "09/MAY/2024",
          OCDDate: "06/JUN/2024",
          image: "/assets/images/06.png",
          name: "Re Dimension Hydra",
          size: "30 ml",
          description:
            "It glides on effortlessly, infusing skin with multi-dimensional life as the bouncy, light-as-air gel blends and builds color.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        // Add more products for February
      ],
    },

    // Add more months as needed
  ]);
  const [isEmpty,setIsEmpty] = useState(false)
  useEffect(()=>{
    let temp = true
    products.map((month)=>{
      month.content.map((item)=>{
        if ((!brand ||brand == item.brand)) {
          temp = false;
        }
      })
      setIsEmpty(temp)
    })
  },[brand])

  return (
    <div id="Calendar">
      <div className="container">
        <h1 className="TopHeading">Marketing Calendar</h1>

        <div className="row">
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 ">
            <ul className="timeline mt-4">
              {!isEmpty ?products.map((month, index) => (
                <li key={index}>
                  <span className={`timelineHolder0${(index % 3) + 1}`}>
                    {month.month}
                  </span>
                  {month.content.map((product, productIndex) => {
                    if ((!brand || brand == product.brand)) {
                      return (<div className="timeline-content" key={productIndex}>
                        <div className="ProductInfo">
                          <div className="BothDateTopFlex">
                            <div className="ShipDate">
                              <span>Ship Date</span>
                              <div className={`DateCurrent0${(index % 3) + 1}`}>
                                {product.date}
                              </div>
                            </div>
                            <div className="ShipDate EDate">
                              <span>OCD</span>
                              <div className="DateEod">{product.OCDDate}</div>
                            </div>
                          </div>
                          <div className="d-flex mt-2">
                            <div className="m-auto ProductImg">
                              <img src={product.image} alt={product.name} />
                            </div>
                            <div className="LaunchProductDetail">
                              <h3>{product.name}</h3>
                              <div className="size">
                                Size{" "}
                                <span className="ProductQty">{product.size}</span>
                              </div>
                              <p>{product.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="launchBrand">
                          <img
                            className="img-fluid"
                            src={product.brandLogo}
                            alt={`${product.name} logo`}
                          />
                        </div>
                      </div>
                      )
                    }
                  })}
                </li>
              )):(<div>No data found</div>)}
            </ul>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 ">
            <div className="GrayBg">
              <div className="PlusBtn">
                <div className="AddNewInner">
                  <button className="btn btn-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="86"
                      height="86"
                      viewBox="0 0 86 86"
                      fill="none"
                    >
                      <path
                        d="M43 21.5L43 64.5"
                        stroke="#D5D9D9"
                        strokeWidth="5"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M64.5 43L21.5 43"
                        stroke="#D5D9D9"
                        strokeWidth="5"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <p> Unleashed feature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaunchCalendar;
