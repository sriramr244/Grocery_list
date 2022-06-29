

const grocery_item_addButton = document.querySelector('.grocery_item_add_button');

const grocery_item_IP = document.querySelector('.grocery_item');

const To_buy_List_OP = document.querySelector('.To_buy_List');

const filter_option = document.querySelector('.to_buy');

const quantity_ip = document.querySelector('.quantity_item');
var global_storage=[];

var global_grocery_list=[]

var add_url = 'https://grocerylistapp.azurewebsites.net/groceryList';


//event listener

document.addEventListener("DOMContentLoaded", getToBuys);

//document.addEventListener("DOMContentLoaded", user_append);

grocery_item_addButton.addEventListener('click', add_Grocery_item);
To_buy_List_OP.addEventListener('click', deleteCheck);
filter_option.addEventListener('click', filterTodo);


//functions

//get from URL
async function get_all_groceries(){

    global_grocery_list=[]

    let tobuys;
    get_url = 'https://grocerylistapp.azurewebsites.net/groceryList'
    fetch(get_url)
    .then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("NETWORK RESPONSE ERROR");
    }
    })
    .then(data => {
    append_to_buy(data)
    })
    .catch((error) => console.error("FETCH ERROR:", error));

    function append_to_buy(d){

        if (d === null){
            tobuys = [];
        }
        else{
            tobuys = d;
        }
        tobuys.forEach(function(tobuy){
            local_Storage = {};
            local_Storage['itemName'] = tobuy.itemName;
            local_Storage['itemQuantity'] = tobuy.itemQuantity;
            local_Storage['purchased'] = tobuy.purchased;
            local_Storage['userId'] = tobuy.userId;
            local_Storage['itemId'] = tobuy.itemId;
        global_grocery_list.push(local_Storage);
        });
}}

function add_Grocery_item(event){


    local_Storage={}
    //prevent form from submitting
    event.preventDefault();

    
    //create a to_Buy Div in js and add a classlits
    const to_Buy_Div = document.createElement('div');
    to_Buy_Div.classList.add('To_buy');

    const to_Buy_Li = document.createElement('li');
    to_Buy_Li.innerText = grocery_item_IP.value + '('+String(quantity_ip.value)+')';
    local_Storage['itemName'] = grocery_item_IP.value;
    local_Storage['itemQuantity'] = quantity_ip.value;
    local_Storage['purchased'] = false;
    local_Storage['userId'] = 1;

    
    to_Buy_Li.classList.add('to_Buy_item');

    //making to_buy_li to come inside to_Buy_divx

    to_Buy_Div.appendChild(to_Buy_Li);

    

    //Ispurchased button
    const is_purchased = document.createElement('button');
    is_purchased.innerHTML = '<i class = "fas fa-check"></i>';
    is_purchased.classList.add('is_purchased_button');
    to_Buy_Div.appendChild(is_purchased);

    //Rem_groc button
    const Rem_groc = document.createElement('button');
    Rem_groc.innerHTML = '<i class = "fas fa-trash"></i>';
    Rem_groc.classList.add('Rem_groc_button');
    to_Buy_Div.appendChild(Rem_groc);

    
    //api calls 
    /*
    var xhr = new XMLHttpRequest();
    xhr.open("POST", add_url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(local_Storage));*/
    var response_post_id;
    fetch(add_url,{method:"POST", 
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(local_Storage)})
        .then(response => response.json())
        .then(data => {response_post_id=append_data(data)});
    function append_data(data){
        response_post_id = data.itemId;
        return response_post_id;
    }
    to_Buy_Div.setAttribute('id', response_post_id);
    To_buy_List_OP.appendChild(to_Buy_Div);
    
    
    grocery_item_IP.value = "";
    quantity_ip.value = null;
    global_storage.push(local_Storage);

    get_all_groceries();
}


function deleteCheck(e){

    const item = e.target;
    //Delete

    if(item.classList[0] === 'Rem_groc_button'){
        const to_buy = item.parentElement;
        to_buy.classList.add('delete_transition');
        delete_url = 'https://grocerylistapp.azurewebsites.net/groceryList/';
        
        id = to_buy.id;
        url = delete_url+String(id);
        fetch(url,{method:'DELETE'})
        remove_local_items(to_buy);
        get_all_groceries();
        to_buy.addEventListener('transitionend', function(){
            to_buy.remove();
        })
        
    }

    if(item.classList[0] === 'is_purchased_button'){
        const to_buy = item.parentElement;
        to_buy.classList.add('purchased');
        purchased_url = 'https://grocerylistapp.azurewebsites.net/groceryList/purchased/';
        id = to_buy.id;
        
        
        url = purchased_url+String(id);
        fetch(url)

        get_all_groceries();

    }
}

