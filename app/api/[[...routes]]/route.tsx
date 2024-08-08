/** @jsxImportSource frog/jsx */

import { Button, Frog, FrogConstructorParameters, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as neynarHub } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/middlewares'
import moment from 'moment'
import { UserService } from '@/lib/services/user.service'
import { IUser } from '@/interfaces/IUser'
import { UserDocument } from '@/models/user.schema'


const apiKey = process.env.NEYNAR_API_KEY as string;
const HOSTNAME = "https://doiq-farcaster-frame.vercel.app"
// const HOSTNAME = "http://localhost:3000"

const answers = ["doiq", "doiq?", "doiq!"]
const getRandomAnswer = () => {
  return answers[Math.floor(Math.random() * answers.length)];
};
const fakeData = {
  fid: "12388",
  username: "dotmantosh",
  displayName: "dotmantosh",

}

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynarHub({ apiKey: apiKey })
  // hub: neynar({ apiKey })
} as FrogConstructorParameters)
  .use(neynar(
    {
      apiKey: apiKey,
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
          {`click to doiq Apikey ${apiKey}`}
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
    const response = await UserService.fetchUserByFidFromFrontend(c.var.interactor?.fid.toString() as string);
    user = response.user;
    console.log('usr from /doiq fetchUserbyFid', user)
    if (user) {
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
        console.log('no user found from /doiq finduserbyfid')
        const minutesLeft = (10 - moment().diff(lastUpdated)).toString();
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
                {`Hi ${c.var.interactor?.username as string}, You've doiqed too hard.`}
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
    } else {
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
    }



  } catch (error: any) {

    console.log('Error from /doiq :', error.message);
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
            {`An error occurred: ${error.message}`}
          </div>
        </div>
      ),
    });

  }


});


app.frame('/result', async (c) => {
  const { buttonValue, status } = c
  const doiqValue = buttonValue
  const doiqAnswer = getRandomAnswer()
  const userData = {
    doiqValue,
    doiqAnswer
  }
  try {
    let response = await UserService.fetchUserByFidFromFrontend(c.var.interactor?.fid.toString() as string)
    let user = response.user
    console.log('user found: /result ', user)
    if (user) {

      const response = await UserService.UpdateUserFromFrontend(user.fid, userData)
      let nextDoiqTime = "10 Minutes"

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
              {
                doiqValue === doiqAnswer ?
                  `Thanks for playing. You got it correct, You chose ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
                  :
                  `Thanks for playing. You got it wrong this time. You chose ${doiqValue}, but the answer is ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
              }
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
    } else {
      console.log('usr not found /results')
      const userData = {
        username: c.var.interactor?.username,//fakeData.username
        displayName: c.var.interactor?.displayName,//fakeData.displayName
        fid: c.var.interactor?.fid?.toString(), // fakeData.fid,
        doiqValue,
        doiqAnswer
      }
      const response = await UserService.CreateUserFromFrontend(userData)

      let nextDoiqTime = "10 Minutes"

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
                textAlign: 'center'
              }}
            >
              {
                doiqValue === doiqAnswer ?
                  `Thanks for playing. You got it correct, You chose ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
                  :
                  `Thanks for playing. You got it wrong this time. You chose ${doiqValue}, but the answer is ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
              }

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
    }

  } catch (error: any) {

    console.log('Error: /result', error.message);
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
            {`An error occurred: ${error.message}`}
          </div>
        </div>
      ),
    });
  }


})

// app.frame('/', (c) => {
//   const { buttonValue, status, frameData, verified } = c
//   const fruit = buttonValue
//   console.log("rendering frame")
//   return c.res({
//     action: '/doiq',
//     image: (
//       <div
//         style={{
//           alignItems: 'center',
//           background: 'white',
//           backgroundSize: '100% 100%',
//           display: 'flex',
//           flexDirection: 'column',
//           flexWrap: 'nowrap',
//           height: '100%',
//           justifyContent: 'center',
//           textAlign: 'center',
//           width: '100%',
//         }}
//       >
//         <div
//           style={{
//             color: 'black',
//             fontSize: 180,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1.0,
//             padding: '0 120px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           doiq?
//         </div>
//         <div
//           style={{
//             color: 'black',
//             fontSize: 60,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1.4,
//             padding: '0 240px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           click to doiq
//         </div>
//       </div>
//     ),
//     intents: [
//       <Button>Start</Button>,
//       <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
//       <Button.Link href='https://docs.doiq.xyz/'>Learn</Button.Link>,
//     ],
//   })
// })

// app.frame('/doiq', async (c) => {
//   const { buttonValue, status } = c;
//   const fruit = buttonValue;

//   let user = null;
//   let isUpdatedMoreThan10Mins = false;
//   let lastUpdated = null;
//   const tenMinutesAgo = moment().subtract(10, 'minutes');

