import React from "react";
import "./Style.css";
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
function LaunchCalendar() {
  return (
    <div id="Calendar">
      {/* <div class="container"> */}
      <div class="">

        <h1 class="TopHeading mt-4">Marketing Calendar</h1>

        <div className="row">
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 ">
            <ul class="timeline mt-4">
              <li>
                <span className="timelineHolder02">
                  {monthNames[new Date("2022/01/29").getMonth()]}
                </span>
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent02">29/JAN/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro02} alt="img"/> */}
                        <img src={"/assets/images/02.png"} alt="img" />
                      </div>
                      <div class="LaunchProductDetail">
                        <h3>LipNight</h3>
                        <div class="size">
                          Size <span class="ProductQty">09 g</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={RMSLogo} alt="img"/> */}
                    <img src={"/assets/images/rms-beauty.png"} alt="img" />
                  </div>
                </div>
                {/* Jan 2 product */}
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent02">29/JAN/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro05} alt="img" /> */}
                    <img src={"/assets/images/05.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Skin2Skin Everything</h3>
                        <div class="size">
                          Size <span class="ProductQty">09 g</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={RMSLogo} alt="img" /> */}
                    <img src={"/assets/images/rms-beauty.png"} alt="img" />

                  </div>
                </div>
                {/* Jan 3 product */}
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent02">29/JAN/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro04} alt="img"/> */}
                    <img src={"/assets/images/04.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Kakadu Luxe Cream </h3>
                        <div class="size">
                          Size <span class="ProductQty">50 ML</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={RMSLogo} alt="img" /> */}
                    <img src={"/assets/images/rms-beauty.png"} alt="img" />

                  </div>
                </div>
              </li>

              <li>
                <span className="timelineHolder">
                  {monthNames[new Date("2024/02/05").getMonth()]}
                </span>
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent01">TBD</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro01} alt="img"/> */}
                    <img src={"/assets/images/04.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>INTERNATIONAL formula </h3>
                        <div class="size">
                          Size <span class="ProductQty">30 ml</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={RMSLogo} alt="img"/> */}
                    <img src={"/assets/images/rms-beauty.png"} alt="img" />

                  </div>
                </div>
                {/* Jan 2 product */}
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent01">26/FEB/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro05} alt="img" /> */}
                    <img src={"/assets/images/05.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Re Dimension Hydra </h3>
                        <div class="size">
                          Size <span class="ProductQty">30 ml</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={RMSLogo} alt="img" /> */}
                    <img src={"/assets/images/rms-beauty.png"} alt="img" />

                  </div>
                </div>
              </li>
              <li>
                <span className="timelineHolder03">
                  {monthNames[new Date("2022/03/05").getMonth()]}
                </span>
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent03">01/MAR/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro10} alt="img"/> */}
                    <img src={"/assets/images/10.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Face Forward Color Correcting </h3>
                        <div class="size">
                          Size <span class="ProductQty">N/A</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={KevynLogo} alt="img"/> */}
                    <img src={"/assets/images/kevy_logo.png"} alt="img" />

                  </div>
                </div>
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent03">02/MAR/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                    <img src={"/assets/images/07.png"} alt="img" />
                        {/* <img src={Pro07} alt="img"/> */}
                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Sculpt & Glow Face</h3>
                        <div class="size">
                          Size <span class="ProductQty">N/A</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={LandererLogo} alt="img"/> */}
                    <img src={"/assets/images/smashbox_logo.png"} alt="img" />

                  </div>
                </div>
                
              </li>

              <li>
                <span className="timelineHolder">
                  {monthNames[new Date("2022/05/05").getMonth()]}
                </span>
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent01">05/MAY/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro08} alt="img" /> */}
                    <img src={"/assets/images/08.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Crayon Blackstar</h3>
                        <div class="size">
                          Size <span class="ProductQty">N/A</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={ByTerryLogo} alt="img"/> */}
                    <img src={"/assets/images/Byterry_logo.png"} alt="img" />

                  </div>
                </div>
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent01">09/MAY/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro06} alt="img" /> */}
                    <img src={"/assets/images/06.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Re Dimension Hydra</h3>
                        <div class="size">
                          Size <span class="ProductQty">N/A</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={RMSLogo} alt="img"/> */}
                    <img src={"/assets/images/rms-beauty.png"} alt="img" />
                    
                  </div>
                </div>
              </li>
              <li>
                <span className="timelineHolder02">
                  {monthNames[new Date("2022/06/05").getMonth()]}
                </span>
                <div class="timeline-content">
                  <div className="ProductInfo">
                    <div class="DateCurrent02">05/JUN/2024</div>
                    <div class="d-flex mt-2">
                      <div class="m-auto ProductImg">
                        {/* <img src={Pro09} alt="img" /> */}
                    <img src={"/assets/images/09.png"} alt="img" />

                      </div>
                      <div class="LaunchProductDetail">
                        <h3>Brightening CC</h3>
                        <div class="size">
                          Size <span class="ProductQty">N/A</span>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="launchBrand">
                    {/* <img className="img-fluid" src={ByTerryLogo} alt="img" /> */}
                    <img src={"/assets/images/Byterry_logo.png"} alt="img" />

                  </div>
                </div>
              </li>
            </ul>

            {/* <div class="text-center mt-4">
              <button class="btn btn-primary MoreProduct">
                Load More
                <i class="fa fa-angle-double-right" aria-hidden="true"></i>
              </button>
            </div> */}
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
                        stroke-width="5"
                        stroke-linecap="square"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M64.5 43L21.5 43"
                        stroke="#D5D9D9"
                        stroke-width="5"
                        stroke-linecap="square"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <p>Add New</p>
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
