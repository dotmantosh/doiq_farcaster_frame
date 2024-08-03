'use client'
import React, { useEffect, useState } from 'react'
import styles from "../../style/leaderboard.module.scss"
import { IUser } from "../../interfaces/IUser"
import { UserService } from '@/lib/services/user.service'
import { Spinner } from "reactstrap"

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<IUser[]>([])
  const [allDoiqCount, setAllDoiqCount] = useState(0)
  const [isFetchingLeaderboard, setIsFetchingLeaderboard] = useState(false)
  const handleFetchLeaderboard = async () => {
    try {
      setIsFetchingLeaderboard(true)
      const resData = (await UserService.FetchUsers()).data
      setLeaderboard(resData.leaderboard)
      setAllDoiqCount(resData.allDoiqCounts
      )
      console.log(resData)
      console.log(resData.leaderboard)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetchingLeaderboard(false)
    }
  }
  useEffect(() => {
    handleFetchLeaderboard()
  }, [])
  return (
    // <div className={styles.leaderboard}>
    //   <h1 className="my-2">doiq</h1>
    //   <p className="mb-2">The doiqers have doiqed {allDoiqCount} times in total</p>
    //   <p className="mb-2">doiq on warpcast</p>

    //   <h2 className="mb-2">Leaderboard Updates in real time</h2>


    //   <table>
    //     <thead>
    //       <tr>
    //         <th>Rank</th>
    //         <th>Username</th>
    //         <th>Successful doiqs</th>
    //         <th>Unsuccessful doiqs</th>
    //       </tr>
    //     </thead>
    //     {
    //       isFetchingLeaderboard ?
    //         <div className="d-flex justify-content-center">
    //           <Spinner size="32">Loading...</Spinner>
    //         </div>

    //         :
    //         <tbody>
    //           {
    //             leaderboard.length > 0 && leaderboard.map((user, index) => {
    //               const doiqCorrectAnswerCount = user.doiqCorrectAnswerCount ?? 0;
    //               const incorrectAnswerCount = (user.doiqCount ?? 0) - doiqCorrectAnswerCount;

    //               return (
    //                 <tr key={index}>
    //                   <td>{index + 1}</td>
    //                   <td>{user.username}</td>
    //                   <td>{doiqCorrectAnswerCount}</td>
    //                   <td>{incorrectAnswerCount}</td>
    //                 </tr>
    //               );
    //             })
    //           }
    //         </tbody>

    //     }
    //   </table>

    // </div>
    <>
      Leaderboard
    </>
  )
}

export default Leaderboard