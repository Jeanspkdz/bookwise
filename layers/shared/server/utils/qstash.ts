import { loadEnvFile } from 'node:process'

import { Client } from '@upstash/qstash'

loadEnvFile()

const client = new Client({
  token: process.env.QSTASH_TOKEN,
})

const URL = 'https://firstqstashmessage.requestcatcher.com'
// await client.publish({
//   url: URL,
//   body: 'Plain text',
//   headers: {
//     'Content-Type': 'text/plain',
//   },
// })

// await client.publishJSON({
//   url: URL,
//   body: {
//     hello: 'worlds',
//   },
// })

const schedList = await client.schedules.list()
console.log(schedList);

client.schedules.delete('scd_6c5r76RbwL8R2CcyZ7woWJRD53ta').then(() => {
  console.log('SCHEDLUE DELETED');
})


await client.schedules.create({
  destination: URL,
  cron: 'CRON_TZ=America/Lima 30 16 * * 6,0',
  body: JSON.stringify({
    task: 'remove-expired-sessions',
  }),
  headers: {
    'Content-Type': 'application/json',
  },
})


await client.publishJSON({
  url: "https://tuapp.com/api/jobs/process-order",
  body: { orderId: "123" },
  retries: 3, // reintentos del job principal

  callback: "https://tuapp.com/api/jobs/callback",
  failureCallback: "https://tuapp.com/api/jobs/dlq",

  headers: {
    "Upstash-Callback-Retries": "5",
    "Upstash-Callback-Timeout": "15s",
    "Upstash-Callback-Delay": "0s",
    "Upstash-Callback-Method": "POST",

    "Upstash-Failure-Callback-Retries": "2",
    "Upstash-Failure-Callback-Timeout": "15s",
  },
});

