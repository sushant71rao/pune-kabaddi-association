import { profileFields } from "@/constants/index.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import React, { useContext } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import DocumentView from "@/components/DocumentView.tsx";

const Profile = () => {
  let { user } = useContext(AuthContext);

  return (
    <div className="tracking-wide p-4 flex flex-col gap-4 px-7">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 justify-start items-center">
          <div>
            <Avatar className="w-24 h-24">
              <AvatarImage src={String(user?.avatar)}></AvatarImage>
            </Avatar>
          </div>
          <div>
            <div className="uppercase text-2xl">
              {user?.firstName + " " + user?.middleName + " " + user?.lastName}
            </div>
            <div className="text-slate-500 text-base font-[500]">
              {user?.email}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <DocumentView
            buttonName="Aadhar Card"
            imgUrl={String(user?.adharCard) || ""}
          ></DocumentView>
          <DocumentView
            buttonName="Birth Certificate"
            imgUrl={String(user?.birthCertificate) || ""}
          ></DocumentView>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {Object.entries(user || {})
          ?.filter((elem) => {
            return profileFields?.includes(elem?.[0]);
          })
          .map((elem) => {
            return (
              <div>
                <div className="uppercase text-slate-500">{elem?.[0]}</div>
                <div className="text-lg uppercase">
                  {String(
                    elem?.[0] == "birthDate"
                      ? elem?.[1].toString().slice(0, 10)
                      : elem?.[1]
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Profile;
