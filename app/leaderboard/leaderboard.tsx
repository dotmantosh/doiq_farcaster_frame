'use client'
import React, { useEffect, useState } from 'react'
import styles from "../../style/leaderboard.module.scss"
import { IUser } from "../../interfaces/IUser"
import { UserService } from '@/lib/services/user.service'

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
    <div className={styles.leaderboard}>
      <h1 className="my-2">DOIQ</h1>
      <p className="mb-2">The doiqers have doiqed {allDoiqCount} times in total</p>
      <p className="mb-2">Doiq on warpcast</p>

      <h2 className="mb-2">Leaderboard Updates in real time</h2>

      doiq on <a>warpcast</a>

      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>USERNAME</th>
            <th>TIME</th>
            <th>DOIQS</th>
          </tr>
        </thead>
        <tbody>
          {
            leaderboard.map((user, index) => (

              <tr key={index}>
                <td>{index}</td>
                <td>{user.username}</td>
                <td>{user.updatedAt}</td>
                <td>{user.doiqsCount}</td>
              </tr>
            ))
          }
        </tbody>
      </table>

    </div>
  )
}

export default Leaderboard