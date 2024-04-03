let findCardBtn = document.querySelector('.js-get-summary')
let copyWPLinkBtn = document.querySelector('.wp-link-copy.copy-btn')
let resetBtn = document.querySelector('.js-reset-btn')

const darkModeBtn = document.querySelector('.js-darkmode-btn')
const root = document.documentElement
const headerEye = document.querySelector('.js-header-eyes')
const spinnerWrapper = document.querySelector('.py-spinner-wrapper')
const historyLabel = document.querySelector('.py-tasks-history-label')

const SUMMARY_TASK_URL = "https://api.app.exbot.ai/v1/products/youtube_summary/landing/summary/";

window.onload = () => {
    if (isDarkModeOn() == 'on') {
        setTimeout(
            darkMode,
            100
        )
    }
    renderTasks();

    setInterval(checkAllTasks, 5000);
}


darkModeBtn.addEventListener('click', () => {
    if (isDarkModeOn() == null) {
        darkMode()
        localStorage.setItem('darkMode', 'on')
    } else {
        lightMode()
        localStorage.removeItem('darkMode')
    }
})

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.type == "render") {
//         renderTasks(request.tasks);
//     }
// });

function isDarkModeOn() {
    return localStorage.getItem('darkMode') ? 'on' : null
}

function showError(message) {
    const error = document.querySelector('#extErrorMessage')
    error.innerHTML = message
    // error.classList.remove('hidden')
}

function darkMode() {
    darkModeBtn.innerHTML =
        '<svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<path fill-rule="evenodd" clip-rule="evenodd" d="M20 8.50003C20 7.6716 20.6716 7.00003 21.5 7.00003C22.3284 7.00003 23 7.6716 23 8.50003V9.50003C23 10.3285 22.3284 11 21.5 11C20.6716 11 20 10.3285 20 9.50003V8.50003ZM29.6317 11.247C30.2175 10.6612 31.1673 10.6612 31.7531 11.247C32.3388 11.8327 32.3388 12.7825 31.7531 13.3683C31.1673 13.9541 30.2175 13.9541 29.6317 13.3683C29.0459 12.7825 29.0459 11.8327 29.6317 11.247ZM11.247 13.3683C10.6612 12.7825 10.6612 11.8327 11.247 11.247C11.8327 10.6612 12.7825 10.6612 13.3683 11.247C13.9541 11.8327 13.9541 12.7825 13.3683 13.3683C12.7825 13.9541 11.8327 13.9541 11.247 13.3683ZM14 21.5C14 17.3579 17.3579 14 21.5 14C25.6421 14 29 17.3579 29 21.5C29 25.6421 25.6421 29 21.5 29C17.3579 29 14 25.6421 14 21.5ZM28.9246 28.9246C28.3388 29.5104 28.3388 30.4602 28.9246 31.0459C29.5104 31.6317 30.4602 31.6317 31.0459 31.0459C31.6317 30.4602 31.6317 29.5104 31.0459 28.9246C30.4602 28.3388 29.5104 28.3388 28.9246 28.9246ZM14.0754 28.9246C13.4896 28.3388 12.5399 28.3388 11.9541 28.9246C11.3683 29.5104 11.3683 30.4602 11.9541 31.0459C12.5399 31.6317 13.4896 31.6317 14.0754 31.0459C14.6612 30.4602 14.6612 29.5104 14.0754 28.9246ZM8.5 23C7.67157 23 7 22.3285 7 21.5C7 20.6716 7.67157 20 8.5 20H9.5C10.3284 20 11 20.6716 11 21.5C11 22.3285 10.3284 23 9.5 23H8.5ZM32 21.5C32 22.3284 32.6716 23 33.5 23H34.5C35.3284 23 36 22.3284 36 21.5C36 20.6716 35.3284 20 34.5 20H33.5C32.6716 20 32 20.6716 32 21.5ZM21.5 32C20.6716 32 20 32.6716 20 33.5V34.5C20 35.3284 20.6716 36 21.5 36C22.3284 36 23 35.3284 23 34.5V33.5C23 32.6716 22.3284 32 21.5 32Z" fill="#D5CEEA"/>'
        + '</svg>'

    let styleToChange = {
        bg: '#161827',
        btnBg: '#1C1F30',
        headerColor: '#FFFFFF',
        formText: '#FFFFFF',
        btnColor: '#24008C',
        btnBorder: '#6116FF'
    }

    switchProperties(styleToChange)
}

function lightMode() {
    darkModeBtn.innerHTML =
        '<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<path fill-rule="evenodd" clip-rule="evenodd" d="M18.299 15.581C17.4142 15.8534 16.4742 16 15.5 16C10.2533 16 6 11.7467 6 6.50002C6 4.043 6.93276 1.80383 8.4635 0.117311C3.67009 0.85649 0 4.99965 0 10C0 15.5228 4.47715 20 10 20C13.4562 20 16.5028 18.2467 18.299 15.581Z" fill="#A7A3C2"/>'
        + '</svg>'

    let styleToChange = {
        bg: '#FFFFFF',
        btnBg: '#F8F5FF',
        headerColor: '#000000',
        formText: '#000000',
        btnColor: '#6116FF',
        btnBorder: '#24008C'
    }

    switchProperties(styleToChange)
}

function switchProperties(properties) {
    for (let el in properties) {
        root.style.setProperty('--' + el, properties[el])
    }
}

findCardBtn.addEventListener('click', async () => {
    if (findCardBtn.classList.contains('active')) {
        return
    }
    findCardBtn.classList.add('active')
    await sendSummaryTask()
})

function showInput() {
    const input = document.querySelector('.wp-input-container');
    input.classList.remove('hidden');
}

function hideInput() {
    const input = document.querySelector('.wp-input-container');
    input.classList.add('hidden');
}

function createTaskElement1(task) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('summary-task');
    taskElement.classList.add('row');

    taskElement.innerHTML = `
        <span class="py-summary-task-id">${task.task_id}</span>
    `;

    if (task.status === 'success') {
        taskElement.innerHTML = `
            <span class="py-summary-task-id"><a target="_blank" href="${task.yt_url}">${task.yt_url}</a></span>
        `;
    }

    if (task.status === 'processing') {
        taskElement.innerHTML += `<div class="py-spinner-wrapper-inline">
            <div class="lds-dual-ring-small"></div>
        </div>`;

        return taskElement;
    }


    if (task.status === 'success') {
        if (task.link) {
            taskElement.innerHTML += `
            <div class="py-secondary-button">
                <a href="${task.link}" target="_blank">
                    <svg class="py-summary-link-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#A7A3C2"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><defs><style>.cls-1{fill:none;stroke:#A7A3C2;stroke-miterlimit:10;stroke-width:1.92px;}</style></defs><path class="cls-1" d="M10.56,5.77l2.72-2.72a5.43,5.43,0,0,1,3.84-1.59,5.43,5.43,0,0,1,5.42,5.42A5.43,5.43,0,0,1,21,10.72l-2.72,2.72"></path><path class="cls-1" d="M5.77,10.56,3.05,13.28A5.42,5.42,0,1,0,10.72,21l2.72-2.72"></path><line class="cls-1" x1="16.79" y1="7.21" x2="7.21" y2="16.79"></line><line class="cls-1" x1="20.63" y1="15.83" x2="23.5" y2="15.83"></line><line class="cls-1" x1="15.83" y1="20.63" x2="15.83" y2="23.5"></line><line class="cls-1" x1="19.19" y1="19.19" x2="21.1" y2="21.1"></line><line class="cls-1" x1="3.38" y1="8.17" x2="0.5" y2="8.17"></line><line class="cls-1" x1="8.17" y1="3.38" x2="8.17" y2="0.5"></line><line class="cls-1" x1="4.81" y1="4.81" x2="2.9" y2="2.9"></line></g></svg>
                </a>
            </div>`;
        }

        if (task.warning) {
            taskElement.innerHTML += `
            <div class="py-secondary-button" title="${task.warning}">
                <svg class="py-summary-link-svg" title="${task.warning}" viewBox="-0.5 0 25 25" stroke="#A7A3C2" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.2202 21.25H5.78015C5.14217 21.2775 4.50834 21.1347 3.94373 20.8364C3.37911 20.5381 2.90402 20.095 2.56714 19.5526C2.23026 19.0101 2.04372 18.3877 2.02667 17.7494C2.00963 17.111 2.1627 16.4797 2.47015 15.92L8.69013 5.10999C9.03495 4.54078 9.52077 4.07013 10.1006 3.74347C10.6804 3.41681 11.3346 3.24518 12.0001 3.24518C12.6656 3.24518 13.3199 3.41681 13.8997 3.74347C14.4795 4.07013 14.9654 4.54078 15.3102 5.10999L21.5302 15.92C21.8376 16.4797 21.9907 17.111 21.9736 17.7494C21.9566 18.3877 21.7701 19.0101 21.4332 19.5526C21.0963 20.095 20.6211 20.5381 20.0565 20.8364C19.4919 21.1347 18.8581 21.2775 18.2202 21.25V21.25Z" stroke="#A7A3C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10.8809 17.15C10.8809 17.0021 10.9102 16.8556 10.9671 16.7191C11.024 16.5825 11.1074 16.4586 11.2125 16.3545C11.3175 16.2504 11.4422 16.1681 11.5792 16.1124C11.7163 16.0567 11.8629 16.0287 12.0109 16.03C12.2291 16.034 12.4413 16.1021 12.621 16.226C12.8006 16.3499 12.9398 16.5241 13.0211 16.7266C13.1023 16.9292 13.122 17.1512 13.0778 17.3649C13.0335 17.5786 12.9272 17.7745 12.7722 17.9282C12.6172 18.0818 12.4203 18.1863 12.2062 18.2287C11.9921 18.2711 11.7703 18.2494 11.5685 18.1663C11.3666 18.0833 11.1938 17.9426 11.0715 17.7618C10.9492 17.5811 10.8829 17.3683 10.8809 17.15ZM11.2409 14.42L11.1009 9.20001C11.0876 9.07453 11.1008 8.94766 11.1398 8.82764C11.1787 8.70761 11.2424 8.5971 11.3268 8.5033C11.4112 8.40949 11.5144 8.33449 11.6296 8.28314C11.7449 8.2318 11.8697 8.20526 11.9959 8.20526C12.1221 8.20526 12.2469 8.2318 12.3621 8.28314C12.4774 8.33449 12.5805 8.40949 12.6649 8.5033C12.7493 8.5971 12.8131 8.70761 12.852 8.82764C12.8909 8.94766 12.9042 9.07453 12.8909 9.20001L12.7609 14.42C12.7609 14.6215 12.6808 14.8149 12.5383 14.9574C12.3957 15.0999 12.2024 15.18 12.0009 15.18C11.7993 15.18 11.606 15.0999 11.4635 14.9574C11.321 14.8149 11.2409 14.6215 11.2409 14.42Z" fill="#A7A3C2"></path> </g></svg>
            </div>`;
        }
    }

    let deleteTaskBtn = document.createElement('div');
    deleteTaskBtn.classList.add('py-secondary-button');
    deleteTaskBtn.classList.add('delete-task-button');
    deleteTaskBtn.classList.add('js-delete-btn');
    deleteTaskBtn.innerHTML = `<svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#A7A3C2"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><circle cx="12" cy="11.9999" r="9" stroke="#A7A3C2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path d="M14 10L10 14" stroke="#A7A3C2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M10 10L14 14" stroke="#A7A3C2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></g></svg>`;
    deleteTaskBtn.addEventListener('click', () => {
        dropTask(task.task_id);
    });
    taskElement.appendChild(deleteTaskBtn);

    return taskElement;
}

