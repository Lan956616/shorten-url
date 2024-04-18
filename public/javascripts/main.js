document.querySelector('.input-btn').addEventListener('click', ()=> {
  if (document.querySelector('.input').value.length === 0 ) {
    alert('請輸入要縮短的網址')
  }
})
