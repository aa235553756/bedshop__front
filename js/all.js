const token = `IvrDZKlfPifWEtzl5X5IGq78ha42`;
const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/chiayang`
const adminURl = `https://livejs-api.hexschool.io/api/livejs/v1/admin/chiayang`

let productData = []
let cartsData = [];

const myCarts = document.querySelector('#myCarts');
const product__btn  = document.querySelectorAll('.product__btn');
const delAll = document.querySelector('#delAll');
const order = document.forms[0];
const orderSubmit = order.elements.submit;

// todo2 (時間夠再做
// 統計價錢
// 8個渲染及窗簾篩選

// todo1 
// * 加入購物車綁定按鈕
// * 生成id序號 及 渲染畫面(增加列表)
// * 用AI調整價錢字串
// * 刪除各筆
// * 加入購物車
// * 刪除全部
// * 取得表單資料
// * 送出訂單
// * 送出後清空




getProduct(); //addEventListner
productBtnAddEvent() //addEventListner
getCartAndRender(); //init()


myCarts.addEventListener('click',(e)=>{
    if(e.target.parentNode.nodeName !== 'A'){
        return;
    }else{
        const id = e.target.parentNode.getAttribute('id');
        cartsData = cartsData.filter((item)=>{
            return item.id !== id
        })
        render();
        delProduct(id)
    }
})

delAll.addEventListener('click',(e)=>{
    delAllCarts();
    cartsData = [];
    render();
})

order.addEventListener('submit',(e)=>{
    e.preventDefault()
})

order.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        e.preventDefault()
    }
})

orderSubmit.addEventListener('click',postOrderAndRender)

orderSubmit.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        postOrderAndRender();
    }
})

function getProduct(){
    axios.get(`${url}/products`)
    .then((res)=>{
        console.log(res.data.products);
        productData = res.data.products;
    })
    .catch((err)=>{
        console.log(err);
    })
}

// 沒有先渲染產品卡片的寫法,有渲染會依各放id,並判斷用ul去判斷li內的id
function productBtnAddEvent(){
    const product__btnAry = [...product__btn]
    product__btnAry.map((item,index)=>{
        item.addEventListener('click',async (e)=>{
            let id = productData[index].id;
            await addProduct(id);
            await getCartAndRender();
            alert('已加入購物車！');
        })
    })
}

async function getCart(){
    try{
        const res = await axios.get(`${url}/carts`);
        cartsData = await res.data.carts;
        console.log(cartsData);
        return cartsData;
    }catch(err){
        console.log(err);
    }
}

async function getCartAndRender(){
    try{
        cartsData = await getCart();
        render();
    }catch(err){
        console.log(err);
    }
}

function render(){
    let str = ``
    cartsData.map((item)=>{
        const price = item.product.price.toLocaleString()
        str += `
        <li class="d-flex align-items-center border-bottom" style="padding-bottom: 20px;margin-bottom: 20px;">
            <div class="d-flex align-items-center" style="max-width: 256px; margin-right: 30px;">
            <img src="${item.product.images}" alt="" class="me-3 flex-shrink-0 " width="80px" height="80px">
            <span class="fs-5 overflow-scroll" style="height:60px;">${item.product.description}</span>
            </div>
            <span class="fs-5" style="width: 100px; margin-right: 90px;">NT$${price}</span>
            <span class="fs-5" style="width: 40px; margin-right: 150px;">1</span>
            <span class="fs-5" style="width: 100px; margin-right: 100px;">NT$${price}</span>
            <a id="${item.id}" class="delItem">
                <span class="material-icons align-bottom fs-4">
                clear
                </span>
            </a>
        </li>`
    })
    if(str===``){
        myCarts.innerHTML = `
        <li class="d-flex align-items-center border-bottom h-100" style="min-height: 343px;">
            <span class="fs-5 w-100 text-center text-light">購物車內暫無產品</span>
        </li>`
    }else{
        myCarts.innerHTML = str;
    }
}

async function addProduct(productId,index,quantity){
    try{
        const res = await axios.post(`${url}/carts`,{
            'data':{
                'productId': productId,
                'quantity': 1
            }
        })
        console.log(res.data.carts);
    }catch(err){
        console.log(err);
    }
}

function delProduct(orderId){
    axios.delete(`${url}/carts/${orderId}`)
    .then((res)=>{
        console.log(res.data.carts)
    })
    .catch((err)=>{
        console.log(err);
    })
}

function delAllCarts(){
    if(cartsData.length === 0){
        return;
    }else{
        axios.delete(`${url}/carts`)
        .then((res)=>{
            console.log(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
}

async function postOrder(name,tel,email,address,payment){
    try{
        let res = await axios.post(`${url}/orders`,{
            'data':{
                "user": {
                    "name": name,
                    "tel": tel,
                    "email": email,
                    "address": address,
                    "payment": payment
                }
            }
        })
        const orderId = res.data.id
        alert(`訂單已成功送出，請記住您的id編號\n${orderId}`)
        order.reset();
        console.log(res);
    }catch(err){
        alert(`訂單送出失敗，請檢察網路連線`)
        console.log(err);
    }
}

async function postOrderAndRender(){
    const length = order.elements.length
    let newAry = []
    for(i=0; i < length;i++){
        if(i !== length-1){
            newAry.push(order.elements[i].value)
        }
    }

    if(newAry.includes('')){
        alert('資料填寫不完全！');
    }else{
        await postOrder(...newAry);
        cartsData = [];
        render();
    }
}

function getOrders(){
    axios.get(`${adminURl}/orders`,{
        'headers':{
            'Authorization': token,
        }
    })
    .then((res)=>{
        console.log(res.data);
    })
    .catch((err)=>{
        console.log(err);
    })
}

function delAllOredrs(){
    axios.delete(`${adminURl}/orders`,{
        'headers':{
            'Authorization': token,
        }
    })
    .then((res)=>{
        console.log(res.data);
    })
    .catch((err)=>{
        console.log(err);
    })
}