import { profileFields } from "@/constants/index.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import { useContext } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";

import DocumentView from "@/components/DocumentView.tsx";

const Profile = () => {
  let { user } = useContext(AuthContext);

  return (
    <>
      <div className="p-4 px-7 flex flex-col w-full gap-4">
        <div className="text-2xl font-[500] text-slate-600 tracking-wide">
          My Profile
        </div>
        <div className="tracking-wide w-full flex flex-col lg:grid grid-cols-3 place-content-center gap-16 ">
          <div className="flex flex-col gap-4 justify-center w-full items-center bg-slate-500 p-4 shadow-md rounded-md">
            <div className="flex flex-col gap-4 justify-start text-center items-center">
              <div>
                <Avatar className="border-slate-600 border-2 w-36 h-36">
                  <AvatarImage src={String(user?.avatar)}></AvatarImage>
                </Avatar>
              </div>
              <div>
                <div className="uppercase text-slate-100 text-2xl">
                  {user?.firstName +
                    " " +
                    user?.middleName +
                    " " +
                    user?.lastName}
                </div>
                <div className="text-slate-900 tracking-wider text-base font-[500]">
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
          <div className="w-full col-span-2 grid grid-cols-2 gap-8">
            {Object.entries(user || {})
              ?.filter((elem) => {
                return profileFields?.includes(elem?.[0]);
              })
              .map((elem) => {
                return (
                  <div className="lg:text-left text-center">
                    <div className="uppercase text-slate-500 text-lg">
                      {elem?.[0]}
                    </div>
                    <div className="text-xl uppercase">
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
      </div>
    </>
  );
};

export default Profile;
