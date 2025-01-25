import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { connect } from "react-redux";
import { getRecord } from "../../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../../apis/ApiEndPoints";

const Area = (props) => {
  const { authUserDetails } = props;
  const { chartDate } = props;

  const [xaxis, setXaxis] = useState([]);
  const [price, setPrice] = useState([]);

  useEffect(() => {
    getLifeTimeSale();
  }, [authUserDetails?.userId, chartDate]);

  const getLifeTimeSale = async () => {
    const user_id = authUserDetails?.userId;
    const result = await getRecord(
      user_id,
      ApiEndPoints.SALES_MONTHLY + `${chartDate}`
    );
    if (result?.status === 200) {
      setXaxis(result?.labels);
      setPrice(result?.data);
    } else {
      setXaxis([]);
      setPrice([]);
    }
  };

  const options = {
    chart: {
      id: "apexchart-example",
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: xaxis,
    },
    colors: ["rgb(130, 202, 157)"],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      // enabledOnSeries: undefined,
      shared: true,
      followCursor: true,
      onDatasetHover: {
        highlightDataSeries: true,
      },
    },
  };
  const series = [
    {
      name: "Sale",
      data: price,
    },
  ];

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authUserDetails: state.auth.userInfo,
  };
};
export default connect(mapStateToProps)(Area);
