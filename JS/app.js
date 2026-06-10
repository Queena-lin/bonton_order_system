/*共用變數*/

//載入data.js內容(渲染用)
let dishes = data.dishes;

//瀏覽列
let nav = document.querySelector("nav");

//各菜餚種類按鈕下 顯示清單列 (data渲染用)
let menuListWrap = document.querySelector(".menuListWrap");

//網頁主要內容 容器元素
let containerDiv = document.querySelector(
  ".container.d-flex.flex-column.align-items-center.pt-3",
);

//網頁禁止enter鍵
document.addEventListener("keypress", (e) => {
  if (e.key === "enter") {
    e.preventDefault();
    return false;
  }
});

//菜餚種類瀏覽列 按件-渲染
dishTypeBtn();
function dishTypeBtn() {
  for (let i = 0; i < dishes.length; i++) {
    let btn = document.createElement("button");
    btn.classList = "btn btn-warning";
    btn.setAttribute("type", "button");
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", "#" + dishes[i].dishType);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", dishes[i].dishType);
    if (dishes[i].dishType == "飯麵") {
      btn.innerText = "飯/麵";
    } else {
      btn.innerText = dishes[i].dishType;
    }
    nav.appendChild(btn);
  }
}

//各菜餚種類下 菜名清單 摺疊選單 框架選染
underDishTypeListFrame();
function underDishTypeListFrame() {
  for (let i = 0; i < dishes.length; i++) {
    let dishTypeList = document.createElement("div");
    dishTypeList.innerHTML = ` 
    <div class="card card-body">
    </div>`;
    if (i === 0) {
      dishTypeList.className = "w-100 collapse show";
    } else {
      dishTypeList.className = "w-100 collapse";
    }
    dishTypeList.setAttribute("id", dishes[i].dishType);
    menuListWrap.appendChild(dishTypeList);
  }
}

//除掉bootstrap預設折疊事件行為
let menuListDiv = menuListWrap.querySelectorAll(".collapse");

menuListDiv.forEach((el) => {
  //預設的顯示行為通通禁止
  el.addEventListener("show.bs.collapse", function (e) {
    e.preventDefault();
  });
});

//自定義折疊顯示行為
//菜餚種類按鍵事件監聽 - 按下目標按鍵，該對應內容顯示，其餘折疊
dishTypeBtnCollapse();
function dishTypeBtnCollapse() {
  //菜餚種類按鍵
  let btns = nav.querySelectorAll("button");
  btns.forEach((el) => {
    el.addEventListener("click", () => {
      //所有菜餚種類下 菜名清單div皆折疊
      menuListDiv.forEach((ele) => {
        //移除類show -> 折疊
        ele.classList.remove("show");
      });
      let idName = el.getAttribute("data-bs-target");
      let showDiv = menuListWrap.querySelector(idName);
      //點選的菜餚種類 所屬菜名清單div顯示
      //添加類show -> 顯示
      showDiv.classList.add("show");

      //各菜餚種類之下的 菜名清單下的
      //各菜名內容div，已打開的div將其折疊
      let dishForms = menuListWrap.querySelectorAll(".dishForm");
      dishForms.forEach((el) => {
        el.classList.remove("show");
      });
    });
  });
}

//各菜餚種類下所有菜名清單框架選染
//添加至 菜餚種類摺疊選單框架
underDishTypeListContent();
function underDishTypeListContent() {
  for (let i = 0; i < dishes.length; i++) {
    let cardDiv = menuListWrap.querySelector("#" + dishes[i].dishType)
      .children[0];
    //風琴選單包裝(內含各子項)
    let div = accordionItems(dishes[i].dishName);
    div.setAttribute("id", dishes[i].dishType + "列表框");
    cardDiv.appendChild(div);
  }
}

//accordion Item 風琴選單子項 渲染
//target -> dishes[i].dishName 種類下菜名列表
function accordionItems(target) {
  //包裝渲染後的子項的元素
  let divWrap = document.createElement("div");
  divWrap.className = "accordion";
  //依據data菜名列表渲染 -> 菜名按鍵
  for (let i = 0; i < target.length; i++) {
    let div = document.createElement("div");
    div.className = "accordion-item";
    div.innerHTML = `
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed dishBtn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#${target[i].title}"
          aria-expanded="true"
          aria-controls="${target[i].title}"
          value="${target[i].title}"
        >
          ${target[i].title}
        </button>
      </h2>
      <div id="${target[i].title}" class="accordion-collapse collapse dishForm">
        <div class="accordion-body">
        </div>
      </div>
      `;
    divWrap.appendChild(div);

    //菜名按鍵下的 風琴元素內容
    let accordionBody = div.querySelector(".accordion-body");
    //各菜名風琴元素裡的 dishDetail元素
    let form = dishOrderForm(target[i]);
    accordionBody.appendChild(form);
  }
  //回傳包裝元素
  return divWrap;
}