function createTaskElement(task) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('summary-task', 'row');

    let contentHTML = `<span class="py-summary-task-id">${task.task_id}</span>`;

    if (task.status === 'success') {
        // contentHTML = `<span class="py-summary-task-id"><a target="_blank" href="${task.yt_url}">${task.yt_url}</a></span>`;
        contentHTML = ``;

        if (task.thumbnail) {
            contentHTML += `<div>
                                <img src="${task.thumbnail}" class="py-summary-task-thumbnail" alt="Thumbnail">
                            </div>`;
        }

        if (task.title) {
            contentHTML += `<div class="py-summary-task-description">
                                <div class="py-summary-task-title">${task.title}</div>
                                <div class="py-summary-task-subtitle"><a href="${task.link}" target="_blank">${task.link}</a></div>
                            </div>`;
        }

        if (task.link) {
            contentHTML += `<div class="py-secondary-button">
                    <a href="${task.link}" target="_blank" title="Link">
                        <svg class="py-summary-link-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#A7A3C2"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><defs><style>.cls-1{fill:none;stroke:#A7A3C2;stroke-miterlimit:10;stroke-width:1.92px;}</style></defs><path class="cls-1" d="M10.56,5.77l2.72-2.72a5.43,5.43,0,0,1,3.84-1.59,5.43,5.43,0,0,1,5.42,5.42A5.43,5.43,0,0,1,21,10.72l-2.72,2.72"></path><path class="cls-1" d="M5.77,10.56,3.05,13.28A5.42,5.42,0,1,0,10.72,21l2.72-2.72"></path><line class="cls-1" x1="16.79" y1="7.21" x2="7.21" y2="16.79"></line><line class="cls-1" x1="20.63" y1="15.83" x2="23.5" y2="15.83"></line><line class="cls-1" x1="15.83" y1="20.63" x2="15.83" y2="23.5"></line><line class="cls-1" x1="19.19" y1="19.19" x2="21.1" y2="21.1"></line><line class="cls-1" x1="3.38" y1="8.17" x2="0.5" y2="8.17"></line><line class="cls-1" x1="8.17" y1="3.38" x2="8.17" y2="0.5"></line><line class="cls-1" x1="4.81" y1="4.81" x2="2.9" y2="2.9"></line></g></svg>
                    </a>
                </div>`;
        }
        if (task.warning) {
            contentHTML += `
                <div class="py-secondary-button" title="${task.warning}">
                    <svg class="py-summary-link-svg" title="${task.warning}" viewBox="-0.5 0 25 25" stroke="#A7A3C2" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.2202 21.25H5.78015C5.14217 21.2775 4.50834 21.1347 3.94373 20.8364C3.37911 20.5381 2.90402 20.095 2.56714 19.5526C2.23026 19.0101 2.04372 18.3877 2.02667 17.7494C2.00963 17.111 2.1627 16.4797 2.47015 15.92L8.69013 5.10999C9.03495 4.54078 9.52077 4.07013 10.1006 3.74347C10.6804 3.41681 11.3346 3.24518 12.0001 3.24518C12.6656 3.24518 13.3199 3.41681 13.8997 3.74347C14.4795 4.07013 14.9654 4.54078 15.3102 5.10999L21.5302 15.92C21.8376 16.4797 21.9907 17.111 21.9736 17.7494C21.9566 18.3877 21.7701 19.0101 21.4332 19.5526C21.0963 20.095 20.6211 20.5381 20.0565 20.8364C19.4919 21.1347 18.8581 21.2775 18.2202 21.25V21.25Z" stroke="#A7A3C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10.8809 17.15C10.8809 17.0021 10.9102 16.8556 10.9671 16.7191C11.024 16.5825 11.1074 16.4586 11.2125 16.3545C11.3175 16.2504 11.4422 16.1681 11.5792 16.1124C11.7163 16.0567 11.8629 16.0287 12.0109 16.03C12.2291 16.034 12.4413 16.1021 12.621 16.226C12.8006 16.3499 12.9398 16.5241 13.0211 16.7266C13.1023 16.9292 13.122 17.1512 13.0778 17.3649C13.0335 17.5786 12.9272 17.7745 12.7722 17.9282C12.6172 18.0818 12.4203 18.1863 12.2062 18.2287C11.9921 18.2711 11.7703 18.2494 11.5685 18.1663C11.3666 18.0833 11.1938 17.9426 11.0715 17.7618C10.9492 17.5811 10.8829 17.3683 10.8809 17.15ZM11.2409 14.42L11.1009 9.20001C11.0876 9.07453 11.1008 8.94766 11.1398 8.82764C11.1787 8.70761 11.2424 8.5971 11.3268 8.5033C11.4112 8.40949 11.5144 8.33449 11.6296 8.28314C11.7449 8.2318 11.8697 8.20526 11.9959 8.20526C12.1221 8.20526 12.2469 8.2318 12.3621 8.28314C12.4774 8.33449 12.5805 8.40949 12.6649 8.5033C12.7493 8.5971 12.8131 8.70761 12.852 8.82764C12.8909 8.94766 12.9042 9.07453 12.8909 9.20001L12.7609 14.42C12.7609 14.6215 12.6808 14.8149 12.5383 14.9574C12.3957 15.0999 12.2024 15.18 12.0009 15.18C11.7993 15.18 11.606 15.0999 11.4635 14.9574C11.321 14.8149 11.2409 14.6215 11.2409 14.42Z" fill="#A7A3C2"></path> </g></svg>
                </div>`;
        }
    }


    if (task.status === 'failure') {
        if (task.warning) {
            contentHTML = `<a target="_blank" class="py-summary-failed-task-url" href="${task.yt_url}">${task.yt_url}</a>`
            contentHTML += `<div class="py-secondary-button" title="${task.warning}">
                    <svg class="py-summary-link-svg" title="${task.warning}" viewBox="-0.5 0 25 25" stroke="#A7A3C2" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.2202 21.25H5.78015C5.14217 21.2775 4.50834 21.1347 3.94373 20.8364C3.37911 20.5381 2.90402 20.095 2.56714 19.5526C2.23026 19.0101 2.04372 18.3877 2.02667 17.7494C2.00963 17.111 2.1627 16.4797 2.47015 15.92L8.69013 5.10999C9.03495 4.54078 9.52077 4.07013 10.1006 3.74347C10.6804 3.41681 11.3346 3.24518 12.0001 3.24518C12.6656 3.24518 13.3199 3.41681 13.8997 3.74347C14.4795 4.07013 14.9654 4.54078 15.3102 5.10999L21.5302 15.92C21.8376 16.4797 21.9907 17.111 21.9736 17.7494C21.9566 18.3877 21.7701 19.0101 21.4332 19.5526C21.0963 20.095 20.6211 20.5381 20.0565 20.8364C19.4919 21.1347 18.8581 21.2775 18.2202 21.25V21.25Z" stroke="#A7A3C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10.8809 17.15C10.8809 17.0021 10.9102 16.8556 10.9671 16.7191C11.024 16.5825 11.1074 16.4586 11.2125 16.3545C11.3175 16.2504 11.4422 16.1681 11.5792 16.1124C11.7163 16.0567 11.8629 16.0287 12.0109 16.03C12.2291 16.034 12.4413 16.1021 12.621 16.226C12.8006 16.3499 12.9398 16.5241 13.0211 16.7266C13.1023 16.9292 13.122 17.1512 13.0778 17.3649C13.0335 17.5786 12.9272 17.7745 12.7722 17.9282C12.6172 18.0818 12.4203 18.1863 12.2062 18.2287C11.9921 18.2711 11.7703 18.2494 11.5685 18.1663C11.3666 18.0833 11.1938 17.9426 11.0715 17.7618C10.9492 17.5811 10.8829 17.3683 10.8809 17.15ZM11.2409 14.42L11.1009 9.20001C11.0876 9.07453 11.1008 8.94766 11.1398 8.82764C11.1787 8.70761 11.2424 8.5971 11.3268 8.5033C11.4112 8.40949 11.5144 8.33449 11.6296 8.28314C11.7449 8.2318 11.8697 8.20526 11.9959 8.20526C12.1221 8.20526 12.2469 8.2318 12.3621 8.28314C12.4774 8.33449 12.5805 8.40949 12.6649 8.5033C12.7493 8.5971 12.8131 8.70761 12.852 8.82764C12.8909 8.94766 12.9042 9.07453 12.8909 9.20001L12.7609 14.42C12.7609 14.6215 12.6808 14.8149 12.5383 14.9574C12.3957 15.0999 12.2024 15.18 12.0009 15.18C11.7993 15.18 11.606 15.0999 11.4635 14.9574C11.321 14.8149 11.2409 14.6215 11.2409 14.42Z" fill="#A7A3C2"></path> </g></svg>
                </div>`;
        }
    }


    if (task.status === 'processing') {
        contentHTML += `<div class="py-spinner-wrapper-inline"><div class="lds-dual-ring-small"></div></div>`;
    }

    taskElement.innerHTML = contentHTML;

    let deleteTaskBtn = document.createElement('div');
    deleteTaskBtn.classList.add('py-secondary-button', 'delete-task-button', 'js-delete-btn');
    deleteTaskBtn.innerHTML = deleteTaskBtn.innerHTML = `<svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#A7A3C2"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><circle cx="12" cy="11.9999" r="9" stroke="#A7A3C2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path d="M14 10L10 14" stroke="#A7A3C2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M10 10L14 14" stroke="#A7A3C2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></g></svg>`;
    deleteTaskBtn.addEventListener('click', () => {
        dropTask(task.task_id);
    });
    taskElement.appendChild(deleteTaskBtn);

    return taskElement;
}


