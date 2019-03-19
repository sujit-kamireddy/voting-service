const express = require('express')
const bodyParser = require('body-parser');
const storage = require('node-persist');

const app = express()
app.use(bodyParser.json())

await storage.init();
app.get('/', async (req, res) => {
  res.send(await storage.getItem('votes'));
})

app.post('/', async (req, res) => {
  const votes = await storage.getItem('votes');

  for (var key in Object.keys(req.body)) {
    votes[key] = votes[key] ? votes[key] + 1 : 1;
  }

  await storage.setItem('votes', votes);
  res.send('vote received');
})

app.listen(8080, () => console.log('Nodejs Voting service listening on port 8080!'))