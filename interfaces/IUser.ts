export interface IUser {
  _id?: string;
  fid?: string;
  username?: string;
  displayName?: string;
  doiqs?: string[];
  doiqValue?: string;
  doiqAnswer?: string;
  doiqCount?: number;
  doiqCorrectAnswerCount?: number;
  createdAt?: string;
  updatedAt?: string;
}