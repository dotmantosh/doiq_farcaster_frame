import { IUser } from "@/interfaces/IUser"
import Api from "./Api"
import { ApiRoutes } from "./apiRoutes"

export class ApiClient {
  static async CreateUser(data: IUser) {
    return Api().post(ApiRoutes.CreateUser, data)
  }
  static async FetchUsers() {
    return Api().get(ApiRoutes.FetchUser,)
  }
  static async FetchUserByFid(fid: string) {
    return Api().get(`${ApiRoutes.FetchUser}/${fid}`)
  }
  static async UpdateUser(fid: string, data: IUser) {
    return Api().put(`${ApiRoutes.UpdateUser}/${fid}`, data)
  }
}