//各菜餚種類下菜名按鍵列表 - 目標菜名按鍵按下，對應內容顯示
// 其他按鍵折疊選單折疊
dishBtnCollapse();
function dishBtnCollapse() {
  //以各種類為單位-對各類下 - 菜單表(按鍵綁定-折疊非該按鍵對應div，只呈現該按鍵對應div)
  for (let i = 0; i < dishes.length; i++) {
    //第i項 種類
    let dishWrap = document.querySelector("#" + dishes[i].dishType + "列表框");
    //第i項 種類 裡的所有 菜名按鍵
    let btns = dishWrap.querySelectorAll(".dishBtn");
    btns.forEach((el) => {
      el.addEventListener("click", () => {
        //第i項 種類 裡的 所有菜名 對應折疊內容
        dishWrap.querySelectorAll(".dishForm").forEach((ele) => {
          //全部折疊
          ele.classList.remove("show");
        });
        let targetID = el.getAttribute("data-bs-target");
        let targetDiv = dishWrap.querySelector(targetID);
        //目標按鍵 對應的內容 顯示
        targetDiv.classList.add("show");
      });
    });
  }
}

//各道菜名裡添加點餐相關form資訊
// target 為 該種類(dishes[i])下的.dishName第[i]項
function dishOrderForm(target) {
  let form = document.createElement("form");
  form.setAttribute("id", target.title + "Form");
  //以下分三部分
  //1-1.判斷target 是否有size;
  if (target.size) {
    let divWrap = document.createElement("div");
    divWrap.className = "sizeWrap";
    for (let j = 0; j < target.size.length; j++) {
      let formCheck = document.createElement("div");
      formCheck.className = "form-check";
      formCheck.innerHTML = `
       <input
          class="form-check-input"
          type="radio"
          name="${target.title}_size"
          id="${target.title + target.size[j]}"
          value="${target.size[j]}"
        />
        <label class="form-check-label" for="${target.title + target.size[j]}">
          ${target.size[j]}
        </label>
      `;
      divWrap.appendChild(formCheck);
    }
    form.appendChild(divWrap);
  }
  //1-2.判斷target 是否有note;
  if (target.note) {
    let divWrap = document.createElement("div");
    divWrap.className = "noteWrap";
    for (let j = 0; j < target.note.length; j++) {
      let formCheck = document.createElement("div");
      formCheck.className = "form-check";
      formCheck.innerHTML = `
       <input
          class="form-check-input"
          type="radio"
          name="${target.title}_note"
          id="${target.title + target.note[j]}"
          value="${target.note[j]}"
        />
        <label class="form-check-label" for="${target.title + target.note[j]}">
          ${target.note[j]}
        </label>
      `;
      divWrap.appendChild(formCheck);
    }
    form.appendChild(divWrap);
  }

  //2-1.numWrap -> placeholder(預設):請輸入數量;
  let numWrap = document.createElement("div");
  numWrap.className = "numWrap d-flex justify-content-center mt-3 row";
  let text = function (text) {
    htmlContent = `
    <div class="col-md-4"></div>
      <div class="col-md-4">
        <div class="input-group">
          <button
            class="btn btn-outline-secondary plusBtn"
            type="button"
          >
            +
          </button>
          <input
            type="tel"
            class="form-control text-center inputForbit"
            inputmode="numeric"
            placeholder="請選擇${text}"
          />
          <button
            class="btn btn-outline-secondary minusBtn"
            type="button"
          >
            -
          </button>
        </div>
      </div>
      <div class="col-md-4"></div>
    </div>
    `;
    return htmlContent;
  };
  if (!target.unit) {
    numWrap.innerHTML = text("數量");
  } else {
    //2-2.numWrap -> 判斷target[i]有unit -> placeholder:請輸入人數;
    numWrap.innerHTML = text(target.unit);
  }
  form.appendChild(numWrap);

  //3. 加入購物車按鈕
  let addCartWrap = document.createElement("div");
  addCartWrap.className = "d-grid mt-3 col-md-3 mx-auto addCartWrap";
  let addCartBtn = document.createElement("button");
  addCartBtn.className = "btn btn-warning addCartBtn";
  addCartBtn.setAttribute("type", "button");
  addCartBtn.innerText = "加入購物車";
  addCartWrap.appendChild(addCartBtn);
  form.appendChild(addCartWrap);

  //添加完form內容後，包裝整個元素
  return form;
}

