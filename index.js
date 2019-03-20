const express = require('express')
const bodyParser = require('body-parser');
const storage = require('node-persist');

const app = express()
app.use(bodyParser.json())

await storage.init();
const votesStoreKey = 'votes';

app.get('/', async (req, res) => {
  const votes = await storage.getItem(votesStoreKey);
  res.send(votes);
});

app.post('/', async (req, res) => {
  try {
    const votes = await storage.getItem(votesStoreKey);

    for (var key in Object.keys(req.body)) {
      votes[key] = votes[key] ? votes[key] + 1 : 1;
    }
  
    await storage.setItem(votesStoreKey, votes);
    res.send(votes);
  } catch(e) {
    res.status(500).send(e.message);
  }
})

app.listen(8080, () => console.log('Nodejs Voting service listening on port 8080!'))