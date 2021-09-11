const formidable = require('formidable')
const fs = require('fs')
const csv = require('csv-parser')
const XLSX = require('xlsx')

const upload = async (req, res) => {
  console.log('uploaddd');
  const form = formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (files.file) {
      let fileName = files.file.name
      let fileType = fileName.split('.')[fileName.split('.').length - 1]
      switch (fileType) {
        case "csv":
          let results = []
          fs.createReadStream(files.file.path)
            .pipe(csv({
              mapHeaders: ({ header, index }) => {
                if (!header) {
                  return `filed${index + 1}`
                }
                return header
              }
            }))
            .on('data', (data) => {
              results.push(data)
            })
            .on('end', () => {
              return res.status(200).json(results)
            });
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
          let result = []
          fs.createReadStream(files.file.path)
            .pipe(csv({
              separator: '\t',
              mapHeaders: ({ header, index }) => {
                if (!header) {
                  return `filed${index + 1}`
                }
                return header
              }
            }))
            .on('data', (data) => result.push(data))
            .on('end', () => {
              return res.status(200).json(result)
            });
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