//加號按鈕綁定 input Value增加事件
let plusBtns = document.querySelectorAll(".plusBtn");
plusBtns.forEach((el) => {
  el.addEventListener("click", (e) => {
    let input = el.parentNode.querySelector("input");
    //如果input.value為空值，初始化 -> 讓值變 1
    if (!input.value) {
      input.value = 1;
    } else {
      //input.value 有值
      let value = Number(input.value);
      //! input.value 是字串
      input.value = value + 1;
    }
  });
});

//減號按鈕綁定 input Value減少事件
let minusBtns = document.querySelectorAll(".minusBtn");
minusBtns.forEach((el) => {
  el.addEventListener("click", (e) => {
    let input = el.parentNode.querySelector("input");
    //判斷 input.value 是否有值 且 大於等於 1
    if (input.value && input.value >= 1) {
      let value = Number(input.value);
      input.value = value - 1;
      //判斷input.value 是否為 0
      if (input.value == 0) {
        //input.value 為0時，將input.value 改為""
        //這樣送出的資訊就會是空值而不是0
        input.value = "";
      }
    } //input.value 沒有值 -> 不做任何動作
  });
});

//加入購物車按鈕 事件綁定 - 存入購物車
addCartBtns();
function addCartBtns() {
  let addCartBtns = document.querySelectorAll(".addCartBtn");
  addCartBtns.forEach((el) => {
    el.addEventListener("click", () => {
      let theForm = el.parentNode.parentNode,
        sizeWrap = theForm.querySelector(".sizeWrap"),
        noteWrap = theForm.querySelector(".noteWrap"),
        numWrap = theForm.querySelector(".numWrap"),
        sizeValue = "",
        noteValue = "",
        numValue = "";
      // 判斷有無size，取得value
      if (sizeWrap) {
        let inputName = sizeWrap.querySelector("input").name;

        let inputChecked = sizeWrap.querySelector(
          `input[name='${inputName}']:checked`,
        );
        //判斷有沒有選，避免空值
        if (inputChecked) {
          sizeValue = inputChecked.value;
          //未選取時的提示框線 -> 變回預設
          sizeWrap.style.border = "";
        } else {
          //提醒用戶填寫
          sizeWrap.style.border = "2px solid red";
        }
      }

      // 判斷有無note，取得value
      if (noteWrap) {
        let inputName = noteWrap.querySelector("input").name;

        let inputChecked = noteWrap.querySelector(
          `input[name='${inputName}']:checked`,
        );
        //判斷有沒有選，避免空值
        if (inputChecked) {
          noteValue = inputChecked.value;
          //未選取時的提示框線 -> 變回預設
          noteWrap.style.border = "";
        } else {
          //提醒用戶填寫
          noteWrap.style.border = "2px solid red";
        }
      }

      //numWrap取得value
      let numInput = numWrap.querySelector("input");
      //判斷有沒有值
      if (numInput.value) {
        numValue = numInput.value;
        //未選取時的提示框線 -> 變回預設
        numInput.style.border = "";
      } else {
        //提醒用戶填寫
        numInput.style.border = "2px solid red";
      }
      //取得菜名
      let dishID = theForm.id,
        dishValue = dishID.slice(0, dishID.length - 4),
        //用來判斷data是否有值的變數
        dataHasValue = false;

      //訂購菜時一定要有num值才能儲存成order
      if (numValue) {
        //情況一 只有數量沒有size和note
        if (!sizeWrap && !noteWrap) {
          dataHasValue = true;
        } else if (sizeWrap && noteWrap) {
          //情況二 有數量，有size有note
          dataHasValue = true;
        } else {
          //情況三 有數量，有size或note其一
          if (sizeValue != "") {
            //size有值
            dataHasValue = true;
          }
          if (noteValue != "") {
            //note有值
            dataHasValue = true;
          }
        }

        if (dataHasValue) {
          //將資料存成物件
          let order = {
            dishName: dishValue,
            dishDetail: {
              size: sizeValue,
              note: noteValue,
              num: numValue,
            },
          };
          //成功儲存data後
          //表單重置 -> 讓使用者默認資料送出
          theForm.reset();

          //將資料物件存入購物車裡
          addCartList(order);

          //加入購物車按鈕 -> 函示會先判斷無按鈕才會添加
          createCartBtn();

          //購物車按鈕的徽章顯示order筆數
          badgeShowItemNum();

          //取得購物車資料
          let orderListDB = getCartOrderData();
          // Localstorage -> 每按addCartBtn -> 覆蓋資料
          DataOfLocalstorageHandler("rewrite", "dishOrder", orderListDB);
        }
      } //沒有數量 不做任何動作
    });
  });
}

