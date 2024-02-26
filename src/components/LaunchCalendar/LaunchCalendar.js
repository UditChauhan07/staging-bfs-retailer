import React, { useEffect, useState, useMemo } from "react";
import "./Style.css";
import "bootstrap/dist/css/bootstrap.min.css";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function LaunchCalendar({ productList,isEmpty, selectBrand,brand, month }) {
  const [isEmpty2, setIsEmpty2] = useState(isEmpty);
  // useEffect(() => {
  //   let temp = true;
  //   products.map((month) => {
  //     month.content.map((item) => {
  //       if (!selectBrand || selectBrand == item.brand) {
  //         temp = false;
  //       }
  //     });
  //     setIsEmpty(temp);
  //   });
  // }, [selectBrand]);


  const [filterData, setFilterData] = useState()
  useEffect(() => {
    let isEmptyFlag = false;
    if (!month && !selectBrand) {
      const newValues = productList?.map((months) => {
        const filterData = months.content?.filter((item) => {
          return brand.some((brand) => brand.Name === item.brand);
        });
        return { ...months, content: filterData };
      });
      setFilterData(newValues)
    // console.log(newValues)

    }else{
      const newValues = productList?.map((months) => {
        const filterData = months.content?.filter((item) => {
          // let match = item.OCDDate.split("/")
          // console.log(match)
          if (month) {
            if (selectBrand) {
              if (selectBrand == item.brand) {
                return item.date.toLowerCase().includes(month.toLowerCase()) && selectBrand === item.brand;
              }
            } else {
              return item.date.toLowerCase().includes(month.toLowerCase())
            }
            // return match.includes(month.toUpperCase() )
          } else {
            if (selectBrand) {
              if (selectBrand == item.brand) {
                return true;
              }
            } else {
              return true;
            }
            // If month is not provided, return all items
          }
        });
        // if (filterData.length > 0) {
        //   isEmptyFlag = false;
        // }
        // Create a new object with filtered content
        return { ...months, content: filterData };
      });
      setIsEmpty2(isEmptyFlag);
      setFilterData(newValues);
    }
    
  },[month,selectBrand,productList,brand]);


  //   if(!ShipDate){
  // setFilterData(products)
  //   }
  //   const newValues = products?.map((Date) => {
  //     const filterData = Date.content?.filter((item) => {
  //       // let match = item.OCDDate.split("/")
  //       // console.log(match)
  //       if (ShipDate) {
  //         // return match.includes(month.toUpperCase() )
  //         return item.date.toLowerCase().includes(ShipDate.toLowerCase() )
  //       } else {
  //         // If month is not provided, return all items
  //         return true;
  //       }
  //     });
  //     // Create a new object with filtered content
  //     return { ...Date, content: filterData };
  //   });
  //  console.log(newValues);
  //   setFilterData(newValues);
  // }, [ShipDate]);

  return (
    <div id="Calendar">
      <div className="container">
        <h1 className="TopHeading">Marketing Calendar</h1>
        <div className="row">
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 ">
            <ul className="timeline mt-4 mr-4" id="CalenerContainer">
              {!isEmpty2?.length > 0 ? (
                filterData?.map((month, index) => {
                  if (month.content.length>0) {
                    return (
                      <li key={index}>
                        <span className={`timelineHolder0${(index % 3) + 1}`}>{month.month}</span>
                        {month.content.map((product, productIndex) => {
                          if (!selectBrand || selectBrand == product.brand){
                          return (
                            <>
                              <div className="timeline-content" key={productIndex}>
                                <div className="ProductInfo">
                                  <div className="BothDateTopFlex">
                                    <div className="ShipDate">
                                      <span>Ship Date</span>
                                      <div className={`DateCurrent0${(index % 3) + 1}`}>{product.date}</div>
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
                                        Size <span className="ProductQty">{product.size}</span>
                                      </div>
                                      <p>{product.description}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="launchBrand">
                                  <img className="img-fluid" src={product.brandLogo} alt={`${product.name} logo`} />
                                </div>
                              </div>
                            </>
                          );
                          }
                        })}
                      </li>
                    )
                  }
                })
              ) : (
                <div>No data found</div>
              )}
            </ul>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 ">
            <div className="GrayBg">
              <div className="PlusBtn">
                <div className="AddNewInner">
                  <button className="btn btn-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
                      <path d="M43 21.5L43 64.5" stroke="#D5D9D9" strokeWidth="5" strokeLinecap="square" strokeLinejoin="round" />
                      <path d="M64.5 43L21.5 43" stroke="#D5D9D9" strokeWidth="5" strokeLinecap="square" strokeLinejoin="round" />
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
