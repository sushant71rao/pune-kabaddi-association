export type User = {
  firstName: String;
  middleName: String;
  lastName: String;
  email: String;
  phoneNo: String;
  avatar: String;
  teamName?: String;
};
export type Team = {
  teamName: String;
  email: String;
  ageGroup: String;
  authorizedPersonName: String;
  managerName: String;
};
