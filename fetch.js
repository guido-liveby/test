const SimplyRets = require('@liveby/simply-rets')
const debug = require('debug')('simply-rets-mls-cache')

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

async function putNDJSON (ndjson) {
  const s3 = new S3Client({ region: 'us-east-2' })
  const d = new Date()
  const objectName = d.toISOString().split('T')[0].split('-').slice(0, 2).join('/') + '/' + d.toISOString()

  const uploadParams = {
    Bucket: 'liveby--guido-data',
    Key: objectName,
    Body: ndjson
  }

  const req = new PutObjectCommand(uploadParams)
  try {
    const data = await s3.send(req)
    console.log('Success', data.Buckets)
  } catch (err) {
    console.log('Error', err)
  }
}

async function getData () {
  const apps = [{ user: 'admin_3542b037', password: '85l12u5322623p17' }]
  // const apps = await db.db('LiveBy').collection('simply-rets').find().toArray()

  const app = apps[0]
  try {
    debug('running for: ', app.user)
    const simplyRets = await new SimplyRets(app)
    const { vendors } = await simplyRets.options()

    const sr = await simplyRets.properties({ vendor: vendors[0] })

    let ndjson = ''
    sr.forEach(element => {
      ndjson = ndjson.concat('\n', JSON.stringify(element))
    })
    return ndjson
  } catch (e) {
    console.error(e)
    throw e
  }
}

getData()
  .then(putNDJSON)