//加入order到購物車清單div裡面
function addCartList(order) {
  let ordersWrap = document.querySelector(".ordersWrap");
  let dishOrder = document.createElement("div");
  dishOrder.className = "dishOrder d-flex flex-column";

  //dishContent - 菜名跟數量
  let dishContent = document.createElement("div");
  dishContent.className = "dishContent d-flex justify-content-between";
  dishContent.innerHTML = `
   <p class="h4 dishNameDB">${order.dishName}</p>
    <p class="fs-5 pe-2">
      x <span class="dishOrderNum dishNumDB ps-1">${order.dishDetail.num}</span>
    </p>
  `;
  dishOrder.appendChild(dishContent);

  // dishRequired - size / note 判斷有沒有
  if (order.dishDetail.size || order.dishDetail.note) {
    let dishRequired = document.createElement("div");
    dishRequired.className = "dishRequired d-flex flex-column ms-3";
    if (order.dishDetail.size) {
      let p = document.createElement("p");
      p.className = "dishSizeDB";
      p.innerText = order.dishDetail.size;
      dishRequired.appendChild(p);
    }

    if (order.dishDetail.note) {
      let p = document.createElement("p");
      p.className = "dishNoteDB";
      p.innerText = order.dishDetail.note;
      dishRequired.appendChild(p);
    }
    dishOrder.appendChild(dishRequired);
  }
  //加入移除按鈕
  let removeDiv = document.createElement("div");
  removeDiv.className = "orderRemove d-flex justify-content-end";
  removeDiv.innerHTML = `
  <button class="removeBtn btn btn-danger me-2">移除</button>
  `;
  dishOrder.appendChild(removeDiv);

  //移除按鈕綁定 移除事件
  orderRemoveInCart(dishOrder);

  //加入 hr 標籤
  let hr = document.createElement("hr");
  dishOrder.appendChild(hr);
  ordersWrap.appendChild(dishOrder);
}

//網頁加入購物車按鈕
function createCartBtn() {
  let cartBtn = document.querySelector(".cartBtn");
  //先判斷有無購物車按鈕，若無才添加
  if (!cartBtn) {
    let btn = document.createElement("button");
    btn.className =
      "btn btn-danger cartBtn mb-3 position-fixed bottom-0 start-50 translate-middle-x";
    btn.innerHTML = `
     購物車<span class="badge text-bg-warning ms-1"></span>
    `;
    containerDiv.appendChild(btn);
    //購物車按鈕的徽章顯示order筆數;
    badgeShowItemNum();
    //對該按鍵綁定 - 點擊顯示購物車事件
    showCartBtn();
  } //若有該按鈕，則無動作
}

//cartBtn點擊事件綁定 - 顯示購物車清單div
function showCartBtn() {
  //filter元素 為購物車內容元素
  let filter = document.querySelector(".filter");
  let cartBtn = document.querySelector(".cartBtn");
  cartBtn.addEventListener("click", () => {
    //使filter元素 顯示 (預設為 隱藏)
    filter.style.display = "block";
    //使filter元素 圖層升高，避免其餘內容擋住
    filter.style.zIndex = 20;
    //網頁主要內容容器添加類vh-100 及 overflow-hidden
    //將多餘顯示內容隱藏
    containerDiv.classList.add("vh-100");
    containerDiv.classList.add("overflow-hidden");
  });
}

//closeBtn點擊事件綁定 - 關閉購物車清單div
closeBtn();
function closeBtn() {
  let filter = document.querySelector(".filter");
  let closeBtn = document.querySelector(".closeBtn");
  closeBtn.addEventListener("click", () => {
    //使filter元素 變回預設
    filter.style.display = "";
    filter.style.zIndex = "";
    //網頁主要內容容器移除類vh-100 及 overflow-hidden
    //將所有內容顯示
    containerDiv.classList.remove("vh-100");
    containerDiv.classList.remove("overflow-hidden");
  });
}

