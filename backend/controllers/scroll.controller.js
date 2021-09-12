const fs = require('fs');
const readline = require('readline');

const scroll = async (req, res) => {
  let { fileCached, offset, range } = req.query
  console.log(req.query)
  let file = `./temp/${fileCached}`
  if (!fs.existsSync(file)) {
    return res.status(400).json({
      message: `${fileCached} not exists`
    })
  }
  const rl = readline.createInterface({
    input: fs.createReadStream(file)
  })
  let cnt = 0, data = []
  offset = Number(offset)
  range = Number(range)
  rl.on('line', (line) => {
    if (cnt >= (offset + range)) {
      rl.close()
    } else if (cnt >= offset) {
      data.push(JSON.parse(line))
      cnt++;
    } else {
      cnt++;
    }
  })
  rl.on('close', () => {
    console.log(data.length)
    return res.status(200).json({
      data
    })
  })
}

module.exports = { scroll }