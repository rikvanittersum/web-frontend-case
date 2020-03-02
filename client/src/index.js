function orderButtonClicked(event){
    let parent = event.target.parentNode.parentNode;
    let park = parent.children[0].innerText;
    let adults = parent.children[2].getElementsByClassName("numberofadults")[0].value;
    let children = parent.children[2].getElementsByClassName("numberofkids")[0].value;
    let totalPrice = parent.querySelector('.total').getElementsByClassName("price")[0].innerText

    
    if (totalPrice ==""){
      totalPrice == 0;
    }
    if (adults == ""){
        adults = 0;
    }

    if (children == ""){
        children = 0;
    }
    saveOrderInShoppingBasket(park, adults, children, totalPrice);
}

function saveOrderInShoppingBasket(park, adults, children, totalPrice){
    console.log(localStorage[park])
    var parkStorage = localStorage[park];

    if (parkStorage == null){
        obj = [parseInt(adults), parseInt(children), totalPrice];
    }

    else{
        adultStorage = JSON.parse(parkStorage)[0];
        chilrdenStorage = JSON.parse(parkStorage)[1];
        totalPriceStorage = JSON.parse(parkStorage)[2];

        obj = [parseInt(adults) + parseInt(adultStorage), parseInt(children) + parseInt(chilrdenStorage), parseFloat(totalPrice) + parseFloat(totalPriceStorage)];
    }
    
    localStorage.setItem(park , JSON.stringify(obj));

    updateTotals(parseInt(adults) + parseInt(children))
  }

function updateTotals(added){
  let totalOrders = localStorage.getItem("nrOfOrders");
  
  if (!totalOrders){
    totalOrders = 0;
  }
  console.log(totalOrders)
  totalOrders = parseInt(totalOrders) + added;
  
  localStorage.setItem("nrOfOrders", parseInt(totalOrders));

  document.getElementsByClassName("badge")[0].innerText = totalOrders;
}

function updateValue(event){
  let parent = event.target.parentNode;

  let total = parent.querySelector('.total').getElementsByClassName("price")[0];
  let adultTicketsOrdered = parent.querySelector('.numberofadults').value;
  let kidsTicketsOrdered  = parent.querySelector('.numberofkids').value;

  if (kidsTicketsOrdered == ""){
    kidsTicketsOrdered = 0;
  }

  if (adultTicketsOrdered == ""){
    adultTicketsOrdered = 0;
  }

  let adultprice = parent.getElementsByClassName("adultprice")[0].getElementsByClassName("price")[0].innerText;
  let kidsprice = parent.getElementsByClassName("kidsprice")[0].getElementsByClassName("price")[0].innerText;
  let requieredForDiscountAdults = parent.getElementsByClassName("adults")[0].innerText;
  let requieredForDiscountKids = parent.getElementsByClassName("child")[0].innerText;
  let percentage = parent.getElementsByClassName("percentage")[0].innerText;
  let discount = (100 - percentage) / 100;

  if (adultTicketsOrdered  < requieredForDiscountAdults  ||  kidsTicketsOrdered < requieredForDiscountKids){
    fullPriceTickets = [adultTicketsOrdered, kidsTicketsOrdered];
  }

  else{
    fullPriceTickets = getNumberOfFullPriceTickets(adultTicketsOrdered, kidsTicketsOrdered, requieredForDiscountAdults, requieredForDiscountKids);
  }

  let fullPriceTicketsAdults = fullPriceTickets[0];
  let fullPriceTicketsKids = fullPriceTickets[1];
  let numberOfDiscountAdulttickets = adultTicketsOrdered - fullPriceTickets[0];
  let numberOfDiscountKidsTickets =  kidsTicketsOrdered - fullPriceTickets[1];

  parent.querySelector('.total').getElementsByClassName("price")[0].innerText = getTotalPrice(discount, numberOfDiscountAdulttickets, 
    adultprice, numberOfDiscountKidsTickets, kidsprice, 
    fullPriceTicketsAdults, fullPriceTicketsKids) 
}

function getNumberOfFullPriceTickets(adultTickets, kidtickets, adultTicketsRequiered, kidTicketsRequiered){
  if (adultTickets < adultTicketsRequiered ||  kidtickets < kidTicketsRequiered){
    return [adultTickets, kidtickets];
  }

  let newFullPriceAdults = adultTickets - adultTicketsRequiered;
  let newFullPriceKids = kidtickets - kidTicketsRequiered;

  return getNumberOfFullPriceTickets(newFullPriceAdults, newFullPriceKids, adultTicketsRequiered, kidTicketsRequiered);
}

function getTotalPrice(discount, numberOfDiscountAdulttickets, adultprice, numberOfDiscountKidsTickets, kidsprice, 
  fullPriceTicketsAdults, fullPriceTicketsKids){

  let totalPrice = discount * (numberOfDiscountAdulttickets * adultprice + numberOfDiscountKidsTickets * kidsprice) 
  + fullPriceTicketsAdults  * adultprice + fullPriceTicketsKids * kidsprice; 
  
  return totalPrice.toFixed(2);
}

function initpage(){

  let ticketsInBasket = localStorage.getItem("nrOfOrders");
  if (ticketsInBasket == null){
    ticketsInBasket = 0;
  }
  document.getElementsByClassName("badge")[0].innerText = parseInt(ticketsInBasket);
  let  template = document.getElementsByTagName("template")[0];
  let article = template.content.querySelector("article");

  fetch("api/attractions")
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        response.json().then(function(data) {
          for (item in data){

            let a = document.importNode(article, true);
            let parkname = a.getElementsByClassName("parkname")[0];
            let parkdescription = a.getElementsByClassName("parkdescription")[0];
            let adultprice = a.getElementsByClassName("adultprice")[0].getElementsByClassName("price")[0];
            let kidsprice= a.getElementsByClassName("kidsprice")[0].getElementsByClassName("price")[0];
            let discountrequirementAdults = a.getElementsByClassName("adults")[0];
            let discountrequirementChildren = a.getElementsByClassName("child")[0];
            let percentage = a.getElementsByClassName("percentage")[0];
            let orderButton = a.getElementsByClassName("orderbutton")[0];

            let numberofadultsbutton = a.getElementsByClassName("numberofadults")[0];
            let numberofkidsbutton = a.getElementsByClassName("numberofkids")[0];

            numberofadultsbutton.addEventListener("input", updateValue);
            numberofkidsbutton.addEventListener("input", updateValue);

            parkname.innerText = data[item].parkname;
            parkdescription.innerText += data[item].description;

            adultprice.innerText = data[item].adultPrice;
            kidsprice.innerText = data[item].kidsPrice;

            discountrequirementAdults.innerText = data[item].minimumNumberOfAdults;
            discountrequirementChildren.innerText = data[item].minimumNumberOfKids;
            percentage.innerText = data[item].discount;

            if (areTicketsAvailable(data[item].available)){
              a.getElementsByClassName("numberofadults")[0].readOnly = true;
              a.getElementsByClassName("numberofadults")[0].placeholder = "Sold out"

              a.getElementsByClassName("numberofkids")[0].readOnly = true;
              a.getElementsByClassName("numberofkids")[0].placeholder = "Sold out"
              
              orderButton.disabled = true;
              orderButton.innerText = "These tickets are unfortunately sold out";
            }

            document.body.appendChild(a);
          } 

          let buttons = document.querySelectorAll("button")

          for (i = 0; i < buttons.length; i++){
              buttons[i].addEventListener("click", orderButtonClicked);
          }
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  }

function areTicketsAvailable(tickets){
  return tickets <= 0;
}

initpage()