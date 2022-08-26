let messages;
let username = "Oscar";
let deliveryTo;
let textMessage;
let typeMessage;

const user = {
    name: username
}


function getParticipants() {
    const getParticipantsPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    getParticipantsPromise.then(verifyParticipants)
}
function verifyParticipants(promise) {
    const participants = promise.data
    const usersContainer = document.querySelector('.users-container');
    console.log(participants)
    console.log(participants[6].name)
    for (let i = 0; i < participants.length; i++) {
        usersContainer.innerHTML += `
        <div class="user-container">
            <div class="icon-name">
                <div class="users"><ion-icon name="person-circle-sharp"></ion-icon></div>
                <span class="send-to">${participants[i].name}</span>
            </div>
            <span class="check hidden"><ion-icon name="checkmark-sharp"></ion-icon></span>
        </div>
        `
    }
}
function openMenu(){
    const element = document.querySelector('.menu')
    element.classList.remove('hidden')
    getParticipants()
}
function processPromise(promise) {
    const messageContainer = document.querySelector(".message-container")
    messages = promise.data
    messageContainer.innerHTML = ''
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === "status") {
            messageContainer.innerHTML += `
            <div class="message-content status">
                <span class="time">(${messages[i].time})&nbsp</span>
                <span class="message-from">${messages[i].from}&nbsp</span>
                <span class="message-text">${messages[i].text}&nbsp</span>
            </div>
            `
        }
        if (messages[i].type === "message") {
            messageContainer.innerHTML += `
            <div class="message-content message">
                <span class="time">(${messages[i].time})&nbsp</span>
                <span class="message-from">${messages[i].from}&nbsp</span>
                <span>para&nbsp</span>
                <span class="message-to">${messages[i].to}</span>
                <span>:&nbsp</span>
                <span class="message-text">${messages[i].text}&nbsp</span>
            </div>
            `
        }
        if (messages[i].type === "private_message") {
            messageContainer.innerHTML += `
            <div class="message-content private-message">
                <span class="time">(${messages[i].time})&nbsp</span>
                <span class="message-from">${messages[i].from}&nbsp</span>
                <span>para&nbsp</span>
                <span class="message-to">${messages[i].to}</span>
                <span>:&nbsp</span>
                <span class="message-text">${messages[i].text}&nbsp</span>
            </div>
            `
        }
    }
    messageContainer.lastElementChild.scrollIntoView()
}



function logIn() {
    const postPromiseLogIn = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user)
    postPromiseLogIn.then(updateChat)
    postPromiseLogIn.catch(userFailedToLogIn)
    setInterval(userStayOn, 5000)
    //setInterval(updateChat,1000)
}
function userStayOn() {
    const userOnline = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    console.log("User stay on :)")
}

function updateChat() {
    const getPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    getPromise.then(processPromise)
}


function userFailedToLogIn(erro) {
    console.log("Login Failed: " + erro.response.status)
    switch (erro.response.status) {
        case 400:
            alert("Usuário já se encontra logado")
            break;
        default:
            alert(erro.response.status)
            break;
    }
}

let messageTyped = document.querySelector('footer input');

messageTyped.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        sendMessage()
    }
});

function sendMessage() {
    let messageTyped = document.querySelector('footer input');
    const messageBody = {
        from: username,
        to: "Todos",
        text: messageTyped.value,
        type: "message" // ou "private_message" para o bônus
    }

    const postPromiseDeliveryMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageBody)
    postPromiseDeliveryMessage.catch(messageFailedToDelivery)
    messageTyped.value = ''
}
function messageFailedToDelivery(erro) {
    console.log("Delivery Message: " + erro.response.status)
}