function filterTodo(e){
    const tobuys = To_buy_List_OP.childNodes;
    tobuys.forEach(function(tobuy){
        switch(e.target.value){
            case "all":
                tobuy.style.display = 'flex';
                break;
            case "purchased":
                
                if (tobuy.classList.contains('purchased')){
                    tobuy.style.display = 'flex';
                }else{
                    tobuy.style.display = 'none';
                }
                break;
            case "tobebought":
                if (!tobuy.classList.contains('purchased')){
                    tobuy.style.display = "flex";
                }else{
                    tobuy.style.display = "none";}
                break;
        }


    });

}

/*
function saveToBuys(tobuy){
    //check -the things are already present?
    let tobuys;
    if (localStorage.getItem('tobuys') === null){
        tobuys = []
    }
    else{
        tobuys = JSON.parse(localStorage.getItem('tobuys'));
    }

    tobuys.push(tobuy);

    localStorage.setItem('tobuys', JSON.stringify(tobuys));

}*/

function getToBuys(){
    let tobuys;
    get_url = 'https://grocerylistapp.azurewebsites.net/groceryList'
    fetch(get_url)
    .then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("NETWORK RESPONSE ERROR");
    }
    })
    .then(data => {
    append_to_buy(data)
    })
    .catch((error) => console.error("FETCH ERROR:", error));

    function append_to_buy(d){

        if (d === null){
            tobuys = [];
        }
        else{
            tobuys = d;
        }

        tobuys.forEach(function(tobuy){
            local_Storage = {};
            local_Storage['itemName'] = tobuy.itemName;
            local_Storage['itemQuantity'] = tobuy.itemQuantity;
            local_Storage['purchased'] = tobuy.purchased;
            local_Storage['userId'] = tobuy.userId;
            local_Storage['itemId'] = tobuy.itemId;
            //create a to_Buy Div in js and add a classlits
            const to_Buy_Div = document.createElement('div');
            to_Buy_Div.classList.add('To_buy');
            to_Buy_Div.classList.add(tobuy.itemId);


            const to_Buy_Li = document.createElement('li');
            to_Buy_Li.innerText = tobuy.itemName + '(' + String(tobuy.itemQuantity)+')';

            to_Buy_Li.classList.add('to_Buy_item');

            //making to_buy_li to come inside to_Buy_divx

            to_Buy_Div.appendChild(to_Buy_Li);

            //Ispurchased button
            const is_purchased = document.createElement('button');
            is_purchased.innerHTML = '<i class = "fas fa-check"></i>';
            is_purchased.classList.add('is_purchased_button');
            to_Buy_Div.appendChild(is_purchased);

            //Rem_groc button
            const Rem_groc = document.createElement('button');
            Rem_groc.innerHTML = '<i class = "fas fa-trash"></i>';
            Rem_groc.classList.add('Rem_groc_button');
            to_Buy_Div.appendChild(Rem_groc);

            if (tobuy.purchased == true){
                to_Buy_Div.classList.add('purchased');
            }
            to_Buy_Div.setAttribute('id', tobuy.itemId);

            To_buy_List_OP.appendChild(to_Buy_Div);
            global_storage.push(local_Storage);
            get_all_groceries()
    });}
}

function remove_local_items(tobuy){
    let tobuys;
    if (localStorage.getItem('tobuys') === null){
        tobuys = []
    }
    else{
        tobuys = JSON.parse(localStorage.getItem('tobuys'));
    }
    tobuys.splice(tobuys.indexOf(tobuy.children[0].innerText), 1);
    localStorage.setItem('tobuys', JSON.stringify(tobuys));
    
}
//get all the users from the GET id

/*
function user_append(){
    let users;
    user_url = "https://grocerylistapp.azurewebsites.net/users";
    data = get_from_URL(user_url);
    if (data === null){
        users = ['Arbitary_user'];
    }
    else{
        console.log(data);
    }
}
*/