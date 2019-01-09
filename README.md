# Pairing Visualizer

This application allows teams to view how frequently pairs work together based on the number of commits they share across a set of Github repos. In order for this to work properly, the commits must use the co-authored-by format as below:

```
git commit -m "This is an example of how to format your commits

Co-authored-by: driver-ldap <driver@homedepot.com>
Co-authored-by: navigator-ldap <navigator@homedepot.com>"
```

## Configuration

Create a `config.json` file in the root project directory that is formatted as below:

```
{
  "baseUrl": "https://github.homedepot.com/api/v3",
  "token": "GITHUB TOKEN",
  "repos": [
    "Org/Repo",
    "User/Repo2",
    ...,
  ]
}
```

## Starting the Application

```
npm i
npm start
```

## Git Mob

This is a tool that helps automate appending the `Co-authored-by` section at the end of commit messages. The repo for reference is `https://github.com/findmypast-oss/git-mob`.

### Setup

1. Download git-mob globally using npm.

```
npm i -g git-mob
```

2. Create `~/.git-coauthors` which contains the information of you and the people you work with like below:

```
{
  "coauthors": {
    "mu": {
      "name": "mu-ldap",
      "email": "mu-email@homedepot.com"
    },
    "kl": {
      "name": "kl-ldap",
      "email": "kl-email@homedepot.com"
    },
    "rp": {
      "name": "rp-ldap",
      "email": "rp-email@homedepot.com"
    }
  }
}
```

3. Create a `~/githooks` directory and create `~/githooks/prepare-commit-msg` file with the following content:

```
#!/usr/bin/env node
let exec = require('child_process').exec,
    fs = require('fs');

const commitMessage = process.argv[2];
// expect .git/COMMIT_EDITMSG
if(/COMMIT_EDITMSG/g.test(commitMessage)){
    let contents = "";
    exec("git mob-print",
      function (err, stdout) {
        if(err) {
            process.exit(0);
        }

        // opens .git/COMMIT_EDITMSG
        contents = fs.readFileSync(commitMessage);

        const commentPos = contents.indexOf('# ');
        const gitMessage = contents.slice(0, commentPos);
        const gitComments = contents.slice(commentPos)

        fs.writeFileSync(commitMessage, gitMessage + stdout + gitComments);
        process.exit(0);
    });
}
```

4. Make that file executable and integrate it with git. This will make it to where that file is run after each commit. However, nothing will be appended to the commit if the next step is not performed in each repository that you wish to integrate with git-mob.

```
chmod +x ~/githooks/prepare-commit-msg

git config --global core.hooksPath ~/githooks
```

5. Navigate to the repository you want to integrate with git-mob and install the template that will be used to hold the Co-authored-by section within it.

```
git mob --installTemplate
```

### Using Git Mob

1. Activate a pair with the command: `git mob mu kl`

2. Make a new commit and it will have the `Co-authored-by` section appended.

### Deactivating Git Mob

```
git solo
```

### Removing Git Mob

1. Revert back to the default setup.

```
git mob --uninstallTemplate
```

2. Remove the `~/githooks` directory and its content.

```
rm -rf ~/githooks
```

3. Unset the global hooks path.

```
git config --global --unset core.hooksPath
```