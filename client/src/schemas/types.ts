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
  playingSkill: String | [String];
  gender: String;
  adharNumber: String;
  birthDate: Date;
  birthCertificate: String;
  adharCard: String;
};
export type Team = {
  _id: String;
  zone?: String;
  teamName: String;
  email: String;
  ageGroup: String;
  authorizedPersonName: String;
  managerName?: String;
  address?: String;
  pinCode?: String;
  logo?: String;
};
