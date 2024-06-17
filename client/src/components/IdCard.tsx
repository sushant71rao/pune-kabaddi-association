import { useRef } from "react";
import QRCode from "react-qr-code";
import { Team, User } from "@/schemas/types";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import Axios from "@/Axios/Axios";
import { useReactToPrint } from "react-to-print";

interface Prop {
  user: User;
}

const IdCard = (prop: Prop) => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
  });

  let getTeam = useQuery<Team>({
    queryKey: ["player-team"],
    queryFn: async () => {
      try {
        let res = await Axios.post(`api/v1/teams/teaminfo`, {
          teamName: prop?.user?.teamName,
        });
        console.log(res);
        return res.data?.team;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="m-6 ">
      <div className="text-2xl font-semibold underline tracking-wide">
        ID CARD
      </div>
      <div ref={componentRef}>
        <div className=" flex flex-col justify-center items-center">
          <div className="flex flex-col w-[27rem]  aspect-video">
            <div className="bg-blue-400 flex p-2 items-center justify-between gap-2 border-[1px] border-black">
              <img src="/assets/blue-logo.png" width={57}></img>
              <div className="text-lg font-[600] tracking-wide">
                Pune District kadaddi Association
              </div>
              <div className="">
                <img
                  src={`${getTeam?.data?.logo?.toString()}`}
                  alt="logo"
                  width={44}
                ></img>
              </div>
            </div>
            <div className="overlay flex uppercase justify-between gap-6  bg-blue-100 p-2 border-[1px]  border-black h-[12rem]">
              <div className="flex flex-col h-full justify-between gap-2">
                <img
                  src={String(prop?.user?.avatar || "")}
                  alt={String(prop?.user?.firstName)}
                  width={100}
                ></img>
                <img src="../assets/sign1.png" width={148}></img>
              </div>
              <div className=" w-full text-slate-900 flex flex-col gap-2">
                <div>
                  <span className="heading">Player ID : </span>
                  <span className="heading">{prop?.user?._id?.slice(-5)}</span>
                </div>
                <div className="flex gap-1">
                  <span className="heading">Name : </span>
                  <span className="flex flex-col">
                    <span>
                      {prop?.user?.firstName +
                        " " +
                        prop?.user?.middleName +
                        " " +
                        prop?.user?.lastName}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="heading">DOB : </span>
                  <span>
                    {prop?.user?.birthDate?.toLocaleString().slice(0, 10)}
                  </span>
                </div>
                <div>
                  <span className="heading">Contact : </span>
                  <span>{prop?.user?.phoneNo}</span>
                </div>
                <div>
                  <span className="heading">Aadhar : </span>
                  <span>{prop?.user?.adharNumber}</span>
                </div>
              </div>
              <div className="flex flex-col justify-between ">
                <QRCode
                  value={window.location.origin + `/idcard/${prop?.user?._id}`}
                  size={64}
                />
                <img src="../assets/sign2.png" width={148}></img>
              </div>
            </div>
          </div>
          <div className="flex rotate-180 flex-col w-[27rem] aspect-video">
            <div className="bg-blue-400 flex p-2 items-center justify-between gap-2 border-[1px] border-black">
              <img src="/assets/blue-logo.png" width={57}></img>
              <div className="text-lg font-[600] tracking-wide">
                पुणे जिल्हा कबड्डी असोसिएशन
              </div>
              <div className="">
                <img
                  src={getTeam?.data?.logo?.toString() || ""}
                  alt="logo"
                  width={44}
                ></img>
              </div>
            </div>
            <div className="flex overlay flex-col uppercase gap-3  bg-blue-100 p-4 border-[1px] items-center border-black w-full aspect h-[12rem]">
              <div>
                <span className="heading">Team : </span>
                <span className="">{getTeam?.data?.teamName}</span>
              </div>
              <div>
                <span className="heading ">Zone : </span>
                <span className="">{getTeam?.data?.zone}</span>
              </div>
              <div>
                <span className="heading ">Team PinCode : </span>
                <span className="">{getTeam?.data?.pinCode}</span>
              </div>
              <div className="flex justify-between w-full">
                <img src="../assets/sign1.png" width={68}></img>
                <img src="../assets/sign2.png" width={68}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={() => handlePrint()}>Print</Button>
    </div>
  );
};

export default IdCard;
