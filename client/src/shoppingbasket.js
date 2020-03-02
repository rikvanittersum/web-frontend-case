function payButtonClicked(event){
    const orders = {...localStorage};
    
    fetch("api/placeorder", {method: 'POST', headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(orders)})
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }        
    })   

    localStorage.clear();
    window.location.replace("orderplaced.html");
}

function cancelButtonClicked(event){
    let parent = event.target.parentNode;
    let park = parent.children[0].innerText;

    localStorage.removeItem(park);
    window.location.reload(true);
}

function init_page(){
    let template = document.getElementsByTagName("template")[0];
    let article = template.content.querySelector("article");
    const items = {...localStorage};

    for (let item in items) {
        if (item != "nrOfOrders"){
        
            orderItemList = [item, JSON.parse(items[item])[0], JSON.parse(items[item])[1], JSON.parse(items[item])[2]];
            
            let a = document.importNode(article, true);
            let divs = a.querySelectorAll("div");

            for (let i = 0; i < divs.length; i++) {
                divs[i].textContent += orderItemList[i];
                a.appendChild[i];
                document.body.appendChild(a);
            }
        }
    }

    let payButton = document.getElementById("finalizepaymentbutton");
    let buttons = document.querySelectorAll("button");

    for (let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", cancelButtonClicked);
    }

    payButton.addEventListener("click", payButtonClicked);

    let ticketsInBasket = localStorage.getItem("nrOfOrders");
    if (ticketsInBasket == null){
      ticketsInBasket = 0;
    }
    document.getElementsByClassName("badge")[0].innerText = parseInt(ticketsInBasket);
}

init_page();