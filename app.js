const express = require('express')
const {engine} = require('express-handlebars')
const fs = require('fs')

const app = express()
const port = 3000
const BASE_URL = `http://localhost:3000/`
let usedURL = JSON.parse(fs.readFileSync('./public/jsons/usedURL.json', 'utf8'))
console.log(usedURL)

//引用靜態檔案
app.use(express.static('public'))
//設定樣版引擎
app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

//設定路由
app.get('/', (req,res)=>{
  res.render('index')
})

app.get('/shorten', (req,res)=>{
  const inputURL = req.query.URL
  let shortenURL = ``
  //沒有輸入內容就不執行
  if (inputURL.length > 0) {
    shortenURL += BASE_URL
    shortenURL += getFiveRandom(inputURL)
    res.render('detail', {shortenURL})
  }
})


//監聽伺服器
app.listen(port, ()=>{
  console.log(`express server is running on http://localhost:${port}`)
})

//隨機產生亂數功能
function getFiveRandom(inputURL) {
  //檢查輸入的網址是否已經縮短過
  const index = Object.values(usedURL).indexOf(inputURL)
  //已經縮短過
  if (index >= 0) {
    return Objects.keys(usedURL)[index]
  }
  //還沒被縮短過
  let result = ''
  const data = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 1; i <=5; i++) {
    result += data[Math.floor(Math.random() * 62)]
  }
  //產生的新短網址紀錄進file system
  usedURL[result] = inputURL
  fs.writeFile('./public/jsons/usedURL.json', JSON.stringify(usedURL))
  return result
}