const octokitRest = require('@octokit/rest');
const config = require('../../config');

const octokit = octokitRest({ baseUrl: config.baseUrl });

octokit.authenticate({
  type: 'token',
  token: config.token,
});

exports.fetchCommitData = async (req, res) => {
  console.log(req.params); // days

  const pairingJson = {};

  for (const repo of config.repos) {
    try {
      /* eslint-disable no-await-in-loop */
      const githubResponse = await octokit.repos.listCommits({
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
      });

      const { data } = githubResponse;

      for (const entry of data) {
        const matches = entry.commit.message.match(/[\n\r][ \t]*Co-authored-by:[ \t]*([^\n\r]*)/g);

        if (matches !== null && matches.length > 1) {
          const names = [];

          for (const match of matches) {
            names.push(match.split(' ')[1]);
          }

          names.sort();
          const key = names.join(',');

          if (pairingJson[key] !== undefined) pairingJson[key] += 1;
          else pairingJson[key] = 1;
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }

  const pairingData = [];
  for (const key in pairingJson) {
    if (Object.prototype.hasOwnProperty.call(pairingJson, key)) {
      const entry = key.split(',');
      entry.push(pairingJson[key]);
      pairingData.push(entry);
    }
  }

  res.status(200).send(pairingData);
};
