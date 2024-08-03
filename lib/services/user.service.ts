import { IDoiq } from './../../interfaces/IDoiq';
import { IUser } from "@/interfaces/IUser";
import Api from './Api';
import { ApiRoutes } from './apiRoutes';
import { User, UserDocument } from '@/models/user.schema';
import { Doiq, DoiqDocument } from '@/models/doiq.schema';
import dbConnect from '../dbConnection';
export class UserService {
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

  static async CreateUserFromFrontend(data: IUser) {
    try {
      await dbConnect()
      const user = new User(data)
      const doiq = await Doiq.create({ userId: user._id, userFid: user.fid, doiqValue: data.doiqValue, doiqAnswer: data.doiqAnswer })
      user.doiqs.push(doiq._id)
      user.save()
      // console.log(user)
      // console.log(doiq)
      return { status: true, user }
    } catch (error: any) {
      console.log('Full Error :', error)
      console.log('Error Message :', error.message)
      // return { status: true, user: null }
      throw new Error(`Error while creating User: ${error}`);
    }
  }
  static async UpdateUserFromFrontend(fid: string, data: IUser) {
    try {
      await dbConnect()
      const user = await User.findOne({ fid })
      console.log("user Found in user service/updateUser")
      if (user) {
        const doiq = await Doiq.create({ userId: user._id, userFid: user.fid, doiqValue: data.doiqValue, doiqAnswer: data.doiqAnswer })
        user.doiqs.push(doiq._id)
        user.save()
        // console.log(user)
        // console.log(doiq)
        const updatedUser = await User.findById(user._id);
        if (!updatedUser) {
          throw new Error("Updated user not found");
        }


        return { status: true, user: updatedUser }
      }
      else {
        console.log("No user with the given fid " + data.fid)
        return { status: false, user: null }
      }
    } catch (error: any) {
      console.log('Full Error :', error)
      console.log('Error Message :', error.message)
      // return { status: false, user: null }
      throw new Error(`Error while creating User: ${error}`);
    }
  }

  static async fetchUserByFidFromFrontend(fid: string) {
    try {
      await dbConnect()
      const user = await User.findOne({ fid });
      if (user) {
        return { status: true, user }
      }
      else {
        return { status: false, user: null }
      }
    } catch (error: any) {
      console.log('Full Error :', error)
      console.log('Error Message :', error.message)
      return { status: false, user: null }
      // throw new Error(`Error while fetching user: ${error}`);
    }
  }

  static async findAll() {
    try {
      const users = await User.aggregate([
        {
          $lookup: {
            from: 'doiqs',
            localField: '_id',
            foreignField: 'userId',
            as: 'doiqs'
          }
        },
        {
          $addFields: {
            doiqCount: { $size: "$doiqs" },
            doiqCorrectAnswerCount: {
              $size: {
                $filter: {
                  input: "$doiqs",
                  as: "doiq",
                  cond: { $eq: ["$$doiq.doiqValue", "$$doiq.doiqAnswer"] }
                }
              }
            }
          }
        },
        {
          $sort: { doiqCorrectAnswerCount: -1 }
        }
      ]).exec(); // Ensure the aggregation executes
      return users;
    } catch (error: any) {
      console.log('Full Error :', error)
      console.log('Error Message :', error.message)
      return []
    }
  }
}