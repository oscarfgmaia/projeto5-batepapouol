let messages;

const getPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
getPromise.then(processPromise)

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
    messageContainer.children[messages.length - 1].scrollIntoView()
}