//   try {
//     const response = await UserService.FetchUserByFid(fakeData.fid);
//     user = response.data;
//     lastUpdated = moment(user.updatedAt);
//     isUpdatedMoreThan10Mins = lastUpdated.isBefore(tenMinutesAgo);
//     // console.log('User found', user);
//     // console.log('Last Updated:', lastUpdated);
//     // console.log('Is Updated More Than 10 Mins:', isUpdatedMoreThan10Mins);
//     if (isUpdatedMoreThan10Mins) {
//       return c.res({
//         action: `/result`,
//         image: (
//           <div
//             style={{
//               alignItems: 'center',
//               background: 'white',
//               backgroundSize: '100% 100%',
//               display: 'flex',
//               flexDirection: 'column',
//               flexWrap: 'nowrap',
//               height: '100%',
//               justifyContent: 'center',
//               textAlign: 'center',
//               width: '100%',
//             }}
//           >
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 90,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1.4,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//               }}
//             >
//               I like to _________
//             </div>
//           </div>
//         ),
//         intents: [
//           <Button value="doiq">doiq</Button>,
//           <Button value="doiq?">doiq?</Button>,
//           <Button value="doiq!">doiq!</Button>,
//         ],
//       });
//     } else {
//       const minutesLeft = (10 - moment().diff(lastUpdated, 'minutes')).toString();
//       // console.log(minutesLeft)
//       return c.res({
//         action: '/',
//         image: (
//           <div
//             style={{
//               alignItems: 'center',
//               background: 'white',
//               backgroundSize: '100% 100%',
//               display: 'flex',
//               flexDirection: 'column',
//               flexWrap: 'nowrap',
//               height: '100%',
//               justifyContent: 'center',
//               textAlign: 'center',
//               width: '100%',
//             }}
//           >
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 62,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//               }}
//             >
//               {`Hi ${fakeData.username}, You've doiqed too hard.`}
//             </div>
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 40,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//               }}
//             >
//               {`You can doiq again in about ${minutesLeft} minutes`}
//             </div>
//           </div>
//         ),
//         intents: [
//           <Button>Home</Button>,
//           <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
//         ],
//       });
//     }

//   } catch (error: any) {
//     if (error.response && error.response.status === 404) {
//       return c.res({
//         action: `/result`,
//         image: (
//           <div
//             style={{
//               alignItems: 'center',
//               background: 'white',
//               backgroundSize: '100% 100%',
//               display: 'flex',
//               flexDirection: 'column',
//               flexWrap: 'nowrap',
//               height: '100%',
//               justifyContent: 'center',
//               textAlign: 'center',
//               width: '100%',
//             }}
//           >
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 90,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1.4,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//               }}
//             >
//               I like to _________
//             </div>
//           </div>
//         ),
//         intents: [
//           <Button value="doiq">doiq</Button>,
//           <Button value="doiq?">doiq?</Button>,
//           <Button value="doiq!">doiq!</Button>,
//         ],
//       });
//     } else {
//       // console.log('Error:', error.message);
//       return c.res({
//         image: (
//           <div
//             style={{
//               alignItems: 'center',
//               background: 'white',
//               backgroundSize: '100% 100%',
//               display: 'flex',
//               flexDirection: 'column',
//               flexWrap: 'nowrap',
//               height: '100%',
//               justifyContent: 'center',
//               textAlign: 'center',
//               width: '100%',
//             }}
//           >
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 62,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//               }}
//             >
//               An error occurred: {error.message}
//             </div>
//           </div>
//         ),
//       });
//     }
//   }


// });


// app.frame('/result', async (c) => {
//   const { buttonValue, status } = c
//   const doiqValue = buttonValue
//   const doiqAnswer = getRandomAnswer()

//   try {
//     let user = (await UserService.FetchUserByFid(fakeData.fid)).data
//     console.log('user found: ', user)
//     const userData = {
//       doiqValue,
//       doiqAnswer
//     }
//     user = (await UserService.UpdateUser(user.fid, userData)).data
//     console.log("user updated")
//     const lastUpdated = moment(user.updatedAt)
//     const tenMinutesAgo = moment().subtract(10, 'minutes')
//     let nextDoiqTime = "NOW"

