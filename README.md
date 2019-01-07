# Pairing Visualizer

This application allows teams to view how frequently pairs work together based on the number of commits they share across a set of Github repos. In order for this to work properly, the commits must use the co-authored-by format as below:

```
git commit -m "This is an example of how to format your commits

Co-authored-by: driver-ldap <driver@homedepot.com>
Co-authored-by: navigator-ldap <navigator@homedepot.com>"
```

### Configuration

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
