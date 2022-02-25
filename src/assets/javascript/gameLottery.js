"use strict";

let json;
let ajax = new XMLHttpRequest();
ajax.open("GET", "src/assets/gameRules/games.json", false)
ajax.onreadystatechange = function(){
  if(ajax.readyState === 4 && ajax.status === 200) {
    json = JSON.parse(ajax.responseText)
  }
}
ajax.send();

let descriptionBet = document.querySelector("h3");
let containerListBets = document.querySelector('.container_cards_bets');

let title_bet = document.querySelector('[data-js="main_title_bet"]');
let numbersSelections = document.querySelector('[data-js="numbers_selections"]');
let bets_type = document.querySelector('[data-js="bets_type"]');
let btnClearGame = document.querySelector('[data-js="btn_clear_game"]');
let btnCompleteGame = document.querySelector('[data-js="btn_complete_game"]')
let btnAddToCart = document.querySelector('[data-js="btn_add_cart"]');
let selectedNumbers = document.querySelector('[data-js="selected_numbers"]');
let cartBetTitle = document.querySelector('[data-js="cart_title_bet_type"]');
let costBetValue = document.querySelector('[data-js="cost_bet_value"]');
let infoContainerBet = document.querySelector('[data-js="info_container_bet"]');
let amountTotalCost = document.querySelector('[data-js="amount_total_cost"]');
let saveLottery = document.querySelector('[data-js="save_action"]');


let contentOnButtonNumber;
var numbersSelected = [];
let totalAmountBets = [];
let verificationTrue;
let rangeBetType;
let rangeBet;
let whichBetNum = 0;
let allNumbersBet;
let indexRemovedFromBet;


let buttonsNumber = []
function addNumbers(i, range) {
  verificationTrue = numbersSelected.some(function(item){
    return item === ` ${i}`
  })


  
  if(verificationTrue) {
    buttonsNumber[i].style.backgroundColor = "#ADC0C4";
    
    indexRemovedFromBet = numbersSelected.indexOf(` ${buttonsNumber[i].innerHTML}`)
    numbersSelected.splice(indexRemovedFromBet, 1);
    
  }

  adicionandoNumeros(i, range)
  return verificationTrue
}

function adicionandoNumeros(i, range) {
  if(!verificationTrue) {
    if(numbersSelected.length < json.types[range]["max-number"]) {
        numbersSelected.push(` ${i}`)
        buttonsNumber[i].style.backgroundColor = json.types[range].color;
    }
  }
}

let betType = [];
let betContent;

function showBets() {
  for(let i = 0; i < json.types.length; i++) {
    betType[i] = document.createElement("button")
    betContent = document.createTextNode(`${json.types[i].type}`)
    betType[i].appendChild(betContent)
    bets_type.appendChild(betType[i])
  
    betType[i].style.borderColor = json.types[i].color;
    betType[i].style.color = json.types[i].color;
    
  
    betType[i].onclick = () => startLottery(i)
  }
}

function startLottery(i) {
  
  title_bet.innerHTML = ` FOR ${(json.types[i].type).toUpperCase()}`;

  betType[whichBetNum].style.backgroundColor = "#fff";
  betType[whichBetNum].style.color = json.types[whichBetNum].color;

  betType[i].style.backgroundColor = json.types[i].color;
  betType[i].style.color = "#fff";

  
  while(numbersSelections.firstChild) {
    numbersSelections.removeChild(numbersSelections.firstChild)
  }

  descriptionBet.innerHTML = json.types[i].description;
  numbersSelected = []
  rangeBetType = i;
  allNumbersBet = json.types[i].range;

  for(let j = 1; j <= json.types[i].range; j++) {
    buttonsNumber[j] = document.createElement("button")
    contentOnButtonNumber = document.createTextNode(`${j}`)
    buttonsNumber[j].appendChild(contentOnButtonNumber)
    numbersSelections.appendChild(buttonsNumber[j])
    buttonsNumber[j].onclick = () => addNumbers(j, i);
  }

  whichBetNum = i
  return whichBetNum
}

btnClearGame.onclick = function() {
  startLottery(whichBetNum);
  deleteBet(counterId)
}

btnCompleteGame.onclick = function() {
  startLottery(whichBetNum);
  let maxBet = json.types[rangeBetType]["max-number"]
  let randomNumber

  for(let counter = 0; numbersSelected.length < maxBet; counter++ ) {
    randomNumber = Math.random() * (allNumbersBet - 1) + 1;

    addNumbers(Math.round(randomNumber), rangeBetType)
  }
}


let amount = 0;
let counterId = 0;
let displayBetOnCart;
btnAddToCart.onclick = function() {
  let lengthBet = json.types[rangeBetType]["max-number"];
  let priceBet = (json.types[rangeBetType].price).toFixed(2)
  
  
  if(numbersSelected.length !== lengthBet) {
    alert("Tá faltando número")
    return
  }

  amount += json.types[rangeBetType].price;
  amountTotalCost.innerText = amount.toFixed(2).replace(".", ",");
  

  numbersSelected = numbersSelected.map(function(item){
    return Number(item)
  }).sort(function(a,b){return a-b})

  displayBetOnCart = numbersSelected.map(function(item){
    return " " + item
  })
  
  totalAmountBets.push(
    `<div class="card_bet" onclick="this">
      <button class="btn_icon_trash"  onclick="deleteBet(${counterId})">
        <span data-js="btn_delete_bet" class="icon-trash-o"></span>
      </button>
      <div data-js="info_container_bet" class="info_container_bet" style="border-color:${json.types[rangeBetType].color}">
        <h3 data-js="selected_numbers" class="numbers_bet">${displayBetOnCart}</h3>
        <h3 data-js="cart_title_bet_type" class="cart_title_bet_type" style="color:${json.types[rangeBetType].color}">${json.types[rangeBetType].type}</h3>
        <span data-js="cost_bet_value" class="single_bet_cost_value">R$ ${priceBet.replace(".", ",")}</span>
      </div>
    </div>`
  )

  containerListBets.innerHTML += `\n ${totalAmountBets[counterId]}`;
  
  counterId++
  updateList()
  numbersSelected = [];
  startLottery(whichBetNum);
}

saveLottery.onclick = function() {
  if(amount >= json["min-cart-value"]) {
    totalAmountBets = [];
    updateList();
    amount = 0;
    amountTotalCost.innerText = amount.toFixed(2);
    return alert("Aposta realizada com sucesso!")
  }
  return alert(`Aposta mínima tem que ser de R$ ${json["min-cart-value"].toFixed(2).replace(".", ",")} reais`)
}

function updateList() {
  containerListBets.innerHTML = "";

  totalAmountBets.forEach(function(item){
    containerListBets.innerHTML += `\n ${item}`;

  })

}

function deleteBet(counterId) {
  let convertToNumber = totalAmountBets[counterId].match(/\s\d{1,},\d\d/g);
  convertToNumber = convertToNumber.toString().replace(",", ".");
  amount -= Number(convertToNumber)
  let convertToString = amount;
  amountTotalCost.innerText = convertToString.toFixed(2).replace(".", ",")

  totalAmountBets[counterId] = "";
  updateList()
}


showBets()
startLottery(0)