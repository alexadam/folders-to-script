

const fs = require("fs")
const path = require("path")

const rootPath = process.argv[2]

const textExt = ['txt', 'md', 'html', 'json', 'js', 'jsx', 'ts', 'tsx'];
const binaryExt = ['jpg', 'png', 'gif', 'pdf', 'mp3', 'mp4'];

const getFileExt = (filePath) => filePath.split('.').pop()

const listFiles = (dirPath, result) => {
  files = fs.readdirSync(dirPath)

  result = result || ['#!/bin/sh']

  for (const file of files) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      result.push(`mkdir -p ${path.join(dirPath, "/", file).replace(rootPath, '.')}`)
      result = listFiles(dirPath + "/" + file, result)
    } else {
      const filePath = path.join(dirPath, "/", file);
      const fileExt = getFileExt(filePath);
      const fileContent = fs.readFileSync(filePath);

      if (textExt.includes(fileExt)) {
        result.push(`
cat > ${path.join(dirPath, "/", file).replace(rootPath, '.')} << "EOF"
${fileContent}
EOF
`)
      } else if (binaryExt.includes(fileExt)) {
        const bindata = fileContent.toString('binary');
        const hexdata = new Buffer(bindata, 'ascii').toString('hex');
        result.push(`echo '${hexdata}' | xxd -r -p > ${path.join(dirPath, "/", file).replace(rootPath, '.')}`)
      }
    }
  }

  return result
}


const allFiles = listFiles(rootPath)

fs.writeFileSync('./result.sh', allFiles.join('\n'))

