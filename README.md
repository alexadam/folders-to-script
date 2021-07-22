# folders-to-script

This is a simple NodeJS app that takes a source folder as input and generates a Bash script. The Bash script has all the files' content and the folders' structure in the source folder and it can recreate them when executed.

More about it here: 

How to us it:

```bash
node index.js test

mkdir some-folder
cd some-folder

sh result.sh
```