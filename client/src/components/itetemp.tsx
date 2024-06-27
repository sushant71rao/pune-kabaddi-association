import { useRef } from "react";
import QRCode from "react-qr-code";
import { Team, User } from "@/schemas/types";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import Axios from "@/Axios/Axios";

interface Prop {
  user: User;
}

const IdCard = (prop: Prop) => {
  const componentRef = useRef(null);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedDate = formatDate(prop?.user?.birthDate);

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
    <div className="m-6">
      <div className="text-2xl font-semibold uppercase mb-2">ID CARD</div>
      <div ref={componentRef}>
        <div className=" flex gap-4 justify-center items-center">
          <div className="w-[88mm] h-[56mm] overlay aspect-video border-b-8 border-blue-700">
            <div className="flex mt-1 m-2 mb-1 rounded-xl pt-1 pb-1 p-2 bg-gradient-to-b from-[#284369] to-[#0368b5] items-center justify-between gap-1 ">
              <img src="/assets/blue-logo.png" width={30}></img>
              <div className="text-sm text-center line-clamp-2 text-[#fef58a] tracking-[0.75px] font-semibold uppercase">
                <div>Pune District</div>
                <div>Kabaddi Association</div>
              </div>
              <div className="">
                <img
                  src={`${getTeam?.data?.logo?.toString()}`}
                  alt="logo"
                  width={30}
                ></img>
              </div>
            </div>
            <div className="flex  justify-between gap-3 p-1 h-[70%] m-2">
              <div className="flex flex-col h-full justify-between gap-1 w-40">
                <img
                  className="border-white border rounded-md w-28"
                  src={String(prop?.user?.avatar || "")}
                  alt={String(prop?.user?.firstName)}
                  width={120}
                ></img>
                <img src="../assets/sign1.png" width={74}></img>
              </div>
              <div className="w-full text-slate-900 flex flex-col gap-1 text-xs">
                <div>
                  <span className="heading">Player ID: </span>
                  <span className="heading">{prop?.user?._id?.slice(-5)}</span>
                </div>
                <div className="flex gap-1">
                  <span className="heading">Name: </span>
                  <span className="flex flex-col">
                    <span className="capitalize">
                      {prop?.user?.firstName +
                        " " +
                        prop?.user?.middleName +
                        " " +
                        prop?.user?.lastName}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="heading">DOB: </span>
                  <span>{formattedDate}</span>
                </div>
                <div>
                  <span className="heading">Contact: </span>
                  <span>{prop?.user?.phoneNo}</span>
                </div>
                <div>
                  <span className="heading">Aadhar: </span>
                  <span>{prop?.user?.adharNumber}</span>
                </div>
              </div>
              <div className="flex flex-col justify-between w-36 items-center">
                <QRCode
                  value={`https://punekabaddiassociation.com/id-card/${prop?.user?._id}`}
                  size={60}
                />
                <img src="../assets/sign2.png" width={74}></img>
              </div>
            </div>
          </div>

          <div className="w-[88mm] h-[56mm] overlay aspect-video">
            <div className="flex mt-1 m-2 mb-1 rounded-xl pt-1 pb-1 p-2 bg-gradient-to-b from-[#284369] to-[#0368b5] items-center justify-between gap-1">
              <img src="/assets/blue-logo.png" width={30}></img>
              <div className="text-sm text-center line-clamp-2 text-[#fef58a] tracking-[0.75px] font-semibold uppercase r">
                <div>पुणे जिल्हा </div>
                <div>कबड्डी असोसिएशन</div>
              </div>
              <div className="">
                <img
                  src={`${getTeam?.data?.logo?.toString()}`}
                  alt="logo"
                  width={30}
                ></img>
              </div>
            </div>
            <div className="flex flex-col justify-between  gap-1 p-1 items-center  h-[70%] m-2">
              <div className="w-full text-slate-900 flex flex-col gap-1 text-xs">
                <div className="text-center">
                  <span className="heading">Team: </span>
                  <span className="text-xs">{getTeam?.data?.teamName}</span>
                </div>
                <div className="text-center">
                  <span className="heading">Zone: </span>
                  <span className="text-xs">{getTeam?.data?.zone}</span>
                </div>
                <div className="text-center">
                  <span className="heading">Website </span>
                  <span className="text-xs">
                    www.punekabaddiassociation.com
                  </span>
                </div>
                <div className="text-center">
                  <span className="heading">Address </span>
                  <span className="text-xs">
                    Pandit Nehru Stadium "K" Block Saras Bang Dada wadi Shukrvar
                    Peth Pune - 411002
                  </span>
                </div>
              </div>
              <div className="flex justify-between w-full">
                <img src="../assets/sign1.png" width={60}></img>
                <img src="../assets/sign2.png" width={60}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button className="mt-4">Download</Button>
    </div>
  );
};

export default IdCard;
