//selecting elements
const alert= document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
const clearBtn = document.querySelector(".clear-btn")

//edit
let editElement;
let editFlag = false;
let editID ="";

//event listner
//form
form.addEventListener("submit", addItem);
//clear btn
clearBtn.addEventListener("click",clearItems);
////load item
window.addEventListener("DOMContentLoaded",setupItems);
//setup items

//function
function addItem(e){
    e.preventDefault(); 
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createListItem (id, value);
                    //display alert
                    displayAlert("Item added successfully!", "success"); 
                    //show container
                    container.classList.add("show-container")
                    //add to local storage
                    addToLocalStorage(id,value);
                    //set back to defalut
                    setBackToDefault();
                    grocery.value = "";
    }
    else if( value && editFlag ){editElement.innerHTML=value;
        displayAlert("Item updated!", "success");
        //edit local storage
        editLocalStorage(editID,value);
        setBackToDefault();
        grocery.value = "";

    }else{displayAlert("please enter value","danger")
    }

}
//display alert
function displayAlert(text,action){
    alert.textContent =text;
    //alert.classList.add(`alert${action}`);
    alert.classList.add(`alert-${action}`);

//remove alert
setTimeout(function(){
    alert.textContent =" ";
    alert.classList.remove(`alert-${action}`);
},1000)
}
//clear items
function clearItems(){
    const items = document.querySelectorAll(".grocery-item")
    if (items.length > 0 ) {items.forEach(function(item){
        list.removeChild(item);
    })
        
    }
    container.classList.remove("show-container");
    displayAlert("List cleared.", "danger");
    setBackToDefault();
    localStorage.removeItem("list");

}
//delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id =element.dataset.id;
    list.removeChild(element);
    container.classList.remove("show-container")
    displayAlert("item removed","danger");
    setBackToDefault();
    //remove from local storage
   removerFromLocalStorage(id);
}
//edit function
//edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //set edit element
  editElement = e.currentTarget.parentElement.previousElementSibling;
  ////set form values
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent ="edit";
}

//set back to default

function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}
//local storage
function addToLocalStorage(id,value){
    const grocery ={id,value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list",JSON.stringify(items));
    //  createListItem (id, value);
    //console.log("added ");
}
function removerFromLocalStorage(id){
    let items =getLocalStorage();
    items = items.filter(function(item){
        if(item.id !==id){
            return item
        }
    })
    localStorage.setItem("list",JSON.stringify(items));
    removeListItem(id);
}
function editLocalStorage(id,value){
    let items = getLocalStorage()
    items =items.map(function(item){
        if(item.id ===id){
            item.value=value;
        }
        return item;
 
    })
     localStorage.setItem("list",JSON.stringify(items)); 
}
function getLocalStorage() {
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function setupItems(){
    let items = getLocalStorage();
    if( items.length>0){
        items.forEach(function(item){
           createListItem(item.id, item.value); 
        })
container.classList.add("show-container")
 const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", deleteItem);
    });
}
}
function createListItem(id,value){
    const element = document.createElement("article");
    //addclass
    element.classList.add("grocery-item")
    //add id
    const attr =document.createAttribute("data-id");
    attr.value =id;
    element.setAttributeNode(attr);
    element.innerHTML =` <p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                            <!-- <i class="fa-regular fa-pen-to-square"></i> -->
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                            <!-- <i class="fa-solid fa-trash"></i> -->
                        </button>
                    </div>`
                    const deleteBtn = element.querySelector(".delete-btn");
                    const editBtn = element.querySelector(".edit-btn");

                    deleteBtn.addEventListener("click",deleteItem);
                    editBtn.addEventListener("click",editItem);
                    //append chlid
                    list.appendChild(element);
}
function removeListItem(id) {
  const element = document.querySelector(`[data-id="${id}"]`);
  if (element) {
    list.removeChild(element);
  }
}
