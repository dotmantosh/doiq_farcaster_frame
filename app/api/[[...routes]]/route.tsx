/** @jsxImportSource frog/jsx */

import { Button, Frog, FrogConstructorParameters, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as neynarHub } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/middlewares'
import moment from 'moment'


const apiKey = process.env.NEYNAR_API_KEY as string;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost:3000'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynarHub({ apiKey: 'NEYNAR_FROG_FM' })
  // hub: neynar({ apiKey })
} as FrogConstructorParameters)
  .use(neynar(
    {
      apiKey: 'NEYNAR_FROG_FM',
      features: ['interactor', 'cast'],
    }
  ))

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue, status, frameData, verified } = c
  const fruit = buttonValue
  console.log("rendering frame")
  return c.res({
    action: '/doiq',
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'white',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 180,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.0,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          doiq?
        </div>
        <div
          style={{
            color: 'black',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            padding: '0 240px',
            whiteSpace: 'pre-wrap',
          }}
        >
          click to doiq
        </div>
      </div>
    ),
    intents: [
      <Button>Start</Button>,
      <Button.Link href='http://localhost:3000/leaderboard'>Leaderboard</Button.Link>,
      <Button.Link href='https://docs.doiq.xyz/'>Learn</Button.Link>,
    ],
  })
})

app.frame('/doiq', async (c) => {
  const { buttonValue, status } = c
  const fruit = buttonValue

  const response = await fetch(`${HOSTNAME}/api/users?fid=${c.var.interactor?.fid}`)
  const user = await response.json()
  const lastUpdated = moment(user.updatedAt)
  const tenMinutesAgo = moment().subtract(10, 'minutes')
  const isUpdatedMoreThan10Mins = lastUpdated.isBefore(tenMinutesAgo)
  if (!user || isUpdatedMoreThan10Mins) {
    return c.res({
      action: `/result`,
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'white',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 90,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            I like to _________
          </div>
        </div>
      ),
      intents: [
        <Button value="doiq">doiq</Button>,
        <Button value="doiq?">doiq?</Button>,
        <Button value="doiq!">doiq!</Button>,
      ],
    })
  } else {
    const minutesLeft = 10 - moment().diff(lastUpdated, 'minutes')
    return c.res({
      action: '/',
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'white',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 62,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            Ops... You've doiqed too hard.
          </div>
          <div
            style={{
              color: 'black',
              fontSize: 40,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            You can doiq again in about {minutesLeft} minutes
          </div>
        </div>
      ),
      intents: [
        <Button>Home</Button>,
        <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
      ],
    })
  }

  // console.log("c: ", c)
})

app.frame('/result', async (c) => {
  const { buttonValue, status } = c

  const response = await fetch(`${HOSTNAME}/api/users?fid=${c.var.interactor?.fid}`)
  let user = await response.json()

  if (!user) {
    const userData = {
      username: c.var.interactor?.username,
      displayName: c.var.interactor?.displayName,
      fid: c.var.interactor?.fid,
      doiqValue: c.buttonValue,
      doiqCount: 1
    }
    const res = await fetch(`${HOSTNAME}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    user = await res.json()
  } else {
    const userData = {
      doiqCount: user.doiqCount + 1,
      doiqValue: buttonValue
    }
    const res = await fetch(`${process.env.HOSTNAME}/api/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    user = await res.json()
  }


  const lastUpdated = moment(user.updatedAt)
  const tenMinutesAgo = moment().subtract(10, 'minutes')
  let nextDoiqTime = "NOW"

  if (lastUpdated.isAfter(tenMinutesAgo)) {
    const minutesLeft = 10 - moment().diff(lastUpdated, 'minutes')
    nextDoiqTime = `${minutesLeft} minutes`
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'white',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 62,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Your answer has been received by the great doiq himself.
        </div>
        <div
          style={{
            color: 'black',
            fontSize: 40,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          You can doiq again in about {nextDoiqTime}
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Home</Button.Reset>,
      <Button.Link href='http://localhost:3000/leadearboard'>Leaderboard</Button.Link>,
    ],
  })
})
app.frame('/forbidden', (c) => {
  const { buttonValue, status } = c
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'white',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 62,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Your answer has been recieved by the great doiq himself.
        </div>
        <div
          style={{
            color: 'black',
            fontSize: 40,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          You can doiq again in about X minutes
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Home</Button.Reset>,
      <Button.Link href='http://localhost:3000/leaderboard'>Leaderboard</Button.Link>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
