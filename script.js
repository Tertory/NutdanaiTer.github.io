/* ============================================================
   GLOBAL VARIABLES
   ============================================================ */

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const checkedItems = new Set();
let discountAmount = 0;


/* ============================================================
   SHARED — ใช้ได้ทุกหน้า
   ============================================================ */

/* ============================================================
   FUNCTION: saveCart
   หน้าที่: บันทึกข้อมูล cart ลง localStorage
   เรียกใช้: ทุกครั้งที่มีการเพิ่ม/ลบ/แก้ไขสินค้าในตะกร้า
   เชื่อมกับ: localStorage key "cart"
   ============================================================ */
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/* ============================================================
   FUNCTION: updateCartCount
   หน้าที่: อัปเดตตัวเลขจำนวนสินค้าบน icon ตะกร้า
   เรียกใช้: ทุกครั้งที่ cart เปลี่ยนแปลง
   เชื่อมกับ: .countItems
   ============================================================ */
function updateCartCount() {
  const countEl = document.querySelector(".countItems");
  if (!countEl) return;
  countEl.textContent = cart.length;
}


/* ============================================================
   MAIN PAGE
   ============================================================ */

/* ============================================================
   FUNCTION: initSliderpic
   หน้าที่: เริ่มต้น slider รูปภาพ promotion ที่หน้าหลัก
   เรียกใช้: ตอน page === "main"
   step: 1. กำหนด array รูป + index ปัจจุบัน
         2. ผูก event กับปุ่ม prev/next เพื่อเปลี่ยนรูป
   เชื่อมกับ: #main-img, #prev-btn, #next-btn
   ============================================================ */
function initSliderpic() {
  // 1. กำหนด array รูป และตัวนับ index ปัจจุบัน
  const images = ["./promotion1.jpg", "./promotion2.jpg", "./promotion3.jpg"];
  let index = 0;
  const imgEl = document.getElementById("main-img");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  if (!imgEl || !prevBtn || !nextBtn) return;
  // 2. ผูก event ปุ่ม prev — วนกลับแบบ circular
  prevBtn.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    imgEl.src = images[index];
  });
  // 3. ผูก event ปุ่ม next — วนไปข้างหน้าแบบ circular
  nextBtn.addEventListener("click", () => {
    index = (index + 1) % images.length;
    imgEl.src = images[index];
  });
}

/* ============================================================
   FUNCTION: initFilter
   หน้าที่: กรองสินค้าตามเพศ (Men / Women) บนหน้าหลัก
           กดซ้ำปุ่มเดิม = ยกเลิก filter แสดงทุกรายการ
   เรียกใช้: ตอน page === "main"
   step: 1. ดึง element ปุ่มและ card ทั้งหมด
         2. inner function filterCards() จัดการ toggle/filter
         3. ผูก event กับปุ่ม Men และ Women
   เชื่อมกับ: .gender-m, .gender-wm, .card-item
   ============================================================ */
