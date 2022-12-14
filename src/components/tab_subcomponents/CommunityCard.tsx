import { Link } from "react-router-dom";
import React from "react";

interface CommunityCardProps {
  card?: any;
}

const CommunityCard = (props: CommunityCardProps) => {
  const { card } = props;

  return (
    <div className="box flex items-center justify-between shadow-xl hover:shadow-2xl p-2 md:p-6 transition ease-in-out delay-150 relative hover:-translate-y-2 duration-300 cursor-pointer communityCardGroup">
      <div className="bg-cover flex items-center">
        <img className="w-[48px] md:4/6 m-4" src={card.logo}></img>
        <h4 className="text-stone-700 text-start">
          {card.title}
        </h4>
      </div>
      <p><img src="right-arrow.svg" alt=" " className="communityCard w-5 flex text-[#00D395]"></img></p>
    </div>
  );
};

export default CommunityCard;
