let messages;
let deliveryTo ='Todos';
let typeMessage = "message" //ou "private_message" para o bônus
const user = {
    name: ''
}
function setPublicMessage(){
    typeMessage = 'message'
    getParticipants()
}
function setPrivateMessage(){
    typeMessage = 'private_message'
    getParticipants()
}



function sendUserName() {
    const input = document.getElementById('usernameId');
    const button = document.getElementById('button');
    const spinner = document.querySelector('.spinner')
    user.name = input.value
    input.classList.add('hidden')
    button.classList.add('hidden')
    spinner.classList.remove('hidden')
    logIn()
}
function getParticipants() {
    const getParticipantsPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    getParticipantsPromise.then(verifyParticipants)
    getParticipantsPromise.catch(unableToGetParticipants)
}
function unableToGetParticipants(erro){
    console.log("Unable to get Participants erro: "+erro)
}
function verifyParticipants(promise) {
    const participants = promise.data
    const usersContainer = document.querySelector('.users-container');
    let footerPrivateMsg = document.querySelector('.reserved')
    if(typeMessage === "message"){
        let publicMessage = document.querySelector('.public');
        let privateMessage = document.querySelector('.private');
        publicMessage.classList.remove('hidden')
        privateMessage.classList.add('hidden')     
        footerPrivateMsg.classList.add('hidden')   
    }
    if(typeMessage === "private_message"){
        let publicMessage = document.querySelector('.public');
        let privateMessage = document.querySelector('.private');
        privateMessage.classList.remove('hidden')
        publicMessage.classList.add('hidden')
        footerPrivateMsg = document.querySelector('.reserved')
        footerPrivateMsg.classList.remove('hidden')
        footerPrivateMsg.innerHTML = 
        `
        Enviando para ${deliveryTo} (reservadamente)
        `
    }
    usersContainer.innerHTML =
        `
    <div class="user-container selected" onclick="selectUser(this)">
        <div class="icon-name">
            <div class="users"><ion-icon name="people"></ion-icon></div>
            <span class="send-to">Todos</span>
        </div>
        <span class="check"><ion-icon name="checkmark-sharp"></ion-icon></span>
    </div>
    `;
    for (let i = 0; i < participants.length; i++) {
        if (participants[i].name === deliveryTo){
            const todosContainer = document.querySelector('.user-container') 
            todosContainer.querySelector('.check').classList.add('hidden')
            todosContainer.classList.remove('selected')
            usersContainer.innerHTML += `
            <div class="user-container selected" onclick="selectUser(this)">
            <div class="icon-name">
            <div class="users"><ion-icon name="person-circle-sharp"></ion-icon></div>
            <span class="send-to">${participants[i].name}</span>
            </div>
            <span class="check"><ion-icon name="checkmark-sharp"></ion-icon></span>
            </div>
            `
        }
        else{
            usersContainer.innerHTML += `
            <div class="user-container" onclick="selectUser(this)">
            <div class="icon-name">
            <div class="users"><ion-icon name="person-circle-sharp"></ion-icon></div>
            <span class="send-to">${participants[i].name}</span>
            </div>
            <span class="check hidden"><ion-icon name="checkmark-sharp"></ion-icon></span>
            </div>
            `
        }
    }
}
function selectUser(user){
    user.classList.add('selected')
    deliveryTo = user.querySelector('.send-to').innerHTML
    getParticipants()
}
function openMenu() {
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
                <span class="time">(${messages[i].time})</span>
                <span class="message-from">${messages[i].from}</span>
                <span class="message-text">${messages[i].text}</span>
            </div>
            `
        }
        if (messages[i].type === "message") {
            messageContainer.innerHTML += `
            <div class="message-content message">
                <span class="time">(${messages[i].time})</span>
                <span class="message-from">${messages[i].from}</span>
                <span>para</span>
                <span class="message-to">${messages[i].to}</span>
                <span>:</span>
                <span class="message-text">${messages[i].text}</span>
            </div>
            `
        }
        if (messages[i].type === "private_message" && (messages[i].to === user.name || messages[i].from === user.name ||messages[i].to === "Todos")) {
            messageContainer.innerHTML += `
            <div class="message-content private-message">
                <span class="time">(${messages[i].time})</span>
                <span class="message-from">${messages[i].from}</span>
                <span>para</span>
                <span class="message-to">${messages[i].to}</span>
                <span>:</span>
                <span class="message-text">${messages[i].text}</span>
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
    setInterval(getParticipants, 10000)
    setInterval(updateChat, 3000)
}
function userStayOn() {
    const userOnline = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    userOnline.catch(failedToSendUserStayOn)
    //userOnline.then(requestSentUserOn)
}
/* function requestSentUserOn(promise){
    console.log("Request UserOn sent: "+promise)
} */
function failedToSendUserStayOn(erro){
    console.log("Failed to updatechat erro:"+erro)
}

function updateChat() {
    const loginScreen = document.querySelector('.login');
    loginScreen.classList.add('hidden');
    const getPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    getPromise.then(processPromise)
    getPromise.catch(errorToUpdateChat)
}
function errorToUpdateChat(erro){
    console.log("Failed to updatechat erro:"+erro)
}


function userFailedToLogIn(erro) {
    console.log("Login Failed: " + erro.response.status)
    switch (erro.response.status) {
        case 400:
            alert("Usuário já se encontra logado")
            window.location.reload()
            break;
        default:
            alert("outro erro: " + erro.response.status)
            window.location.reload()
            break;
    }
}

const messageTyped = document.querySelector('footer input');

messageTyped.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        sendMessage()
    }
});

const userInput = document.getElementById('usernameId')
userInput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        sendUserName()
    }
});

function closeMenu(){
    const menu = document.querySelector(".menu")
    menu.classList.add('hidden')
}

function sendMessage() {
    let messageTyped = document.querySelector('footer input');
    if(messageTyped.value != ''){

        const messageBody = {
            from: user.name,
            to: deliveryTo,
            text: messageTyped.value,
            type: typeMessage // ou "private_message" para o bônus
        }
        
        const postPromiseDeliveryMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageBody)
        postPromiseDeliveryMessage.then(updateChat)
        postPromiseDeliveryMessage.catch(messageFailedToDelivery)
        messageTyped.value = ''
    }
}
function messageFailedToDelivery(erro) {
    alert("User desconected")
    window.location.reload()
}