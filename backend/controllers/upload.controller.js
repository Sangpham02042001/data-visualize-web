const formidable = require('formidable')
const fs = require('fs')
const csv = require('csv-parser')
const XLSX = require('xlsx')
const readline = require('readline');
const { v4 } = require('uuid')

const convertCsvTsv = (filePath, fileName, fileCached, callback) => {
  let fileType = fileName.split('.')[fileName.split('.').length - 1]
  let separator = fileType === 'csv' ? ',' : '\t'
  let writeStream = fs.createWriteStream(`./temp/${fileCached}`)
  let fileLength = 0
  fs.createReadStream(filePath)
    .pipe(csv({
      separator,
      mapHeaders: ({ header, index }) => {
        if (!header) {
          return `filed${index + 1}`
        }
        return header
      },
    }))
    .on('data', (data) => {
      fileLength++
      writeStream.write(JSON.stringify(data) + '\n')
    })
    .on('end', () => {
      callback(fileLength)
    })
}

const upload = async (req, res) => {
  const form = formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (files.file) {
      let fileName = files.file.name
      let fileType = fileName.split('.')[fileName.split('.').length - 1]
      let fileCached = `${fileName}-${v4()}.txt`
      switch (fileType) {
        case "csv":
          convertCsvTsv(files.file.path, fileName, fileCached, (fileLength) => {
            let data = [], count = 0
            const rl = readline.createInterface({
              input: fs.createReadStream(`./temp/${fileCached}`)
            })
            let offset = 0, fragFlag = false
            rl.on('line', (line) => {
              data.push(JSON.parse(line))
              count++
              if (count >= fileLength) {
                offset = 0
                fragFlag = false
                rl.close()
              }
              if (count >= 100) {
                offset = 100
                fragFlag = true
                rl.close()
              }
            })
            rl.on('close', () => {
              return res.status(200).json({
                fileCached,
                fileLength,
                data,
                fragFlag,
                offset
              })
            })
          })
          break;
        case "xlsx":
          const workbookUpload = XLSX.readFile(files.file.path)
          const sheetNameList = workbookUpload.SheetNames
          let data = [], workSheet, headers, subData
          sheetNameList.forEach(y => {
            subData = []
            headers = {}
            workSheet = workbookUpload.Sheets[y]
            let col, row, value
            for (const cell in workSheet) {
              if (cell[0] === '!') continue
              col = cell.substring(0, 1)
              row = parseInt(cell.substring(1))
              value = workSheet[cell].v
              if (row == 1) {
                headers[col] = value
                continue;
              }

              if (!subData[row]) subData[row] = {}
              if (!headers[col]) {
                headers[col] = `field${Object.keys(headers).length + 1}`
              }
              subData[row][headers[col]] = value
            }
            subData.shift();
            subData.shift();
            data.push({
              sheetName: y,
              data: subData
            })
          })
          return res.status(200).json(data)
        case "tsv":
          convertCsvTsv(files.file.path, fileName, fileCached, (fileLength) => {
            let data = [], count = 0
            const rl = readline.createInterface({
              input: fs.createReadStream(`./temp/${fileCached}`)
            })
            let offset = 0, fragFlag = false
            rl.on('line', (line) => {
              data.push(JSON.parse(line))
              count++
              if (count >= fileLength) {
                offset = 0
                fragFlag = false
                rl.close()
              }
              if (count >= 100) {
                offset = 100
                fragFlag = true
                rl.close()
              }
            })
            rl.on('close', () => {
              return res.status(200).json({
                fileCached,
                fileLength,
                data,
                fragFlag,
                offset
              })
            })
          })
          break;
        default:
          console.log('error file');
          return res.status(400).json({
            error: "You must upload csv/tsv/xlsx"
          })
      }
    }
  })
}

module.exports = { upload }