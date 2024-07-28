/** @jsxImportSource frog/jsx */

import { Button, Frog, FrogConstructorParameters, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as neynarHub } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/middlewares'
import moment from 'moment'
import { UserService } from '@/lib/services/user.service'


const apiKey = process.env.NEYNAR_API_KEY as string;
// const HOSTNAME = "https://doiq-farcaster-frames.vercel.app"
const HOSTNAME = "http://localhost:3000"
console.log(HOSTNAME)

const fakeData = {
  fid: "12388",
  username: "dotmantosh",
  displayName: "dotmantosh",

}

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // hub: neynarHub({ apiKey })
  // hub: neynar({ apiKey })
} as FrogConstructorParameters)
// .use(neynar(
//   {
//     apiKey,
//     features: ['interactor', 'cast'],
//   }
// ))

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
      <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
      <Button.Link href='https://docs.doiq.xyz/'>Learn</Button.Link>,
    ],
  })
})

app.frame('/doiq', async (c) => {
  const { buttonValue, status } = c;
  const fruit = buttonValue;

  let user = null;
  let isUpdatedMoreThan10Mins = false;
  let lastUpdated = null;
  const tenMinutesAgo = moment().subtract(10, 'minutes');

  try {

    const response = await UserService.FetchUserByFid(fakeData.fid);
    user = response.data;
    lastUpdated = moment(user.updatedAt);
    isUpdatedMoreThan10Mins = lastUpdated.isBefore(tenMinutesAgo);
    // console.log('User found', user);
    // console.log('Last Updated:', lastUpdated);
    // console.log('Is Updated More Than 10 Mins:', isUpdatedMoreThan10Mins);
    if (isUpdatedMoreThan10Mins) {
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
      });
    } else {
      const minutesLeft = (10 - moment().diff(lastUpdated, 'minutes')).toString();
      // console.log(minutesLeft)
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
              {`Hi ${fakeData.username}, You've doiqed too hard.`}
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
              {`You can doiq again in about ${minutesLeft} minutes`}
            </div>
          </div>
        ),
        intents: [
          <Button>Home</Button>,
          <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
        ],
      });
    }

  } catch (error: any) {
    if (error.response && error.response.status === 404) {
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
      });
    } else {
      // console.log('Error:', error.message);
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
              An error occurred: {error.message}
            </div>
          </div>
        ),
      });
    }
  }


});


app.frame('/result', async (c) => {
  const { buttonValue, status } = c

  try {
    let user = (await UserService.FetchUserByFid(fakeData.fid)).data
    // console.log('user found: ', user)
    const userData = {
      doiqValue: buttonValue
    }
    user = (await UserService.UpdateUser(user.fid, userData)).data
    // console.log("user updated")
    const lastUpdated = moment(user.updatedAt)
    const tenMinutesAgo = moment().subtract(10, 'minutes')
    let nextDoiqTime = "NOW"

    if (lastUpdated.isAfter(tenMinutesAgo)) {
      const minutesLeft = (10 - moment().diff(lastUpdated, 'minutes')).toString()
      nextDoiqTime = `${minutesLeft} minutes`
    }
    // console.log("lastUpdated: ", lastUpdated)
    // console.log("next doiq time: ", nextDoiqTime)
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
            {`Good choice ${fakeData.username}, Your answer has been received by the great doiq himself.`}
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
            {`You can doiq again in about ${nextDoiqTime} minutes`}
          </div>
        </div>
      ),
      intents: [
        <Button.Reset>Home</Button.Reset>,
        <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
      ],
    })

  } catch (error: any) {
    // console.log('error : ', error)
    if (error.response && error.response.status === 404) {
      const userData = {
        username: fakeData.username,//c.var.interactor?.username
        displayName: fakeData.displayName,//c.var.interactor?.displayName
        fid: fakeData.fid, // c.var.interactor?.fid?.toString()
        doiqValue: c.buttonValue,
      }
      const user = (await UserService.CreateUser(userData)).data
      const lastUpdated = moment(user.updatedAt)
      const tenMinutesAgo = moment().subtract(10, 'minutes')
      let nextDoiqTime = "NOW"

      if (lastUpdated.isAfter(tenMinutesAgo)) {
        const minutesLeft = (10 - moment().diff(lastUpdated, 'minutes')).toString()
        nextDoiqTime = `${minutesLeft} minutes`
      }
      // console.log("lastUpdated: ", lastUpdated)
      // console.log("next doiq time: ", nextDoiqTime)
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
              {`Good choice ${fakeData.username}, Your answer has been received by the great doiq himself.`}
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
              {`You can doiq again in about ${nextDoiqTime}`}
            </div>
          </div>
        ),
        intents: [
          <Button.Reset>Home</Button.Reset>,
          <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
        ],
      })

      // console.log('user created: ', user)
    } else {
      console.log('Error:', error.message);
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
              An error occurred: {error.message}
            </div>
          </div>
        ),
      });
    }
  }

})


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
