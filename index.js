/*
1.設定基本版型
2.串 API 套上資料
  用 axios.get 得到 res.data
  把 res.data 放進 allFirendsData 的陣列中

3.製作分頁數
  利用資料的 .length 除以預設的資料顯示筆數 PER_PAGE
  再用 Math.ceil() 得到無條件進位的 pages
  先 const 上一頁, 下一頁的 template literal
  用 for 迴圈跑 pages 次, 製作分頁數
  最後把全部 innerHTML 到 listPages 裡

4.按照分頁顯示每頁 12 筆資料
  在 listPages 監聽 click 事件
  如果 event.target 有包含 data-page 這個屬性, 執行 showPageData 函式
  用 slice() 得到分頁的 12 筆資料
  再用這筆資料去渲染列表區

5.渲染列表區
  把拿到的資料利用 for + template literal 放到 firendsList 對應的位置

6.製作搜尋功能
  監聽 #search 的 click 事件
  取得 input.value 
  利用 filter() 找出名字有包含 input.value 的資料
  使用 includes() 判斷有沒有包含條件
  最後使用找好的資料計算分頁數 , 渲染畫面

7.渲染 modal
  監聽 card 的 img
  取得 dataset.id 執行 showModal 函式
  清空指定區 > axios.get 資料 > 放入資料

8.製作最愛 firends
  先取得 localStorage 的 favoriteData (如果沒有這筆資料夾就準備一個空 array )
  用 find() 從 allFirendsData 裡找到相同 id 的 item
  .push() 進去 favoriteData
  用 .some() 判斷 favoriteData 裡有沒有相同 id 的 item
  如果有就 return 出 function 並跳通知
  最後再把 favoriteData 存進 localStorage 裡
  
*/
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
  const data = searchData.length ? searchData : allFirendsData
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
          <a href="#" class="btn btn-primary" id="addToFavorite" data-id="${item.id}">+</a>
        </div>
      </div>
    `
  })
  firendsList.innerHTML = Cards
}
// 取得搜尋資料
function getSearchData(){

  // if(!searchInput.value.length) {return}
  const keyWord = searchInput.value.trim().toLowerCase()
  searchData.push(...allFirendsData.filter( item => {
    return item.name.toLowerCase().includes(keyWord)
  }))
  perPages(searchData.length)
  renderList(showPageData(1))
  searchInput.value = ''
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
// 新增到 favorite
function addToFavorite(id){
  const favoriteData = JSON.parse(localStorage.getItem('favoriteData')) || []
  const firend = allFirendsData.find( item => {
    return item.id === Number(id)
  })
  if(favoriteData.some( item => item.id === firend.id)){
    return alert('這個人已經在最愛名單裡了')
  }
  favoriteData.push(firend)
  localStorage.setItem('favoriteData', JSON.stringify(favoriteData))
}

// 建立全域資料變數
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
const listPages = document.querySelector('#list-pages')
const firendsList = document.querySelector('#firends-list')
const searchBtn = document.querySelector('#search')
const searchInput = document.querySelector('#search-input')
const modalWrap = document.querySelector('#exampleModal')
const allFirendsData = []
const searchData = []
let PER_PAGE = 12


axios.get(BASE_URL)
.then((res) => {
  res = res.data.results
  allFirendsData.push(...res)
  perPages(allFirendsData.length)
  renderList(showPageData(1))
}).catch((err) => {console.log('error')})

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
searchBtn.addEventListener('click', event => {
  event.preventDefault()
  getSearchData()
})
firendsList.addEventListener('click' , event => {
  if(event.target.tagName === 'IMG'){
    renderModal(event.target.dataset.id)
  }else if(event.target.tagName ==='A'){
    addToFavorite(event.target.dataset.id)
  }
})