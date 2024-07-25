/** @jsxImportSource frog/jsx */

import { Button, Frog, FrogConstructorParameters, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const apiKey = process.env.NEYNAR_API_KEY as string;

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  // hub: neynar({ apiKey })
} as FrogConstructorParameters)

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
      <Button.Link href='https://docs.doiq.xyz/'>Leaderboard</Button.Link>,
      <Button.Link href='https://docs.doiq.xyz/'>Learn</Button.Link>,
    ],
  })
})

app.frame('/doiq', (c) => {
  const { buttonValue, status } = c
  const fruit = buttonValue
  // console.log("c: ", c)
  return c.res({
    action: '/result',
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
      <Button value="A">doiq</Button>,
      <Button value="B">doiq?</Button>,
      <Button value="C">doiq!</Button>,
    ],
  })
})

app.frame('/result', (c) => {
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
      <Button.Link href='https://docs.doiq.xyz/'>Leaderboard</Button.Link>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