//購物車裡 移除點菜按鈕 綁定移除事件
//在addCartList()裡執行
function orderRemoveInCart(dishOrderDiv) {
  //該函數下創造的dishOrderDiv 的移除按鈕
  let removeBtn = dishOrderDiv.querySelector(".removeBtn");

  removeBtn.addEventListener("click", (e) => {
    let dishOrder = e.currentTarget.parentNode.parentNode;
    let ordersWrap = dishOrder.parentNode;
    ordersWrap.removeChild(dishOrder);
    //更新購物按鈕徽章顯示的order筆數
    badgeShowItemNum();
    //假使所有項目皆移除，關閉購物車內容，刪除購物車按鈕
    //移除localStorage暫存資料
    let dishOrders = document.querySelectorAll(".dishOrder.d-flex.flex-column");
    if (!dishOrders.length) {
      //關閉購物車內容
      let filter = document.querySelector(".filter");
      //使filter元素 變回預設
      filter.style.display = "";
      filter.style.zIndex = "";
      //網頁主要內容容器移除類vh-100 及 overflow-hidden
      //將所有內容顯示
      containerDiv.classList.remove("vh-100");
      containerDiv.classList.remove("overflow-hidden");
      //刪除購物車按鈕
      let cartBtn = document.querySelector(".cartBtn");
      cartBtn.parentNode.removeChild(cartBtn);

      // Localstorage -> 購物車無資料時 -> 移除資料
      DataOfLocalstorageHandler("remove", "dishOrder");
    } else {
      //購物車有值時
      //Localstorage -> 每按removeBtn -> 覆蓋資料
      //取得購物車資料
      let orderListDB = getCartOrderData();
      // Localstorage -> 每按addCartBtn -> 覆蓋資料
      DataOfLocalstorageHandler("rewrite", "dishOrder", orderListDB);
    }
  });
}

//購物車 - 徽章 顯示order數量
function badgeShowItemNum() {
  let badge = document.querySelector(".badge");
  let dishOrders = document.querySelectorAll(".dishOrder.d-flex.flex-column");
  //order裡的筆數 ＝ dishOrders 偽陣列的長度
  let orderItemsNum = dishOrders.length;
  //放進badge裡
  //判斷是否為空值
  if (!orderItemsNum) {
    //不顯示
    badge.innerText = "";
  } else {
    badge.innerText = orderItemsNum;
  }
}

//擷取購物車order資料 -> 送出至雲端/Localstorage
function getCartOrderData() {
  let dishOrders = document.querySelectorAll(".dishOrder.d-flex.flex-column");
  let orderList = [];
  dishOrders.forEach((el) => {
    //size和note有些菜沒有，預設為空值
    let dishSize = "",
      dishNote = "";
    //如果有，則將值覆蓋
    if (el.querySelector(".dishSizeDB")) {
      dishSize = el.querySelector(".dishSizeDB").innerText;
    }
    if (el.querySelector(".dishNoteDB")) {
      dishNote = el.querySelector(".dishNoteDB").innerText;
    }
    let dishName = el.querySelector(".dishNameDB").innerText,
      dishNum = el.querySelector(".dishNumDB").innerText,
      order = {
        dishName: dishName,
        dishDetail: {
          size: dishSize,
          note: dishNote,
          num: dishNum,
        },
      };
    orderList.push(order);
  });
  return orderList;
}

// Localstorage -> 每按addCartBtn -> 覆蓋資料
// Localstorage -> 每按removeBtn -> 覆蓋資料
// Localstorage -> 送出資料或是購物車無資料時 -> 移除資料

//localStorage處理器 -> 處理訂單暫存(取得、覆蓋、移除)
function DataOfLocalstorageHandler(method, storageName, data) {
  if (method === "get") {
    //查看localStorage裡有沒有storageName
    let orderData = JSON.parse(localStorage.getItem(storageName));

    if (orderData) {
      return orderData;
    } else {
      return false;
    }
  }
  if (method === "rewrite") {
    //轉成字串儲存資料到localStorage
    localStorage.setItem(storageName, JSON.stringify(data));
  }
  if (method === "remove") {
    //從localStorage移除storageName
    localStorage.removeItem(storageName);
  }
}

// window 監聽 load事件 -> 從localStorage確認有無資料
// ->  購物車還原
window.addEventListener("load", () => {
  let data = DataOfLocalstorageHandler("get", "dishOrder");

  if (data) {
    //將資料添加至購物車裡
    data.forEach((el) => {
      addCartList(el);
    });
    createCartBtn();
  }
});

// Localstorage -> 送出資料時 -> 移除資料
