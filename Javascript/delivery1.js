function nextNumber() {
    let queue = JSON.parse(localStorage.getItem('deliveryQueue')) || [];

    if (queue.length > 0) {
        const nextNumber = queue.shift(); // Get the next number from the queue
        document.getElementById('counter1-number').textContent = nextNumber;

        localStorage.setItem('deliveryQueue', JSON.stringify(queue)); // Update the queue in localStorage
        localStorage.setItem('counter1ServingDelivery', nextNumber); // Update the number being served
        localStorage.setItem('deliveryQueueUpdated', Date.now());  // Notify other tabs/pages
        addOrderToProcess(nextNumber);
        updateQueueDisplay(queue);
    } else {
        alert("No more numbers in the queue.");
    }
}

function resetNumber() {
    document.getElementById('counter1-number').textContent = '0';
    document.getElementById('counter1-orders').innerHTML = '<p>No orders currently.</p>';
    localStorage.setItem('counter1ServingDelivery', '0'); // Reset the number in localStorage
    localStorage.setItem('deliveryQueueUpdated', Date.now());  // Notify other tabs/pages
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
}

function requestReady(number, button) {
    button.disabled = true;
    button.nextElementSibling.disabled = false; // Enable "Request Complete" button

    let claimingQueue = JSON.parse(localStorage.getItem('claimingQueueDelivery')) || [];
    claimingQueue.push(number);
    localStorage.setItem('claimingQueueDelivery', JSON.stringify(claimingQueue)); // Update claiming queue
    localStorage.setItem('claimingUpdatedDelivery', Date.now());  // Notify other tabs/pages

    alert("Request is ready for Order " + number);
}

function requestComplete(number, button) {
    button.parentElement.remove();

    let claimingQueue = JSON.parse(localStorage.getItem('claimingQueueDelivery')) || [];
    claimingQueue = claimingQueue.filter(n => n !== number);
    localStorage.setItem('claimingQueueDelivery', JSON.stringify(claimingQueue)); // Update claiming queue
    localStorage.setItem('claimingUpdatedDelivery', Date.now());  // Notify other tabs/pages

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
    let queue = JSON.parse(localStorage.getItem('deliveryQueue')) || [];
    updateQueueDisplay(queue);
}

window.onload = loadQueue;

window.addEventListener('storage', function(event) {
    if (event.key === 'deliveryQueueUpdated') {
        loadQueue();
    }
});