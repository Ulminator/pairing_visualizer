const octokitRest = require('@octokit/rest');
const config = require('../../config');

const octokit = octokitRest({ baseUrl: config.baseUrl });

octokit.authenticate({
  type: 'token',
  token: config.token,
});

exports.fetchCommitData = async (req, res) => {
  const { days } = req.params;

  const since = new Date();
  since.setDate(since.getDate() - days);
  const perPage = 100;

  let errorOccurred = false;
  const pairingJson = {};
  for (const repoPath of config.repos) {
    try {
      let paginate = true;
      let page = 1;

      while (paginate) {
        /* eslint-disable no-await-in-loop */
        const repoSplit = repoPath.split('/');
        const owner = repoSplit[0];
        const repo = repoSplit[1];

        const githubResponse = await octokit.repos.listCommits({
          owner,
          repo,
          since,
          per_page: perPage,
          page,
        });

        const { data } = githubResponse;

        if (data.length === perPage) page += 1;
        else paginate = false;

        for (const entry of data) {
          const matches = entry.commit.message.match(/[\n\r][ \t]*Co-authored-by:[ \t]*([^\n\r]*)/g);

          if (matches !== null && matches.length > 1) {
            const names = [];

            for (const match of matches) {
              const name = match.split(' ')[1].toLowerCase();
              names.push(name);
            }

            names.sort();
            const key = names.join(',');

            if (pairingJson[key] !== undefined) pairingJson[key] += 1;
            else pairingJson[key] = 1;
          }
        }
      }
    } catch (err) {
      console.log(err);
      errorOccurred = true;
    }
  }

  if (!errorOccurred) {
    const pairingData = [];
    for (const key in pairingJson) {
      if (Object.prototype.hasOwnProperty.call(pairingJson, key)) {
        const entry = key.split(',');
        entry.push(pairingJson[key]);
        pairingData.push(entry);
      }
    }

    res.status(200).send(pairingData);
  } else {
    res.status(500).send();
  }
};
