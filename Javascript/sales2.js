function nextNumber() {
    let queue = JSON.parse(localStorage.getItem('salesQueue')) || [];

    if (queue.length > 0) {
        const nextNumber = queue.shift(); // Get the next number from the queue
        document.getElementById('counter2-number').textContent = nextNumber;

        localStorage.setItem('salesQueue', JSON.stringify(queue)); // Update the queue in localStorage
        localStorage.setItem('counter2Serving', nextNumber); // Update the number being served
        localStorage.setItem('salesQueueUpdated', Date.now());  // Notify other tabs/pages
        addOrderToProcess(nextNumber);
        updateQueueDisplay(queue);
    } else {
        alert("No more numbers in the queue.");
    }
}

function resetNumber() {
    document.getElementById('counter2-number').textContent = '0';
    document.getElementById('counter2-orders').innerHTML = '<p>No orders currently.</p>';
    localStorage.setItem('counter2Serving', '0'); // Reset the number in localStorage
    localStorage.setItem('salesQueueUpdated', Date.now());  // Notify other tabs/pages
}

function addOrderToProcess(number) {
    const ordersElement = document.getElementById('counter2-orders');
    const newOrder = document.createElement('div');
    newOrder.className = 'order-item';
    newOrder.innerHTML = `
        <span>Order ${number}</span>
        <button onclick="requestReady('${number}', this)">Request Ready</button>
        <button onclick="requestComplete('${number}', this)" disabled>Request Complete</button>
    `;
    ordersElement.appendChild(newOrder);
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
}

window.onload = loadQueue;

window.addEventListener('storage', function(event) {
    if (event.key === 'salesQueueUpdated') {
        loadQueue();
    }
});