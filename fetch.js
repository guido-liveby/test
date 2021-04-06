const SimplyRets = require('@liveby/simply-rets')
const debug = require('debug')('simply-rets-mls-cache')

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

async function putNDJSON (ndjson, vendor) {
  const ndjsonOutput = ndjson.replace(/^\s*\n/gm, '')
  if (ndjsonOutput === '') return
  const s3 = new S3Client({ region: 'us-east-2' })
  const d = new Date()
  const objectName = vendor + '/' + d.toISOString().split('T')[0].split('-').slice(0, 2).join('/') + '/' + d.toISOString()

  const uploadParams = {
    Bucket: 'liveby--guido-data',
    Key: objectName,
    Body: ndjsonOutput
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

    Promise.all(
      vendors.map(async vendor => {
        const sr = await simplyRets.properties({ vendor: vendor })
        let ndjson = ''
        sr.forEach(element => {
          ndjson = ndjson.concat('\n', JSON.stringify(element))
        })
        return putNDJSON(ndjson, vendor)
      })
    )
  } catch (e) {
    console.error(e)
    throw e
  }
}

getData()
