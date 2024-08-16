function nextNumber() {
    let queue = JSON.parse(localStorage.getItem('salesQueue')) || [];

    if (queue.length > 0) {
        const nextNumber = queue.shift(); // Get the next number from the queue
        document.getElementById('counter1-number').textContent = nextNumber;

        localStorage.setItem('salesQueue', JSON.stringify(queue)); // Update the queue in localStorage
        localStorage.setItem('counter1Serving', nextNumber); // Update the number being served
        localStorage.setItem('salesQueueUpdated', Date.now());  // Notify other tabs/pages
        addOrderToProcess(nextNumber);
        updateQueueDisplay(queue);
        updateResetButtonState();
    } else {
        alert("No more numbers in the queue.");
    }
}

function resetNumber() {
    document.getElementById('counter1-number').textContent = '0';
    document.getElementById('counter1-orders').innerHTML = '<p>No orders currently.</p>';
    localStorage.setItem('counter1Serving', '0'); // Reset the number in localStorage
    localStorage.setItem('salesQueueUpdated', Date.now());  // Notify other tabs/pages
    updateResetButtonState();
}

function addOrderToProcess(number) {
    const ordersElement = document.getElementById('counter1-orders');
    const newOrder = document.createElement('div');
    newOrder.className = 'order-item';
    newOrder.innerHTML = `
        <span>Order ${number}</span>
        <button onclick="requestReady('${number}', this)">Request Ready</button>
        <button onclick="requestComplete('${number}', this)" disabled>Request Complete</button>
    `;
    ordersElement.appendChild(newOrder);
    updateResetButtonState();
}

function requestReady(number, button) {
    button.disabled = true;
    button.nextElementSibling.disabled = false; // Enable "Request Complete" button

    let claimingQueue = JSON.parse(localStorage.getItem('claimingQueue')) || [];
    claimingQueue.push(number);
    localStorage.setItem('claimingQueue', JSON.stringify(claimingQueue)); // Update claiming queue
    localStorage.setItem('claimingUpdated', Date.now());  // Notify other tabs/pages

    alert("Request is ready for Order " + number);
}

function requestComplete(number, button) {
    button.parentElement.remove();

    let claimingQueue = JSON.parse(localStorage.getItem('claimingQueue')) || [];
    claimingQueue = claimingQueue.filter(n => n !== number);
    localStorage.setItem('claimingQueue', JSON.stringify(claimingQueue)); // Update claiming queue
    localStorage.setItem('claimingUpdated', Date.now());  // Notify other tabs/pages

    alert("Request is complete for Order " + number);
    updateResetButtonState();
}

function updateQueueDisplay(queue) {
    const queueList = document.getElementById('queue-list');
    queueList.innerHTML = '';

    if (queue.length === 0) {
        queueList.innerHTML = '<p>No numbers in queue.</p>';
    } else {
        queue.forEach(function(number) {
            const queueItem = document.createElement('p');
            queueItem.textContent = number;
            queueList.appendChild(queueItem);
        });
    }
}

function loadQueue() {
    let queue = JSON.parse(localStorage.getItem('salesQueue')) || [];
    updateQueueDisplay(queue);
    updateResetButtonState();
}

function updateResetButtonState() {
    const ordersElement = document.getElementById('counter1-orders');
    const resetButton = document.getElementById('resetButton');
    if (ordersElement.children.length === 0 || (ordersElement.children.length === 1 && ordersElement.children[0].tagName === 'P')) {
        resetButton.disabled = false;
    } else {
        resetButton.disabled = true;
    }
}

window.onload = loadQueue;

window.addEventListener('storage', function(event) {
    if (event.key === 'salesQueueUpdated') {
        loadQueue();
    }
});