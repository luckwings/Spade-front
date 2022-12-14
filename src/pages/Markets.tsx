import Tippy from "@tippyjs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { socket } from "../socket";
import { currencyAbbr } from "../utils/currency";
import Preloader from "../components/Preloader";

const Markets = () => {
  const [assets, setAssets] = useState<any[]>([]);

  const [reserve, setReserve] = useState<any>(null);

  const tooltip = {
    asset:
      "You can provide assets for collateral as a form of security to secure a loan with Spade. Assets can range from commodities, stock, digital assets, and real estate.",
    total_collateral:
      "This is the total value of assets you provide as a form of security to borrow cash from Spade’s Cash Reserves.",
    loan_to_value:
      "This is the evaluation ratio utilised by Spade when determining the risk involved with providing a credit line for a potential borrower. A higher LTV ratio is more dependable to Spade, and a lower LTV ratio is perceived as riskier.",
    total_borrowed:
      "This is the amount of money you have borrowed from the Spade Cash Reserve by providing your asset collateral.",
    supply_flexible_apy: "Supply Flexible APY",
    supply_fixed_term_apy: "Supply Fixed Term APY",
    borrow_flexible_apr: "Borrow Flexible APR",
    borrow_fixed_term_apr: "Borrow Fixed Term APR",
  };

  useEffect(() => {
    loadAssets();

    let rotationInterval = setInterval (() => {
      loadAssets();
    }, 60000) //get new data per 1 mins
    
    socket.on("reserve", (data) => {
      setReserve(data);
    });
    
    socket.emit("reserve");
    
    return () => {
      socket.off("reserve");
      clearInterval(rotationInterval);
    };
  }, []);
  
  const loadAssets = async () => {
    const { data } = await axios.get(API_URL + "/assets");
    const finalData: any[] = [];
    data.forEach((v: any) => {
      finalData.push(v);
      v.sub_assets.forEach((z: any, i: number) => {
        finalData.push({ ...z, _id: `${v._id}-${i}`, child: true });
      });
    });
    setAssets(finalData);
  };

  if (!assets.length || !reserve) {
    return (
      <Preloader />
      // <></>
    )
  }

  const percentStyle = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="bg-split-white-black px-4 md:p-12 lg:p-14 xl:px-24">
      <div className="block md:flex items-center">
        <div className="text-left text-white md:w-4/12 mb-4 md:mb-0 font-bold cursor-pointer relative">
          <span className="mx-2 text-xl md:text-2xl">Market Overview</span>
        </div>

        <div className="flex justify-between lg:w-6/12 md:w-8/12 flex-wrap text-left xl:mt-0">
          <div className="mx-2 pb-4">
            <p className="text-gray-400 text-sm">Total collateral value</p>
            <p className="text-gray-200 text-xl">
              {currencyAbbr(
                assets
                  .filter((v: any) => !v.child)
                  .reduce((sum: number, v: any) => sum + v.total_collateral, 0),
              )}
            </p>
          </div>
          <div className="mx-2 pb-4">
            <p className="text-gray-400 text-sm">Available Liquidity</p>
            <p className="text-gray-200 text-xl">
              {currencyAbbr(
                assets
                  .filter((v: any) => !v.child)
                  .reduce(
                    (sum: number, v: any) => sum + v.available_liquidity,
                    0,
                  ),
              )}
            </p>
          </div>
          <div className="mx-2 pb-4">
            <p className="text-gray-400 text-sm">Total cash borrowed</p>
            <p className="text-gray-200 text-xl">
              {currencyAbbr(reserve[1].total)}
            </p>
          </div>
        </div>

      </div>
      <div className="rounded-md shadow-md bg-white p-1 mt-10">
        <p className="text-xl mt-4 mb-10 mx-6 text-left">
          Oracle reserve assets
        </p>
        <table className="w-full hidden lg:table">
          <thead className="text-xs text-left text-gray-500 font-thin">
            <tr>
              <th className="pl-8 pb-2">
                Asset
                <Tippy interactive content={tooltip.asset}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th>
                Total collateral
                <Tippy interactive content={tooltip.total_collateral}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th>
                Loan to Value
                <Tippy interactive content={tooltip.loan_to_value}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th>
                Total borrowed
                <Tippy interactive content={tooltip.total_borrowed}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th>
                Supply Flexible APY
                <Tippy interactive content={tooltip.supply_flexible_apy}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th>
                Supply Fixed Term APY
                <Tippy interactive content={tooltip.supply_fixed_term_apy}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th>
                Borrow Flexible APR
                <Tippy interactive content={tooltip.borrow_flexible_apr}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th>
                Borrow Fixed Term APR
                <Tippy interactive content={tooltip.borrow_fixed_term_apr}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 inline relative cursor-pointer -top-[1px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Tippy>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset: any) => (
              <tr
                className={`border-t hover:bg-gray-100 ${
                  asset.child ? "text-sm" : "font-medium"
                }`}
                key={asset._id}
              >
                <td className={`pl-8 py-2 ${asset.child ? "pl-10" : ""}`}>
                  {asset.name}
                </td>
                <td>{currencyAbbr(asset.total_collateral)}</td>
                <td>{percentStyle(asset.loan_to_value)}%</td>
                <td>
                {/* {currencyAbbr(asset.total_borrowed)} */}
                  {currencyAbbr(
                    (asset.total_collateral / 100) * asset.loan_to_value,
                  )}
                </td>
                <td>{percentStyle(asset.supply_flexible_apy) || "N/A"}%</td>
                <td>{asset.supply_fixed_term_apy || "N/A"}</td>
                <td>{percentStyle(asset.borrow_flexible_apr) || "N/A"}%</td>
                <td>{asset.borrow_fixed_term_apr || "N/A"}</td>
                <td className={asset.child ? "hidden" : "block"}>
                  <Link to={"/markets/overview/" + asset._id}>
                    <button className="px-2 py-1 border bg-gray-100 rounded text-sm cursor-pointer">
                      Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lg:hidden">
          {assets.map((asset: any) => (
            <div key={asset._id} className="border-t p-4">
              <div className="w-full">
                <p className="font-bold text-center md:text-left">{asset.name}</p>
              </div>
              <div className="w-full md:text-base sm:text-sm text-xs flex justify-bewteen my-4">
                <div className="w-10/12">
                  <p className="text-left">
                    Total collateral
                  </p>
                </div>
                <div className="w-5/12 text-right">
                  <p className="text-right">
                    {currencyAbbr(asset.total_collateral)}
                  </p>
                </div>
              </div>
              <div className="w-full md:text-base sm:text-sm text-xs flex justify-bewteen my-4">
                <div className="w-10/12">
                  <p className="text-left">
                    Loan to Value
                  </p>
                </div>
                <div className="w-5/12 text-right">
                  <p className="text-right">
                    {percentStyle(asset.loan_to_value)}%
                  </p>
                </div>
              </div>
              <div className="w-full md:text-base sm:text-sm text-xs flex justify-bewteen my-4">
                <div className="w-10/12">
                  <p className="text-left">
                    Total borrowed
                  </p>
                </div>
                <div className="w-5/12 text-right">
                  <p className="text-right">
                    {currencyAbbr(
                      (asset.total_collateral / 100) * asset.loan_to_value
                    )}
                  </p>
                </div>
              </div>
              <div className="w-full md:text-base sm:text-sm text-xs flex justify-bewteen my-4">
                <div className="w-10/12">
                  <p className="text-left">
                    Supply Flexible APY
                  </p>
                </div>
                <div className="w-5/12 text-right">
                  <p className="text-right">
                    {percentStyle(asset.supply_flexible_apy) || "N/A"}%
                  </p>
                </div>
              </div>
              <div className="w-full md:text-base sm:text-sm text-xs flex justify-bewteen my-4">
                <div className="w-10/12">
                  <p className="text-left">
                    Supply Fixed Term APY
                  </p>
                </div>
                <div className="w-5/12 text-right">
                  <p className="text-right">
                    {asset.supply_fixed_term_apy || "N/A"}
                  </p>
                </div>
              </div>
              <div className="w-full md:text-base sm:text-sm text-xs flex justify-bewteen my-4">
                <div className="w-10/12">
                  <p className="text-left">
                    Borrow Flexible APR
                  </p>
                </div>
                <div className="w-5/12 text-right">
                  <p className="text-right">
                    {percentStyle(asset.borrow_flexible_apr) || "N/A"}%
                  </p>
                </div>
              </div>
              <div className="w-full md:text-base sm:text-sm text-xs flex justify-bewteen my-4">
                <div className="w-10/12">
                  <p className="text-left">
                    Borrow Fixed Term APR
                  </p>
                </div>
                <div className="w-5/12 text-right">
                  <p className="text-right">
                    {asset.borrow_fixed_term_apr || "N/A"}
                  </p>
                </div>
              </div>
              <div className={asset.child ? "hidden" : "block"}>
                <div className={`w-full flex my-4`}>
                  <Link to={"/markets/overview/" + asset._id} className="w-full">
                    <button className="p-2 border bg-gray-100 rounded text-sm w-full cursor-pointer">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Markets;
