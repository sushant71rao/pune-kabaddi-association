import { useEffect, useState } from "react";

import translate from "translate";
import QRCode from "react-qr-code";
import { Team, User } from "@/schemas/types";
import { Button } from "./ui/button";
import { usePDF } from "react-to-pdf";
import { useQuery } from "@tanstack/react-query";
import Axios from "@/Axios/Axios";

interface Prop {
  user: User;
}

const IdCard = (prop: Prop) => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  // let { prop?.user } = useContext(AuthContext);
  let [transated, setTranslated] = useState<{ teamname: string }>();

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

  useEffect(() => {
    let translatefn = async () => {
      setTranslated({
        teamname: await translate(String(prop?.user?.teamName!), { to: "hi" }),
      });
    };
    translatefn();
  }, []);
  let dummy = {
    pAddress: "Malthan Shirur Thet Pune 411033",
    tAddress: "A/P malthan tel ,Shirur Malthan Pune Maharashtra 411033",
    Zone: "Malthan Pune",
  };
  // console.log(transated);
  return (
    <div className="m-6 ">
      <div className="text-2xl font-semibold underline tracking-wide">
        ID CARD
      </div>
      <div ref={targetRef}>
        <div className=" flex flex-wrap gap-3 justify-center items-center">
          <div className="flex flex-col w-[27rem]  aspect-video">
            <div className="bg-blue-400 flex p-2 items-center justify-between gap-2 border-[1px] border-black">
              <img src="/assets/logo.png" width={57}></img>
              <div className="text-lg font-[600] tracking-wide">
                Pune District Kabbadi Association
              </div>

              <div className="mix-blend-darken">
                <img
                  src={getTeam?.data?.logo?.toString() || ""}
                  alt="logo"
                  width={44}
                ></img>
              </div>
            </div>
            <div className="overlay flex uppercase justify-between gap-6  bg-blue-100 p-2 border-[1px]  border-black h-[12rem]">
              <div className="flex flex-col gap-2">
                <img
                  src={String(prop?.user?.avatar || "")}
                  alt={String(prop?.user?.firstName)}
                  width={100}
                ></img>
                <img
                  src="/assets/signature.png"
                  alt="sign"
                  width={120}
                  className="mix-blend-darken"
                ></img>
              </div>
              <div className=" w-full text-slate-900 flex flex-col gap-1">
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
                <div className="flex gap-1">
                  <span className="heading">Team : </span>
                  <span>
                    <div>{transated?.teamname}</div>
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
              <div className="">
                <QRCode
                  value={window.location.origin + `/idcard/${prop?.user?._id}`}
                  size={44}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[27rem] aspect-video">
            <div className="bg-blue-400 flex p-2 items-center justify-between gap-2 border-[1px] border-black">
              <img src="/assets/logo.png" width={57}></img>
              <div className="text-lg font-[600] tracking-wide">
                पुणे जिल्हा कबड्डी असोसिएशन
              </div>
              <div className="mix-blend-darken">
                <img src="/assets/pkl.jpg" alt="logo" width={44}></img>
              </div>
            </div>
            <div className="flex overlay flex-col uppercase gap-6  bg-blue-100 p-2 border-[1px] border-black w-full aspect h-[12rem] items-center">
              <div>
                <span className="heading">Player ID : </span>
                <span className="text-sm">{prop?.user?._id?.slice(-5)}</span>
              </div>
              <div>
                <span className="heading">Team Address : </span>
                <span className="text-sm">{getTeam?.data?.email}</span>
              </div>
              <div>
                <span className="heading ">Zone : </span>
                <span className="text-sm">{dummy?.Zone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={() => toPDF()}>Download</Button>
    </div>
  );
};

export default IdCard;
