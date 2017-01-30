const IMG_HEAD = ' <sub><sub>![](https://img.shields.io/github/stars/'
const IMG_TAIL = '.svg?label=%E2%98%85)</sub></sub> '
var fs = require('fs')
var md = fs.readFileSync('./README.md', 'utf8')
console.log('md', md.length)
var gh = md.split('?style=social&label=Star&maxAge=2592000').join('?label=%E2%98%85') // standardize star labels
md = gh.split('] (https://github.com/').join('](https://github.com/') // typos
md = md.replace('github.com/lian-yue/vue-upload-component/)', 'github.com/lian-yue/vue-upload-component)')
gh = md.split('](https://github.com/')
console.log('gh', gh.length)
for (var i = 0; i < gh.length -1; i++) {
  var line = gh[i+1]
  var p = line.indexOf(')')
  var skiplist = [ // special cases to skip
    'img.shields.io/' // previous shield
    , 'danmademe/express-vue'
    , 'Vuedo/vuedo'
    , 'znck/vue-plugin-simple'
    , 'sindresorhus/awesome'
  ]
  var skip = -1
  for (var j=0; j<skiplist.length; j++) {
    if (skip < 0) skip = line.indexOf(skiplist[j])
  }

  var ghurl = line.substr(0,p).replace('.git', '').replace(' "Animate.css"','') // fix Quill & animate.css
  var tail = line.substr(p)
  if (tail[0] == ')') tail = tail.substr(1)
  if (skip < 0 && ghurl.split('/').length !=2 ) skip = 1 // only add shields to github repo's
  if (skip < 0) gh[i+1] = line.substr(0, p+1) + IMG_HEAD + ghurl + IMG_TAIL + tail
}
md = gh.join('](https://github.com/')

function oldStars(star, md) {
  var lines = md.split(star)
  for (var i = 0; i < lines.length -1; i++) {
    var line = lines[i+1]
    var p = line.indexOf(']')
    if (p > 0 && p < 9) lines[i+1] = line.substr(p)
  }
  return lines.join('')
}
md = oldStars('★', md)
md = oldStars(':star:', md)

md = md.replace('<svg>', '`<svg>`') // fix formatting
// missing repos
var repos = [
  ['yuche', 'vue-strap'], ['morgul', 'vueboot'],
  ['gritcode', 'gritcode-components/#/toast'],
  ['kzima', 'vuestrap-base-components/#/accordion'],
  ['gritcode', 'gritcode-components']
]
for (i = 0; i < repos.length; i++) {
  var repo = repos[i]
  var url  = repo[0] + '.github.io/' + repo[1] + '/)'
  var p    = repo[1].indexOf('/#')
  var prj  = (p>0) ? repo[1].substr(0,p) : repo[1]
  md  = md.replace(url, url + IMG_HEAD + repo[0] + '/' + prj + IMG_TAIL)
  url = repo[0] + '.github.io/' + repo[1] + ')'
  md  = md.replace(url, url + IMG_HEAD + repo[0] + '/' + prj + IMG_TAIL)
}

fs.writeFileSync('README_STARS.md', md, 'utf8')
console.log('done')
