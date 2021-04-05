const fetch = require('node-fetch')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

;(async () => {
  const res = await fetch('https://api-v3.mbta.com/vehicles?filter%5Broute%5D=66', { headers: { accept: 'application/vnd.api+json' } }).then((r) => r.json())
  const data = res.data.map(d => d.attributes)
  const s3 = new S3Client({ region: 'us-east-2' })
  const d = new Date()
  const objectName =
    d.toISOString().split('T')[0].split('-').slice(0, 2).join('/') +
    '/' +
    d.toISOString()

  const uploadParams = {
    Bucket: 'liveby--guido-data',
    Key: 'objectName',
    Body: data
  }

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams))
    console.log('Success', data.Buckets)
  } catch (err) {
    console.log('Error', err)
  }
})()

async function updateCache () {
  const db = await connect()
  const apps = [{ user: 'admin_3542b037', password: '85l12u5322623p17' }]
  // const apps = await db.db('LiveBy').collection('simply-rets').find().toArray()
  for (const app of apps) {
    try {
      debug('running for: ', app.user)
      await updateCacheForApp(new SimplyRets(app))
      await sleep(1000)
    } catch (e) {
      logger.error(e.stack)
    }
  }
  debug('updated all properties...')
  await updateCache()
}