function dropTask(taskId) {
    let tasks = getTasksStorage();
    tasks = tasks.filter(task => task.task_id !== taskId);
    localStorage.setItem('exbotSummaryTasks', JSON.stringify(tasks));
    clearTaskList();
    renderTasks();
}

function clearTaskList() {
    const taskList = document.querySelector('.py-tasks');
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
}

function renderTasks() {
    clearTaskList();
    const tasks = getTasksStorage();
    for (let task of tasks) {
        let newTaskItem = createTaskElement(task);
        document.querySelector('.py-tasks').appendChild(newTaskItem);
    }

    if (tasks.length > 0) {
        historyLabel.classList.remove('hidden');
    }

    if (tasks.length === 0) {
        historyLabel.classList.add('hidden');
    }
}

function processSummaryResult(result, status) {
    const id = result._id;
    const tasks = getTasksStorage();
    tasks.forEach(task => {
        if (task.task_id === id) {
            task.status = status;

            if (result.link) {
                task.link = result.link;
            }

            task.link = task.yt_url;

            if (result.link === 'Error') {
                task.warning = 'Error';
            }

            if (result.status === 'failure') {
                task.warning = result.message;
            }
            if (result.task_report?.report_content_ready?.thumbnail) {
                task.thumbnail = result.task_report.report_content_ready.thumbnail;
            }

            if (result.task_report?.report_content_ready?.title) {
                task.title = result.task_report.report_content_ready.title;
            }

            if (result.task_report?.type !== 'success') {
                task.warning = result.task_report?.message || "Error occured";
                task.status = 'failure';
            }
        }
    });
    localStorage.setItem('exbotSummaryTasks', JSON.stringify(tasks));
    renderTasks();
}