//     if (lastUpdated.isAfter(tenMinutesAgo)) {
//       const minutesLeft = (10 - moment().diff(lastUpdated, 'minutes')).toString()
//       nextDoiqTime = `${minutesLeft} minutes`
//     }
//     // console.log("lastUpdated: ", lastUpdated)
//     // console.log("next doiq time: ", nextDoiqTime)
//     return c.res({
//       image: (
//         <div
//           style={{
//             alignItems: 'center',
//             background: 'white',
//             backgroundSize: '100% 100%',
//             display: 'flex',
//             flexDirection: 'column',
//             flexWrap: 'nowrap',
//             height: '100%',
//             justifyContent: 'center',
//             textAlign: 'center',
//             width: '100%',
//           }}
//         >
//           <div
//             style={{
//               color: 'black',
//               fontSize: 62,
//               fontStyle: 'normal',
//               letterSpacing: '-0.025em',
//               lineHeight: 1,
//               marginTop: 30,
//               padding: '0 120px',
//               whiteSpace: 'pre-wrap',
//             }}
//           >
//             {
//               doiqValue === doiqAnswer ?
//                 <><p>Thanks for playing.</p>
//                   <p>Good choice {fakeData.username}</p>
//                   <p>You got it Correct! You chose {doiqValue}, and the current answer is {doiqAnswer}</p>
//                   <p>Your answer has been received by the great doiq himself.</p>
//                 </>


//                 :
//                 <><p>Thanks for playing {fakeData.username}.</p>

//                   <p>You got it Wrong this time. You chose {doiqValue}, but the current correct answer is {doiqAnswer}</p>
//                   <p>Your answer has been received by the great doiq himself.</p>
//                 </>

//             }
//           </div>
//           <div
//             style={{
//               color: 'black',
//               fontSize: 40,
//               fontStyle: 'normal',
//               letterSpacing: '-0.025em',
//               lineHeight: 1,
//               marginTop: 30,
//               padding: '0 120px',
//               whiteSpace: 'pre-wrap',
//             }}
//           >
//             {`You can doiq again in about ${nextDoiqTime} minutes`}
//           </div>
//         </div>
//       ),
//       intents: [
//         <Button.Reset>Home</Button.Reset>,
//         <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
//       ],
//     })

//   } catch (error: any) {
//     // console.log('error : ', error)
//     if (error.response && error.response.status === 404) {
//       const userData = {
//         username: fakeData.username,//c.var.interactor?.username
//         displayName: fakeData.displayName,//c.var.interactor?.displayName
//         fid: fakeData.fid, // c.var.interactor?.fid?.toString()
//         doiqValue,
//         doiqAnswer
//       }
//       const user = (await UserService.CreateUser(userData)).data
//       const lastUpdated = moment(user.updatedAt)
//       const tenMinutesAgo = moment().subtract(10, 'minutes')
//       let nextDoiqTime = "NOW"

//       if (lastUpdated.isAfter(tenMinutesAgo)) {
//         const minutesLeft = (10 - moment().diff(lastUpdated, 'minutes')).toString()
//         nextDoiqTime = `${minutesLeft} minutes`
//       }
//       // console.log("lastUpdated: ", lastUpdated)
//       // console.log("next doiq time: ", nextDoiqTime)
//       return c.res({
//         image: (
//           <div
//             style={{
//               alignItems: 'center',
//               background: 'white',
//               backgroundSize: '100% 100%',
//               display: 'flex',
//               flexDirection: 'column',
//               flexWrap: 'nowrap',
//               height: '100%',
//               justifyContent: 'center',
//               textAlign: 'center',
//               width: '100%',
//             }}
//           >
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 62,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//                 textAlign: 'center'
//               }}
//             >
//               {
//                 doiqValue === doiqAnswer ?
//                   <><p>Thanks for playing.</p>
//                     <p>Good choice {fakeData.username}</p>
//                     <p>You got it Correct! You chose {doiqValue}, and the current answer is {doiqAnswer}</p>
//                     <p>Your answer has been received by the great doiq himself.</p>
//                   </>


//                   :
//                   <><p>Thanks for playing {fakeData.username}.</p>

//                     <p>You got it Wrong this time. You chose {doiqValue}, but the current correct answer is {doiqAnswer}</p>
//                     <p>Your answer has been received by the great doiq himself.</p>
//                   </>

//               }

//             </div>
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 40,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//               }}
//             >
//               {`You can doiq again in about ${nextDoiqTime}`}
//             </div>
//           </div>
//         ),
//         intents: [
//           <Button.Reset>Home</Button.Reset>,
//           <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
//         ],
//       })

//       // console.log('user created: ', user)
//     } else {
//       console.log('Error:', error.message);
//       return c.res({
//         image: (
//           <div
//             style={{
//               alignItems: 'center',
//               background: 'white',
//               backgroundSize: '100% 100%',
//               display: 'flex',
//               flexDirection: 'column',
//               flexWrap: 'nowrap',
//               height: '100%',
//               justifyContent: 'center',
//               textAlign: 'center',
//               width: '100%',
//             }}
//           >
//             <div
//               style={{
//                 color: 'black',
//                 fontSize: 62,
//                 fontStyle: 'normal',
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1,
//                 marginTop: 30,
//                 padding: '0 120px',
//                 whiteSpace: 'pre-wrap',
//               }}
//             >
//               An error occurred: {error.message}
//             </div>
//           </div>
//         ),
//       });
//     }
//   }

// })


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
