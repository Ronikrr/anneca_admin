import React, { useEffect, useState } from "react";
import { getRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { connect } from "react-redux";
import Area from "./Chart/Area";

const Dashboard = (props) => {
  const { authUserDetails } = props;

  const [lifeTimeSale, setLifeTimeSale] = useState();
  const [productState, setProductState] = useState([]);
  const [chartDate, setChartDate] = useState("monthly");

  useEffect(() => {
    getLifeTimeSale();
  }, [authUserDetails?.userId]);

  useEffect(() => {
    getProductState();
  }, [authUserDetails?.userId]);

  const getLifeTimeSale = async () => {
    const user_id = authUserDetails?.userId;
    const result = await getRecord(user_id, ApiEndPoints.LIFE_TIME_SALE_SELLER);
    if (result?.status === 200) {
      setLifeTimeSale(result);
    } else {
      setLifeTimeSale({});
    }
  };

  const getProductState = async () => {
    const user_id = authUserDetails?.userId;
    const result = await getRecord(user_id, ApiEndPoints.PRODUCT_STATE_SELLER);
    if (result?.status === 200) {
      setProductState(result.data);
    } else {
      setProductState([]);
    }
  };

  const handleChartdate = (e) => {
    setChartDate(e.target.text);
  };

  return (
    <>
      <div className="max-w-100 mx-auto mt-3 mb-3">
        <div className="page-heading flex justify-between items-center">
          <div className="flex justify-start space-x-1 items-center">
            <div className="self-center">
              <h1 className="page-heading-title">Dashboard</h1>
            </div>
          </div>
          <div className="flex justify-end space-x-1 items-center" />
        </div>
        <div className="grid grid-cols-3 gap-x-2 grid-flow-row ">
          <div className="col-span-2 grid grid-cols-1 gap-2 auto-rows-max">
            <div className="card shadow">
              <div className="flex justify-between card-header">
                <h2 className="card-title">Sale Statistic</h2>
                <div className="flex space-x-075">
                  <div className="card-action">
                    <a
                      onClick={handleChartdate}
                      className="text-interactive cursor-pointer"
                    >
                      Daily
                    </a>
                  </div>
                  <div className="card-action">
                    <a
                      onClick={handleChartdate}
                      className="text-interactive cursor-pointer"
                    >
                      Weekly
                    </a>
                  </div>
                  <div className="card-action">
                    <a
                      onClick={handleChartdate}
                      className="text-interactive cursor-pointer"
                    >
                      Monthly
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-section border-b box-border">
                <Area chartDate={chartDate} />
              </div>
            </div>
            <div className="card shadow">
              <div className="flex justify-between card-header">
                <h2 className="card-title">Best Sellers</h2>
                <div className="flex space-x-075">
                  <div className="card-action">
                    <a href="/" className="text-interactive">
                      All products
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-section border-b box-border">
                <div className="card-session-content pt-lg">
                  <table className="listing bestsellers">
                    <tbody>
                      {productState?.map((item, index) => (
                        <tr>
                          <td>
                            <div
                              className="grid-thumbnail text-border border border-divider p-075 rounded flex justify-center"
                              style={{ width: "6rem", height: "6rem" }}
                            >
                              <img
                                className="self-center"
                                src={item?.product?.images[0]?.url}
                                alt=""
                              />
                            </div>
                          </td>
                          <td>
                            <a
                              href="/admin/products/edit/39c877ab-a50b-40a6-a14b-283284205eae"
                              className="font-semibold hover:underline"
                            >
                              {item?.product?.name}
                            </a>
                          </td>
                          <td>${item?.totalPrice.toFixed(2)}</td>
                          <td>{item?.totalQuantity} solded</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 grid grid-cols-1 gap-2 auto-rows-max">
            <div className="card shadow">
              <div className="flex justify-between card-header">
                <h2 className="card-title">Lifetime Sale</h2>
              </div>
              <div className="card-section border-b box-border">
                <div className="card-session-content pt-lg">
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex space-x-1 items-center">
                      <span
                        className="info dot"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                      <div className="self-center">
                        {lifeTimeSale?.totalOrders} orders
                      </div>
                    </div>
                    <div className="flex space-x-1 items-center">
                      <span
                        className="info dot"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                      <div className="self-center">
                        ${lifeTimeSale?.lifetimeSales} lifetime sale
                      </div>
                    </div>
                    <div className="flex space-x-1 items-center">
                      <span
                        className="success dot"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                      <div className="self-center">
                        {lifeTimeSale?.completedPercentage}% of orders completed
                      </div>
                    </div>
                    <div className="flex space-x-1 items-center">
                      <span
                        className="critical dot"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                      <div className="self-center">
                        {lifeTimeSale?.cancelledPercentage}% of orders cancelled
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-section border-b box-border">
                <div className="card-session-content pt-lg">
                  <div style={{ height: 200 }}>
                    <div
                      className="recharts-responsive-container"
                      style={{ width: "100%", height: "100%" }}
                      width={260}
                      height={200}
                    >
                      <div
                        className="recharts-wrapper"
                        style={{
                          position: "relative",
                          cursor: "default",
                          width: 260,
                          height: 200,
                        }}
                      >
                        <svg
                          cx="50%"
                          cy="50%"
                          className="recharts-surface"
                          width={260}
                          height={200}
                          viewBox="0 0 260 200"
                          version="1.1"
                        >
                          <title />
                          <desc />
                          <defs>
                            <clipPath id="recharts3-clip">
                              <rect x={3} y={5} height={190} width={250} />
                            </clipPath>
                          </defs>
                          <g className="recharts-layer recharts-pie">
                            <g className="recharts-layer">
                              <g className="recharts-layer recharts-pie-sector" />
                              <g className="recharts-layer recharts-pie-sector" />
                              <g className="recharts-layer recharts-pie-sector">
                                <path
                                  name="Others"
                                  fill="#a4e8f2"
                                  stroke="#fff"
                                  cx={130}
                                  cy={100}
                                  className="recharts-sector"
                                  d="M 206,100
    A 76,76,0,
    1,0,
    205.99999998842452,100.00132645023145
  L 130,100 Z"
                                />
                              </g>
                            </g>
                            <g className="recharts-layer recharts-pie-labels">
                              <g className="recharts-layer">
                                <text
                                  fill="#aee9d1"
                                  stroke="none"
                                  cx={130}
                                  cy={100}
                                  name="Completed"
                                  x={226}
                                  y={100}
                                  alignmentBaseline="middle"
                                  className="recharts-text recharts-pie-label-text"
                                  textAnchor="start"
                                >
                                  <tspan x={226} dy="0em">
                                    0
                                  </tspan>
                                </text>
                              </g>
                              <g className="recharts-layer">
                                <text
                                  fill="#fed3d1"
                                  stroke="none"
                                  cx={130}
                                  cy={100}
                                  name="Cancelled"
                                  x={226}
                                  y={100}
                                  alignmentBaseline="middle"
                                  className="recharts-text recharts-pie-label-text"
                                  textAnchor="start"
                                >
                                  <tspan x={226} dy="0em">
                                    0
                                  </tspan>
                                </text>
                              </g>
                              <g className="recharts-layer">
                                <text
                                  fill="#a4e8f2"
                                  stroke="none"
                                  cx={130}
                                  cy={100}
                                  name="Others"
                                  x={34}
                                  y="99.99999999999999"
                                  alignmentBaseline="middle"
                                  className="recharts-text recharts-pie-label-text"
                                  textAnchor="end"
                                >
                                  <tspan x={34} dy="0em">
                                    100
                                  </tspan>
                                </text>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authUserDetails: state.auth.userInfo,
  };
};
export default connect(mapStateToProps)(Dashboard);
