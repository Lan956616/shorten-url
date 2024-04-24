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

//↓↓↓↓↓↓↓↓↓↓第二次繳交新增↓↓↓↓↓↓↓↓↓↓

//把輸入網址去除空白和轉成小寫
  let inputURL = req.query.URL.trim().toLowerCase()

//如果輸入的網址最後一字為'/'則去掉
  if (inputURL[inputURL.length - 1] === '/') {
    inputURL = inputURL.slice(0, inputURL.length - 1)
  }

//↑↑↑↑↑↑↑第二次繳交新增↑↑↑↑↑↑↑


  let shortenURL = ``
  //沒有輸入內容就不執行
  if (inputURL.length > 0) {
    shortenURL += BASE_URL
    shortenURL += getFiveRandom(inputURL)
    res.render('detail', {shortenURL})
  }
})

app.get('/:id', (req,res)=>{
  const id = req.params.id
  const index = Object.keys(usedURL).indexOf(id)
  res.redirect(`${Object.values(usedURL)[index]}`)
})


//監聽伺服器
app.listen(port, ()=>{
  console.log(`express server is running on http://localhost:${port}`)
})


//↓↓↓↓↓↓↓↓↓↓第二次繳交新增↓↓↓↓↓↓↓↓↓↓
//把函式分成兩個 並增加檢查產生的五個亂數有沒有重複

//隨機產生亂數功能
function getFiveRandom(inputURL) {
  //檢查輸入的網址是否已經縮短過
  const index = Object.values(usedURL).indexOf(inputURL)
  //已經縮短過
  if (index >= 0) {
    return Object.keys(usedURL)[index]
  }
  //還沒被縮短過則呼叫函式
  let result = ''
  result += numbers()

  //產生的新短網址紀錄進file system
  usedURL[result] = inputURL
  fs.writeFile('./public/jsons/usedURL.json', JSON.stringify(usedURL), function (err) {
    if (err)
        console.log(err);
    else
        console.log('Write operation complete.');
})
  return result
}


function numbers() {
  let result = ''
  const data = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  //隨機產生五碼
  for (let i = 1; i <= 5; i++) {
    result += data[Math.floor(Math.random() * 62)]
  }
  //檢查產生的五碼有沒有重複過
  if (Object.keys(usedURL).indexOf(result) >= 0) {
    return numbers()
  } else {
    return result
  }
}

//↑↑↑↑↑↑↑第二次繳交新增↑↑↑↑↑↑↑