function checkSummaryStatus(task_id) {
    if (!task_id) return;

    // Checking
    const checkStatus = (id) => {
        return new Promise((resolve, reject) => {
            fetch(`${SUMMARY_TASK_URL}${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' || data.status === 'failure') {
                    processSummaryResult(data.task, data.status);
                }
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                showError('API error: ' + error.toString());
                hideSpinner();
                reject();
            });
        });
    };
    return checkStatus(task_id);
}

function checkAllTasks() {
    const tasks = getTasksStorage();
    for (let task of tasks) {
        if (task.status === 'processing') {
            checkSummaryStatus(task.task_id);
        }
    }
}

function getTasksStorage () {
    try {
        let tasks = JSON.parse(localStorage.getItem('exbotSummaryTasks', '[]')) || [];
        return tasks;
    } catch (e) {
        console.error('Error with exbot extension : ' + e)
    }
}

function saveTask(task_id, url) {
    try {
        let tasks = getTasksStorage();
        tasks.push({
            task_id: task_id,
            status: 'processing',
            yt_url: url
        });
        localStorage.setItem('exbotSummaryTasks', JSON.stringify(tasks));
        renderTasks();
    } catch (e) {
        console.error('Error with exbot extension : ' + e)
    }
}

async function sendSummaryTask() {
    chrome.tabs.query({active: true}, tabs => {
        const url = tabs[0].url;
        if (url) {
            fetch(`${SUMMARY_TASK_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "type": "youtube_landing_summary", // required
                    "url": url, // required
                    "language": "EN" // optional
                })
            })
            .then(response => response.json())
            .then(data => {
                const task_id = data.taskId;
                if (task_id) {
                    saveTask(task_id, data.task.url)
                    findCardBtn.classList.remove('active');
                }

                return task_id;
            })
            .catch((error) => {
               showError('API error: ' + error.toString());
            });
        }

        if (!url) {
            findCardBtn.classList.remove('active');
            showError('Error: Cannot access active tab url, please check extension permissions or restart chrome');
        }
    });
    // Everything went smooth so we can close the popup to let the user enjoy
    // window.close()
}
