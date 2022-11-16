

// 製作分頁數
function perPages(number){
  const pages = Math.ceil(number / PER_PAGE)
  const pageStart = `
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
  `
  const pageEnd = `
    <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
  `
  let innerPages = ''
  for( let i = 1; i <= pages; i++){
    innerPages += `
      <li class="page-item"><a class="page-link" data-page="${i}" href="#">${i}</a></li>
    `
  }
  listPages.innerHTML = pageStart + innerPages + pageEnd
}
// 取得要顯示的分頁資料
function showPageData(number){
  const data = favoriteData
  number = (number - 1) * PER_PAGE
  const pageData = data.slice(number, number + PER_PAGE)
  return pageData
}
// 渲染 list
function renderList(data){
  let Cards = ''
  data.forEach( item => {
    Cards += `
      <div class="card m-2">
        <img src="${item.avatar}" class="card-img-top" alt="${item.name}的大頭照" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${item.id}">
        <div class="card-body">
          <p class="card-text my-2">${item.name}</p>
          <p class="card-text my-2">${item.surname}</p>
          <a href="#" class="btn btn-danger" id="removeFavorite" data-id="${item.id}">-</a>
        </div>
      </div>
    `
  })
  firendsList.innerHTML = Cards
}
// 渲染 modal 
function renderModal(id){
  const modalTitle = document.querySelector('#exampleModalLabel')
  const modalImg = document.querySelector('#modal-img')
  const modalData = document.querySelector('#modal-data')
  const modalCreated = document.querySelector('#modal-created')

  modalTitle.innerText = ''
  modalImg.src = ''
  modalData.innerHTML = ''
  modalCreatedinnerHTML = ''

  axios.get(BASE_URL + id)
  .then((res) => {
    item = res.data
    modalTitle.innerText = item.name +' ' + item.surname
    modalImg.src = item.avatar
    modalData.innerHTML = `
      <p>Gender : ${item.gender}</p>
      <p>Region : ${item.region}</p>
      <p>Age : ${item.age}</p>
      <p>Birthday : ${item.birthday}</p>
      <p>E-mail : ${item.email}</p>
    `
    modalCreated.innerHTML = `
      <p>created : ${item.created_at}</p>
      <p>updated : ${item.updated_at}</p>
    `
  }).catch((err) => {console.log('error')})
}
// 刪除 favorite
function removeFavorite(id){
  const index = favoriteData.findIndex( item => item.id === Number(id))
  favoriteData.splice(index, 1)
  perPages(favoriteData.length)
  renderList(showPageData(1))
  localStorage.setItem('favoriteData', JSON.stringify(favoriteData))
}

// 建立全域資料變數
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
const listPages = document.querySelector('#list-pages')
const firendsList = document.querySelector('#firends-list')
const modalWrap = document.querySelector('#exampleModal')
let PER_PAGE = 12


const favoriteData = JSON.parse(localStorage.getItem('favoriteData'))
  perPages(favoriteData.length)
  renderList(showPageData(1))


  // 監聽事件
listPages.addEventListener('click', event => {
  event = event.target
  if(event.matches('[data-page]')){
    renderList(showPageData(event.dataset.page))
  }
  // }else if(event.target.matches('[aria-label="Previous"]')){

  // }else if (event.target.matches('[aria-label="Next"]')){

  // }
})
firendsList.addEventListener('click' , event => {
  if(event.target.tagName === 'IMG'){
    renderModal(event.target.dataset.id)
  }else if(event.target.tagName ==='A'){
    removeFavorite(event.target.dataset.id)
  }
})



/*
1.更改 HTML 把 '+' 改成 '-'
2.點擊 '-' 執行 removeFavorite 函式
3.修改 addToFavorite() 變成 removeFavorite()
  3-1.用 findIndex() 找到一樣 id 的 item
      用 splice(index , 1) 刪除 favoriteData 中的資料
      計算分頁數
      渲染 list
      把 favoriteData 再存回 localStorage 裡面
*/