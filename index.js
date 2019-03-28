const express = require('express')
const bodyParser = require('body-parser');
const storage = require('node-persist');
const morgan = require('morgan');

// configure middleware
const app = express()
app.use(bodyParser.json());
morgan.token('body', (req, res) => { return req.body ? JSON.stringify(req.body) : ''; });
app.use(morgan('HTTP/:http-version :method :url :body :status'));

// storage
await storage.init();
const votesStoreKey = 'votes';

app.get('/', async (req, res) => {
  const votes = await storage.getItem(votesStoreKey);
  res.send(votes);
});

app.post('/', async (req, res) => {
  try {
    const votes = await storage.getItem(votesStoreKey);

    const voteNames = Object.keys(req.body);
    for (var name in voteNames) {
      votes[name] = votes[name] ? votes[name] + 1 : 1;
    }
  
    await storage.setItem(votesStoreKey, votes);
    res.send(votes);
  } catch(e) {
    res.status(500).send(e.message);
  }
})

app.listen(8080, () => console.log('Nodejs Voting service listening on port 8080!'))