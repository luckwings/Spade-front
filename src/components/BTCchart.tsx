import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { socket } from "../socket";
import { ApexOptions } from "apexcharts";
import "../index.css";

const BTCchart: React.FC = () => {
  // const Data = props.DATA
  // let seriesa = Data.seriesa;
  // let seriesb = Data.seriesb;
  // let seriesc = Data.seriesc;
  // let mindate = Data.mindate;
  // let maxdate = Data.maxdate;
  // var cash: number = props.cash;
  // var high: number = props.high;
  // var borrow: number = props.borrow;
  const [timestamp, setTimestamp] = useState(21600 * 1000);
  const [seriesa, setSeriesa] = useState([]);
  const [seriesb, setSeriesb] = useState([]);
  const [seriesc, setSeriesc] = useState([]);
  const [mindate, setMindate] = useState(0);
  const [maxdate, setMaxdate] = useState(0);
  const [buttonclicked, setButtonClicked] = useState(2);
  const [logarithmic, setLogarithmic] = useState(false);
  const [lineartarget, setLinearTarget] = useState(0);
  // const [langer, setLanger] = useState(1);
  // const [langbuttonetarget, setlangbuttontarget] = useState(0);
  const [timestyle, setTimestyle] = useState("HH:mm");

  const ChartDays = [
    1800 * 1000,
    3600 * 1000,
    21600 * 1000,
    43200 * 1000,
    86400 * 1000,
    604800 * 1000,
  ];

  const chartButtonName = [
    "30 Minutes",
    "1 Hour",
    "6 Hours",
    "12 Hours",
    "1 Day",
    "All Time",
  ];

  // chart input data
  const series = [
    {
      name: "Cash",
      data: seriesa,
    },
    {
      name: "High Quality",
      data: seriesb,
    },
    {
      name: "Borrowed",
      data: seriesc,
    },
  ];

  // useEffect(() => {
  //   getchartdata(langer);

  // }, [timestamp, langer]);

  useEffect(() => {
    socket.on("getchartdata", (data) => {
      var seriesOne: any = [];
      var seriesTwo: any = [];
      var seriesThree: any = [];
      data.map((item: any, key: number) => {
        seriesOne.push({ x: item.timestamp, y: item.total[0] });
        seriesTwo.push({ x: item.timestamp, y: item.total[1] });
        seriesThree.push({ x: item.timestamp, y: item.total[2] });
      });
      setSeriesa(seriesOne);
      setSeriesb(seriesTwo);
      setSeriesc(seriesThree);
      setMindate(seriesOne[0].x);
      setMaxdate(seriesOne[seriesOne.length - 1].x);
    });

    socket.emit("getchartdata");

    // window.setInterval(()=> {
    //   ApexCharts.exec('realtime', 'updateSeries',[{
    //     data: series
    //   }])
    // }, 10000)

    return () => {
      socket.off("getchartdata");
    };
  }, []);

  // get input data from api
  // const getchartdata = async (langer: any) => {
  //   await fetch(
  //     "https://api.blockchain.info/charts/market-price?timespan=" +
  //       `${timestamp}` +
  //       "&sampled=true&metadata=false&cors=true&format=json",
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       var datas = data.values;
  //       var newData = [];
  //       if (langer === 7 || langer === 30) {
  //         for (var i = 0; i < datas.length; i++) {
  //           if (i % langer == 0) {
  //             newData[i / langer] = datas[i];
  //           }
  //         }
  //       } else {
  //         newData = datas;
  //       }
  //       newData.map((item: any) => {
  //         item.x = item.x * 1000;
  //       });
  //       // var newData2 = newData;
  //       // newData2.map((item: any) => {
  //       //   item.y = item.y + 20000;
  //       // });

  //       setMindate(newData[0].x);
  //       setMaxdate(newData[newData.length - 1].x);
  //       setSeriesa(newData);
  //       // setSeriesa2(newData2);
  //     });
  // };

  const options: ApexOptions = {
    chart: {
      id: "realtime",
      type: "line",
      width: "100%",
      height: "500px",
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 5000,
        },
      },
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    title: {
      text: "",
      align: "center",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      range: timestamp,
      min: mindate,
      max: maxdate,
      title: {
        text: "Date",
      },
      labels: {
        // datetimeFormatter: {
        //   year: "yyyy",
        //   month: "MMM 'yy",
        //   day: "dd MMM",
        // },
        format: timestyle,
      },
    },
    yaxis: [
      {
        title: {
          text: "USD",
        },
        logarithmic: logarithmic,
        min: 1000000000,
        max: 3500000000,
        tickAmount: 8,
        labels: {
          formatter: function (value) {
            var val: number = Math.abs(value);
            var newval: string = "";
            if (val >= 10000000) {
              newval = (val / 1000000).toFixed(0) + " M";
            } else if (val > 10000) {
              newval = (val / 1000).toFixed(0) + " K";
            }
            return newval;
          },
        },
      },
    ],
    stroke: {
      width: 2,
      curve: "smooth",
    },
    colors: ["#0C6CF2", "#44cc99", "#ee66dd"],
    fill: {
      type: "gradient",
      gradient: {
        inverseColors: true,
        type: "vertical",
        stops: [0, 30],
      },
    },
    tooltip: {
      x: {
        show: true,
        format: "dd MMM HH:mm",
        formatter: undefined,
      },
      y: {
        formatter: function (value: number) {
          var val: number = Math.abs(value);
          var newvalue: string = "";
          if (val >= 1000000) {
            newvalue = (val / 1000000).toFixed(2) + " M";
          }
          return newvalue;
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
  };

  // useEffect(() => {
  //   window.setInterval(()=> {
  //     ApexCharts.exec('realtime', 'updateSeries',[{
  //       data: series
  //     }])
  //   }, 1000)
  // },[])

  // get newdata whenever socket called in Reserve.tsx
  useEffect(() => {
      var newseriesOne: any = [];
      var newseriesTwo: any = [];
      var newseriesThree: any = [];
    
      newseriesOne.push({ x: Math.floor((new Date()).getTime() / 1000), y: cash });
      newseriesTwo.push({ x: Math.floor((new Date()).getTime() / 1000), y: high });
      newseriesThree.push({ x: Math.floor((new Date()).getTime() / 1000), y: borrow });
    
      setMindate(mindate + 1000);
      setMaxdate(maxdate + 1000);
    
      seriesa[maxdate] = cash;
      seriesb[maxdate] = high;
      seriesc[maxdate] = borrow;

      console.log(cash, high, borrow)

  }, [cash, high, borrow]);

  const setTarget = (chartday: any, index: any) => {
    setTimestamp(chartday);
    setButtonClicked(index);
    if (index == 5) {
      setTimestyle("dddd:HH");
    } else if (index < 5 && index > 2) {
      setTimestyle("dd:HH:mm");
    } else if (index < 3) {
      setTimestyle("HH:mm");
    }
  };

  const LinerTarget = (index: any, target: any) => {
    setLinearTarget(index);
    setLogarithmic(target);
  };

  // const setlen = (index: any, leng: any) => {
  //   setLanger(leng);
  //   setlangbuttontarget(index);
  // };

  return (
    <>
      <div className="w-full text-center">
        <div id="chart" className="sm:w-12/12 md:w-10/12 lg:w-10/12 m-auto">
          <Chart options={options} series={series} height="400" />
        </div>
        <div className="sm:w-12/12 md:w-10/12 lg:w-10/12 m-auto px-1 md:px-10">
          <div className="w-full lg:flex justify-between">
            <div className="text-md mt-5">
              {ChartDays.map((chartday, index) => {
                return (
                  <button
                    value={chartday}
                    className={`py-2 text-xs active:border-none xs:px-1 md:px-2 border-2 active:bg-[#0C6CF277] active:text-white ${
                      index === 0 && "rounded-l-xl"
                    } ${index === ChartDays.length - 1 && "rounded-r-xl"} ${
                      index === buttonclicked &&
                      "bg-[#0C6CF277] border-blue-300 text-[#0C6CF2]"
                    }`}
                    onClick={() => setTarget(chartday, index)}
                    key={`button-${index}`}
                  >
                    {chartButtonName[index]}
                  </button>
                );
              })}
            </div>
            {/* <div className="mt-5">
              <button
                className={`py-2 text-xs active:border-none xs:px-1 md:px-2 border-2 active:bg-[#0C6CF277] active:text-white rounded-l-xl ${
                  langbuttonetarget == 0 &&
                  "bg-[#0C6CF277] border-blue-300 text-[#0C6CF2]"
                }`}
                onClick={() => setlen(0, 1)}
              >
                Raw Values
              </button>
              <button
                className={`py-2 text-xs active:border-none xs:px-1 md:px-2 border-2 active:bg-[#0C6CF277] active:text-white ${
                  langbuttonetarget == 1 &&
                  "bg-[#0C6CF277] border-blue-300 text-[#0C6CF2]"
                }`}
                onClick={() => setlen(1, 7)}
              >
                7 Day Average
              </button>
              <button
                className={`py-2 text-xs active:border-none xs:px-1 md:px-2 border-2 active:bg-[#0C6CF277] active:text-white rounded-r-xl ${
                  langbuttonetarget == 2 &&
                  "bg-[#0C6CF277] border-blue-300 text-[#0C6CF2]"
                }`}
                onClick={() => setlen(2, 30)}
              >
                30 Day Average
              </button>
            </div> */}

            <div className="sm:w-12/12 mt-5 lg:flex justify-start">
              <button
                className={`py-2 text-xs active:border-none xs:px-1 md:px-2 border-2 active:bg-[#0C6CF277] active:text-white rounded-l-xl ${
                  lineartarget === 0 &&
                  "bg-[#0C6CF277] border-blue-300 text-[#0C6CF2]"
                }`}
                onClick={() => LinerTarget(0, false)}
              >
                Linear Scale
              </button>
              <button
                className={`py-2 text-xs active:border-none xs:px-1 md:px-2 border-2 active:bg-[#0C6CF277] active:text-white rounded-r-xl ${
                  lineartarget === 1 &&
                  "bg-[#0C6CF277] border-blue-300 text-[#0C6CF2]"
                }`}
                onClick={() => LinerTarget(1, true)}
              >
                Logarithmic Scale
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BTCchart;
