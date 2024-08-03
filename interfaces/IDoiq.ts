export enum EDoiq {
  doiq = "doiq",
  doiqQuestion = "doiq?",
  doiqExclamation = "doiq!"
}
export interface IDoiq {
  _id?: string;
  userId: string;
  userFid: string;
  doiqValue: EDoiq;
  doiqAnswer: EDoiq;
  createdAt: string;
  updatedAt: string;
}