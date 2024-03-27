export type User = {
  _id: String;
  firstName: String;
  isAdmin?: Boolean;
  middleName: String;
  lastName: String;
  email: String;
  phoneNo: String;
  avatar: String;
  teamName?: String;
  playingSkill: String;
  gender: String;
  adharNumber: String;
  birthDate: Date;
  birthCertificate: String;
  adharCard: String;
};
export type Team = {
  teamName: String;
  email: String;
  ageGroup: String;
  authorizedPersonName: String;
  managerName: String;
};
