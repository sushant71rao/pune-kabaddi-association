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
    <div className="m-6">
      <div className="text-2xl font-semibold">ID CARD</div>
      <div ref={componentRef}>
        <div className="flex gap-[5mm] justify-center items-center">
          <div className="flex flex-col w-[85.725mm] h-[53.975mm] aspect-video rounded-sm overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 flex p-[8.4667mm] items-center justify-between gap-[8.4667mm]">
              <img src="/assets/blue-logo.png" width={35}></img>
              <div className="text-[3.3867mm] font-[500] tracking-wide text-white">
                Pune District Kabaddi Association
              </div>
              <div className="">
                <img
                  src={`${getTeam?.data?.logo?.toString()}`}
                  alt="logo"
                  width={35}
                ></img>
              </div>
            </div>
            <div className="w-full flex justify-between gap-[25.3998mm] bg-gradient-to-r from-blue-200 to-blue-400 p-[8.4667mm] h-[50.7996mm]">
              <div className="flex flex-col h-full justify-between gap-[8.4667mm]">
                <div className="relative">
                  <img
                    src={String(prop?.user?.avatar || "")}
                    alt={String(prop?.user?.firstName)}
                    width={100}
                    className="rounded-sm border-2 border-blue-500"
                  ></img>
                </div>
                <img src="../assets/sign1.png" width={148}></img>
              </div>
              <div className="w-full text-slate-900 flex flex-col gap-[8.4667mm]">
                <div>
                  <span className="heading">Player ID: </span>
                  <span className="heading">{prop?.user?._id?.slice(-5)}</span>
                </div>
                <div className="flex gap-[4.2333mm]">
                  <span className="heading">Name: </span>
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
                  <span className="heading">DOB: </span>
                  <span>
                    {prop?.user?.birthDate?.toLocaleString().slice(0, 10)}
                  </span>
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
              <div className="flex flex-col justify-between ">
                <QRCode
                  value={`https://punekabaddiassociation.com/idcard/${prop?.user?._id}`}
                  size={64}
                />

                <img src="../assets/sign2.png" width={148}></img>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[85.725mm] h-[53.975mm] aspect-video rounded-sm overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 flex p-[8.4667mm] items-center justify-between gap-[8.4667mm]">
              <img src="/assets/blue-logo.png" width={57}></img>
              <div className="text-[6.08mm] font-[500] tracking-wide text-white">
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
            <div className="flex  flex-col gap-[8.4667mm] bg-gradient-to-r from-blue-200 to-blue-400 p-[8.4667mm] items-center w-full h-[50.7996mm]">
              <div>
                <span className="heading">Team: </span>
                <span className="">{getTeam?.data?.teamName}</span>
              </div>
              <div>
                <span className="heading">Zone: </span>
                <span className="">{getTeam?.data?.zone}</span>
              </div>
              <div>
                <span className="heading">Team PinCode: </span>
                <span className="">{getTeam?.data?.pinCode}</span>
              </div>
              <div className="flex justify-between w-full ">
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