function initFilter() {
  // 1. ดึง element ที่ต้องใช้
  const menBtn = document.querySelector(".gender-m");
  const womenBtn = document.querySelector(".gender-wm");
  const allCards = document.querySelectorAll(".card-item");
  if (!menBtn || !womenBtn) return;
  let currentFilter = null;
  // 2. inner function: จัดการ filter และ toggle active state
  function filterCards(type) {
    // กดปุ่มเดิมซ้ำ → ยกเลิก filter แสดงทุก card
    if (currentFilter === type) {
      currentFilter = null;
      menBtn.classList.remove("active");
      womenBtn.classList.remove("active");
      allCards.forEach(card => card.classList.remove("hidden"));
      return;
    }
    // เซ็ต filter ใหม่ + อัปเดตสี active บนปุ่ม
    currentFilter = type;
    menBtn.classList.toggle("active", type === "Men Shirt");
    womenBtn.classList.toggle("active", type === "Women Shirt");
    // ซ่อน/แสดง card ตาม data-type
    allCards.forEach(card => {
      if (card.dataset.type === type) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }
  // 3. ผูก event ปุ่ม Men และ Women
  menBtn.addEventListener("click", (e) => {
    e.preventDefault();
    filterCards("Men Shirt");
  });
  womenBtn.addEventListener("click", (e) => {
    e.preventDefault();
    filterCards("Women Shirt");
  });
}

/* ============================================================
   FUNCTION: initAddToCart
   หน้าที่: ผูก event กดปุ่ม "เพิ่มสินค้าลงตะกร้า" บนหน้าหลัก
           ถ้าสินค้ามีอยู่แล้วใน cart จะเพิ่ม qty แทนการ push ซ้ำ
   เรียกใช้: ตอน page === "main"
   step: 1. ดักจับทุก click บนหน้าผ่าน event delegation
         2. ตรวจว่า click มาจาก icon ตะกร้า
         3. ดึงข้อมูลสินค้าจาก .card-item
         4. เพิ่มหรืออัปเดต qty ใน cart
   เชื่อมกับ: .fa-cart-arrow-down, .card-item (data-id, data-price)
   ============================================================ */
function initAddToCart() {
  // 1. ใช้ event delegation ดักที่ document แทนผูกทีละ icon
  document.addEventListener("click", (e) => {
    e.preventDefault;
    // 2. ตรวจว่า click มาจาก icon ตะกร้าหรือไม่
    const icon = e.target.closest(".fa-cart-arrow-down");
    if (!icon) return;
    // 3. ดึงข้อมูลสินค้าจาก card ที่อยู่ใกล้ icon
    const card = icon.closest(".card-item");
    const item = {
      id: card.dataset.id,
      name: card.querySelector("p").textContent,
      price: Number(card.dataset.price),
      img: card.querySelector("img").src,
      qty: 1
    };
    // 4. ถ้ามีสินค้าชิ้นนี้อยู่แล้ว → เพิ่ม qty, ถ้าไม่มี → push ใหม่
    const existingItem = cart.find(product => product.id === item.id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push(item);
    }
    saveCart();
    updateCartCount();
  });
}


/* ============================================================
   CART PAGE
   ============================================================ */

/* ============================================================
   FUNCTION: renderCartPage
   หน้าที่: แสดงรายการสินค้าในหน้าตะกร้า + คำนวณยอดรวม
           ผูก event checkbox, +/- qty, ปุ่มลบสินค้า
   เรียกใช้: ทุกครั้งที่มีการเปลี่ยนแปลง cart
   step: 1. ดึง element ที่ต้องใช้
         2. ถ้าตะกร้าว่าง → แสดงข้อความและรีเซ็ตค่าทุกอย่าง
         3. loop สร้าง HTML สินค้าแต่ละชิ้น + คำนวณยอด
         4. render HTML และอัปเดตยอดราคา
         5. ผูก event checkbox select all และ checkbox รายชิ้น
         6. ลงทะเบียน window.changeQty และ window.removeItem
   เชื่อมกับ: .product-cart, .subtotal-price, .shipping-price,
              .grand-total-price, .texttie span, .summary-count,
              #boxForSelect, .item-checkbox
   ============================================================ */
function renderCartPage() {
  // 1. ดึง element ที่ต้องใช้
  const productContainer = document.querySelector(".product-cart");
  const subTotalEl = document.querySelector(".subtotal-price");
  const shippingEl = document.querySelector(".shipping-price");
  const grandTotalEl = document.querySelector(".grand-total-price");
  const cartItemsCount = document.querySelector(".texttie span");
  const summaryCountEl = document.querySelector(".summary-count");
  const selectAllCheckbox = document.querySelector("#boxForSelect");
  if (!productContainer) return;
  // 2. ถ้าตะกร้าว่าง → แสดงข้อความและรีเซ็ตค่าทุกอย่าง
  if (cart.length === 0) {
    productContainer.innerHTML = `<p class="noProduct">No product in cart</p>`;
    if (selectAllCheckbox) {
      selectAllCheckbox.disabled = true;
      selectAllCheckbox.checked = false;
      if (subTotalEl) subTotalEl.textContent = "0";
      if (shippingEl) shippingEl.textContent = "0";
      if (grandTotalEl) grandTotalEl.textContent = "0";
      if (cartItemsCount) cartItemsCount.textContent = "0 items";
      if (selectAllCheckbox) selectAllCheckbox.disabled = false;
      const summaryCountEl = document.querySelector(".summary-count");
      if (summaryCountEl) summaryCountEl.textContent = "(0 items)";
      const discountRow = document.querySelector(".discount-row");
      if (discountRow) discountRow.style.display = "none";
      discountAmount = 0;
      return;
    }
  }
  // 3. loop สร้าง HTML สินค้าแต่ละชิ้น + สะสมยอดราคาและจำนวน
  let totalHTML = "";
  let totalPrice = 0;
  let totalQty = 0;
  cart.forEach((item, index) => {
    totalPrice += item.price * item.qty;
    totalQty += item.qty;
    const isChecked = checkedItems.has(item.id) ? "checked" : "";
    totalHTML += `
    <div class="cart-item-row" data-index=${index}>
      <div>
        <label class="checkboxSelect">
        <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${isChecked}>
        <span class="checkmarkSelect"></span>
        </label>
      </div>
            <img src="${item.img}">
            <div class="productList">
                <h4>${item.name}</h4>
                <p>Price:$ ${item.price}</p>
                <div class="qty-control">
                    <button class="cart-count" onclick="changeQty(${index},-1)">-</button>
                    <span>${item.qty}</span>
                    <button class="cart-count" onclick="changeQty(${index},1)">+</button>
                </div>
            </div>
            <button class="delTrash" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
  });
  // 4. render HTML และอัปเดตยอดราคา + จำนวนสินค้า
  const shippingFee = totalQty * 1.50;
  const grandTotal = totalPrice + shippingFee;
  productContainer.innerHTML = totalHTML;
  subTotalEl.textContent = totalPrice.toFixed(2);
  shippingEl.textContent = shippingFee.toFixed(2);
  grandTotalEl.textContent = grandTotal.toFixed(2);
  cartItemsCount.textContent = `${cart.length} items`;
  summaryCountEl.textContent = cart.length <= 1
    ? ` (${cart.length} item)`
    : ` (${cart.length} items)`;
  const allInCart = document.querySelectorAll(".item-checkbox");
  if (!selectAllCheckbox || allInCart.length === 0) return;
  // 5. ผูก event "select all" checkbox
  selectAllCheckbox.addEventListener('change', (e) => {
    e.preventDefault;
    const status = e.target.checked;
    allInCart.forEach((minion) => {
      minion.checked = status;
      const id = minion.dataset.id;
      if (e.target.checked) {
        checkedItems.add(id);
      } else {
        checkedItems.delete(id);
      }
    });
    updateSummary();
  });
  // ผูก event checkbox รายชิ้น + sync สถานะ select all
  allInCart.forEach(minion => {
    minion.addEventListener("change", () => {
      const id = minion.dataset.id;
      if (minion.checked) {
        checkedItems.add(id);
      } else {
        checkedItems.delete(id);
      }
      const allInCartChecked = document.querySelectorAll(".item-checkbox:checked");
      selectAllCheckbox.checked = (allInCartChecked.length === allInCart.length);
      updateSummary();
    });
  });
  // 6. ลงทะเบียน global function สำหรับปุ่ม +/- qty และปุ่มลบ (ใช้กับ onclick inline)
  window.changeQty = (index, amount) => {
    cart[index].qty += amount;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
    renderCartPage();
    updateCartCount();
  };
  window.removeItem = (index) => {
    cart.splice(index, 1);
    saveCart();
    renderCartPage();
    updateCartCount();
  };
}

/* ============================================================
   FUNCTION: updateSummary
   หน้าที่: คำนวณยอดรวมเฉพาะสินค้าที่ถูก checkbox tick ไว้
           แสดงหรือซ่อน discount row ตาม discountAmount
   เรียกใช้: ทุกครั้งที่มีการ tick/untick checkbox หรือใช้คูปอง
   step: 1. ดึง element แสดงยอดต่าง ๆ
         2. วน checkbox ที่ถูก tick เพื่อรวมราคา + จำนวน
         3. คำนวณ shipping, discount, grand total
         4. แสดง/ซ่อน discount row
   เชื่อมกับ: .subtotal-price, .shipping-price, .grand-total-price,
              .discount-price, .discount-row, .item-checkbox:checked
   ============================================================ */
function updateSummary() {
  // 1. ดึง element แสดงยอดต่าง ๆ
  const subTotalEl = document.querySelector(".subtotal-price");
  const shippingEl = document.querySelector(".shipping-price");
  const grandTotalEl = document.querySelector(".grand-total-price");
  const discountEl = document.querySelector(".discount-price");
  const discountRow = document.querySelector(".discount-row");
  if (!subTotalEl || !shippingEl || !grandTotalEl) return;
  // 2. วน checkbox ที่ถูก tick เพื่อรวมราคาและจำนวน
  const checkedBoxes = document.querySelectorAll(".item-checkbox:checked");
  let totalPrice = 0;
  let totalQty = 0;
  checkedBoxes.forEach((checkbox) => {
    const row = checkbox.closest(".cart-item-row");
    const index = row.dataset.index;
    const item = cart[index];
    totalPrice += item.price * item.qty;
    totalQty += item.qty;
  });
  // 3. คำนวณ shipping, discount (ไม่เกินยอดสินค้า), grand total
  const shippingFee = totalQty * 1.50;
  let actualDiscount = 0;
  if (totalPrice > 0 && discountAmount > 0) {
    actualDiscount = Math.min(discountAmount, totalPrice);
  }
  const grandTotal = totalPrice + shippingFee - actualDiscount;
  subTotalEl.textContent = totalPrice.toFixed(2);
  shippingEl.textContent = shippingFee.toFixed(2);
  grandTotalEl.textContent = grandTotal.toFixed(2);
  // 4. แสดง/ซ่อน discount row ตามมีส่วนลดหรือไม่
  if (discountRow) {
    if (actualDiscount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = "-" + actualDiscount.toFixed(2);
    } else {
      discountRow.style.display = "none";
    }
  }
}

/* ============================================================
   FUNCTION: initVoucher
   หน้าที่: ผูก event form กรอก voucher code
           code "1234" → ลด $50, code อื่น → แจ้ง invalid
   เรียกใช้: ตอน page === "cartList"
   step: 1. ดึง form voucher
         2. ผูก event submit ตรวจสอบ code และตั้ง discountAmount
         3. เรียก updateSummary() เพื่ออัปเดตยอด
   เชื่อมกับ: .voucher form, input[type='text'], .discount-row, .discount-price
   ============================================================ */
function initVoucher() {
  // 1. ดึง form voucher
  const voucherForm = document.querySelector(".voucher form");
  if (!voucherForm) {
    console.log("Voucher form not found");
  }
  // 2. ผูก event submit ตรวจสอบ code
  voucherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = voucherForm.querySelector("input[type='text']");
    const discountRow = document.querySelector(".discount-row");
    const discountEl = document.querySelector(".discount-price");
    const code = input.value.trim();
    if (code === "1234") {
      // code ถูก → ตั้งส่วนลด $50 และแสดง discount row
      discountAmount = 50;
      alert("Coupon is activated! You got $50 off!");
      discountRow.style.display = "flex";
      discountEl.textContent = "-50.00";
      input.value = "";
    } else {
      // code ผิด → รีเซ็ตส่วนลดและซ่อน discount row
      discountAmount = 0;
      alert("Invalid coupon code");
      discountRow.style.display = "none";
    }
    // 3. อัปเดตยอดรวม
    updateSummary();
  });
}

/* ============================================================
   FUNCTION: initCheckoutModal
   หน้าที่: ผูก event เปิด/ปิด modal checkout และยืนยัน order
           เมื่อยืนยัน จะลบเฉพาะสินค้าที่ถูก tick ออกจาก cart
   เรียกใช้: ตอน page === "cartList"
   step: 1. ดึง element modal และปุ่มต่าง ๆ
         2. ผูก event เปิด modal → โหลดข้อมูลใน modal
         3. ผูก event ปิด modal (ปุ่ม X และกดพื้นหลัง)
         4. ผูก event ปุ่มยืนยัน → ลบสินค้าและรีเฟรช cart
   เชื่อมกับ: #checkoutModal, #closeModal, .btnCheckOut button,
              #confirmOrder
   ============================================================ */
function initCheckoutModal() {
  // 1. ดึง element modal และปุ่มต่าง ๆ
  const modal = document.getElementById("checkoutModal");
  const closeBtn = document.getElementById("closeModal");
  const checkoutBtn = document.querySelector(".btnCheckOut button");
  const confirmBtn = document.getElementById("confirmOrder");
  const checkedBoxes = document.querySelectorAll(".item-checkbox:checked");
  if (!modal || !checkoutBtn) return;
  // 2. ปุ่ม "PROCEED TO CHECKOUT" → โหลดข้อมูลและเปิด modal
  checkoutBtn.addEventListener("click", () => {
    loadModalData();
    modal.classList.add("active");
  });
  // 3. ปุ่ม X → ปิด modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
  // กดพื้นหลังดำ (overlay) → ปิด modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
  // 4. ปุ่มยืนยัน order → ลบสินค้าที่ tick ออกจาก cart
  confirmBtn.addEventListener("click", () => {
    console.log("checkedItems:", checkedItems);
    console.log("cart ก่อนลบ:", cart);
    if (checkedItems.size === 0) {
      alert("Please select at least one item");
      return;
    }
    alert("Order confirmed! Thank you for shopping.");
    modal.classList.remove("active");
    // กรองเอาเฉพาะสินค้าที่ไม่ได้ถูก tick ไว้
    const remainingItems = cart.filter(item => !checkedItems.has(item.id));
    console.log("remainingItems:", remainingItems);
    // อัปเดต cart array แบบ in-place (ไม่สร้างใหม่)
    cart.length = 0;
    remainingItems.forEach(item => cart.push(item));
    console.log("cart หลังลบ:", cart);
    discountAmount = 0;
    checkedItems.clear();
    saveCart();
    renderCartPage();
    updateCartCount();
    modal.classList.remove("active");
  });
  const indexesToRemove = [];
  checkedBoxes.forEach((checkbox) => {
    const row = checkbox.closest(".cart-item-row");
    indexesToRemove.push(Number(row.dataset.index));
  });
  if (checkedBoxes.length === 0) {
    alert("Please select at least one item");
    return;
  }
  // ลบจากท้ายไปหน้าเพื่อไม่ให้ index เพี้ยน
  indexesToRemove.sort((a, b) => b - a);
  indexesToRemove.forEach(index => {
    cart.splice(index, 1);
  });
  discountAmount = 0;
  checkedItems.clear();
  saveCart();
  renderCartPage();
  updateCartCount();
  modal.classList.remove("active");
}

/* ============================================================
   FUNCTION: loadModalData
   หน้าที่: โหลดข้อมูลที่อยู่และสินค้าที่เลือกลงใน modal checkout
           คำนวณยอดรวม shipping discount และ grand total
   เรียกใช้: ก่อนเปิด modal checkout ทุกครั้ง
   step: 1. ดึงรายการที่อยู่จาก localStorage แสดงใน modal
         2. ดึงสินค้าที่ถูก tick แสดงรายการและคำนวณยอด
         3. แสดงยอด subtotal, shipping, discount, grand total
   เชื่อมกับ: #modalAddress, #modalItems, #modalSubtotal,
              #modalShipping, #modalDiscount, #modalTotal,
              .item-checkbox:checked
   ============================================================ */
function loadModalData() {
  // 1. ดึงรายการที่อยู่จาก localStorage และสร้าง radio list
  const addList = JSON.parse(localStorage.getItem("addList")) || [];
  const modalAddress = document.getElementById("modalAddress");
  if (addList.length === 0) {
    modalAddress.innerHTML = `<p>No address. Please add one first.</p>`;
  } else {
    let addressHTML = "";
    addList.forEach((add, index) => {
      const checked = index === 0 ? "checked" : "";
      addressHTML += `
        <label class="address-option">
          <input type="radio" name="selectedAddress" value="${index}" ${checked}>
          <div>
            <p><strong>${add.addName} ${add.addSurename}</strong></p>
            <p>${add.addHouse} ${add.addMoo} ${add.addSubdist}</p>
            <p>${add.addDist} ${add.addProv} ${add.addZip}</p>
            <p>Tel: ${add.addTel}</p>
          </div>
        </label>
      `;
    });
    modalAddress.innerHTML = addressHTML;
  }
  // 2. ดึงสินค้าที่ถูก tick และสร้าง HTML รายการ + สะสมยอด
  const modalItems = document.getElementById("modalItems");
  const checkedBoxes = document.querySelectorAll(".item-checkbox:checked");
  let itemsHTML = "";
  let totalPrice = 0;
  let totalQty = 0;
  checkedBoxes.forEach((checkbox) => {
    const row = checkbox.closest(".cart-item-row");
    const index = row.dataset.index;
    const item = cart[index];
    totalPrice += item.price * item.qty;
    totalQty += item.qty;
    itemsHTML += `
      <div class="modal-row">
        <span>${item.name} x${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
  });
  modalItems.innerHTML = itemsHTML || "<p>No items selected</p>";
  // 3. คำนวณและแสดงยอดรวมทั้งหมดใน modal
  const shippingFee = totalQty * 1.50;
  const actualDiscount = totalPrice > 0
    ? Math.min(discountAmount, totalPrice)
    : 0;
  const grandTotal = totalPrice + shippingFee - actualDiscount;
  document.getElementById("modalSubtotal").textContent = "$" + totalPrice.toFixed(2);
  document.getElementById("modalShipping").textContent = "$" + shippingFee.toFixed(2);
  document.getElementById("modalDiscount").textContent = "-$" + actualDiscount.toFixed(2);
  document.getElementById("modalTotal").textContent = "$" + grandTotal.toFixed(2);
}


/* ============================================================
   DELIVERY PAGE
   ============================================================ */

/* ============================================================
   FUNCTION: initModal
   หน้าที่: ผูก event ปุ่ม "Add New Address" และปุ่ม Cancel
           เพื่อเปิด/ปิด form กรอกที่อยู่ใหม่
   เรียกใช้: ตอน page === "deliveryAddress"
   step: 1. ดึง element ปุ่มทั้งสอง
         2. ผูก event click เชื่อมกับ closeModalAdd / openModalAdd
   เชื่อมกับ: #add-NewAddress, #ccBtn
   ============================================================ */
function initModal() {
  // 1. ดึง element ปุ่ม Add New Address และ Cancel
  const addAdr = document.getElementById("add-NewAddress");
  const cancleBtn = document.getElementById("ccBtn");
  if (!addAdr || !cancleBtn) return;
  // 2. ผูก event: กด Add → ซ่อนปุ่ม / เปิด form, กด Cancel → กลับ
  addAdr.addEventListener('click', closeModalAdd);
  cancleBtn.addEventListener('click', openModalAdd);
}

/* ============================================================
   FUNCTION: closeModalAdd
   หน้าที่: ซ่อนปุ่ม "Add New Address" และเปิด form กรอกที่อยู่
   เรียกใช้: เมื่อกดปุ่ม Add New Address
   step: เพิ่ม class "close" ให้ปุ่ม / เพิ่ม class "open" ให้ form และ showWhenaddBtn
   เชื่อมกับ: #add-NewAddress, #formDelivery, #showWhenaddBtn
   ============================================================ */
function closeModalAdd() {
  const addAdr = document.getElementById("add-NewAddress");
  const formDelivery = document.getElementById("formDelivery");
  const showWhenaddBtn = document.getElementById("showWhenaddBtn");
  addAdr.classList.add("close");
  formDelivery.classList.add("open");
  showWhenaddBtn.classList.add("open");
}

/* ============================================================
   FUNCTION: openModalAdd
   หน้าที่: แสดงปุ่ม "Add New Address" และซ่อน form กรอกที่อยู่
           (สถานะเริ่มต้น / หลังกด Cancel หรือ Submit)
   เรียกใช้: เมื่อกดปุ่ม Cancel หรือหลัง submit form สำเร็จ
   step: ลบ class "close" จากปุ่ม / ลบ class "open" จาก form และ showWhenaddBtn
   เชื่อมกับ: #add-NewAddress, #formDelivery, #showWhenaddBtn
   ============================================================ */
function openModalAdd() {
  const addAdr = document.getElementById("add-NewAddress");
  const formDelivery = document.getElementById("formDelivery");
  const showWhenaddBtn = document.getElementById("showWhenaddBtn");
  addAdr.classList.remove("close");
  formDelivery.classList.remove("open");
  showWhenaddBtn.classList.remove("open");
}

/* ============================================================
   FUNCTION: formDeliveryPat
   หน้าที่: จัดการ form กรอกที่อยู่จัดส่ง
           บันทึก/แสดง/ลบรายการที่อยู่ใน localStorage
   เรียกใช้: ตอน page === "deliveryAddress"
   step: 1. ดึง input fields และ element รายการที่อยู่
         2. inner function saveAdd() บันทึก addList ลง localStorage
         3. inner function renderAddress() วน loop แสดงรายการที่อยู่
         4. ผูก event click ปุ่ม ❌ สำหรับลบที่อยู่
         5. ผูก event submit form เพื่อเพิ่มที่อยู่ใหม่
   เชื่อมกับ: #adName, #adSurename, #adHouse, #adMoo, #adSubdist,
              #adDist, #adProv, #adZip, #adTel,
              #formDelivery, #currentAdd, .deleteBtn
   ============================================================ */
function formDeliveryPat() {
  // 1. ดึง input fields และ element ที่ต้องใช้
  const adName = document.getElementById("adName");
  const adSurename = document.getElementById("adSurename");
  const adHouse = document.getElementById("adHouse");
  const adMoo = document.getElementById("adMoo");
  const adSubdist = document.getElementById("adSubdist");
  const adDist = document.getElementById("adDist");
  const adProv = document.getElementById("adProv");
  const adZip = document.getElementById("adZip");
  const adTel = document.getElementById("adTel");
  const formDelivery = document.getElementById("formDelivery");
  const currentAdd = document.getElementById('currentAdd');
  const addList = JSON.parse(localStorage.getItem('addList')) || [];
  if (!adName || !adSurename || !adHouse || !adMoo || !adSubdist || !adDist || !adProv || !adZip || !adTel || !formDelivery || !currentAdd) return;
  // 2. inner function: บันทึก addList ลง localStorage
  const saveAdd = () => {
    localStorage.setItem('addList', JSON.stringify(addList));
  };
  // 3. inner function: ล้างและ render รายการที่อยู่ทั้งหมดใหม่
  const renderAddress = () => {
    currentAdd.innerHTML = "";
    addList.forEach((add, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="saveAddress">
          <input type="radio" name="radio">
          <div class="infoAddress">
          <p>${add.addName} ${add.addSurename} ${add.addHouse} ${add.addMoo} ${add.addSubdist} ${add.addDist} ${add.addProv} ${add.addTel}</p>
          </div>
          <button class="deleteBtn" data-index="${index}">❌</button>
        </div>
      `;
      currentAdd.appendChild(li);
    });
  };
  // 4. ผูก event ปุ่ม ❌ ผ่าน event delegation บน currentAdd
  currentAdd.addEventListener("click", (e) => {
    const xBtn = e.target.closest(".deleteBtn");
    if (!xBtn) return;
    const indexDel = xBtn.dataset.index;
    addList.splice(indexDel, 1);
    saveAdd();
    renderAddress();
  });
  // 5. ผูก event submit form เก็บที่อยู่ใหม่และ render รายการ
  formDelivery.addEventListener("submit", (e) => {
    e.preventDefault();
    const newAddress = {
      addName: adName.value,
      addSurename: adSurename.value,
      addHouse: adHouse.value,
      addMoo: adMoo.value,
      addSubdist: adSubdist.value,
      addDist: adDist.value,
      addProv: adProv.value,
      addZip: adZip.value,
      addTel: adTel.value,
    };
    addList.push(newAddress);
    saveAdd();
    renderAddress();
    formDelivery.reset();
    openModalAdd();
  });
}


/* ============================================================
   ROUTER — เช็ค data-page และเรียกฟังก์ชันตามหน้า
   ============================================================ */

const page = document.body.dataset.page;

updateCartCount();
updateSummary();

if (page === "main") {
  initSliderpic();
  initAddToCart();
  initFilter();
}

if (page === "deliveryAddress") {
  initModal();
  formDeliveryPat();
}

if (page === "cartList") {
  renderCartPage();
  initVoucher();
  initCheckoutModal();
}
