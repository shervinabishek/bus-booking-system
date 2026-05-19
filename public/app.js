const searchForm = document.querySelector('#searchForm');
const resultsMessage = document.querySelector('#resultsMessage');
const busesList = document.querySelector('#busesList');
const bookingCard = document.querySelector('#bookingCard');
const selectedBusInfo = document.querySelector('#selectedBusInfo');
const bookingForm = document.querySelector('#bookingForm');
const bookingMessage = document.querySelector('#bookingMessage');
const selectedBusIdField = document.querySelector('#selectedBusId');
const seatNumberField = document.querySelector('#seatNumber');
const bookingsSearchForm = document.querySelector('#bookingsSearchForm');
const bookingResults = document.querySelector('#bookingResults');
const bookingsMessage = document.querySelector('#bookingsMessage');

const api = {
    searchBuses: (from, to, travelDate) => `/api/buses/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&travelDate=${encodeURIComponent(travelDate)}`,
    createBooking: '/api/bookings/create',
    passengerBookings: (email) => `/api/bookings/passenger/${encodeURIComponent(email)}`
};

let lastSearchBuses = [];

const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const showMessage = (element, text, type = 'info') => {
    element.textContent = text;
    element.classList.toggle('error', type === 'error');
};

const clearMessage = (element) => {
    element.textContent = '';
    element.classList.remove('error');
};

const renderBusCards = (buses) => {
    busesList.innerHTML = '';
    buses.forEach((bus) => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.innerHTML = `
            <h3>${bus.operator} — ${bus.busNumber}</h3>
            <p><strong>${bus.from}</strong> → <strong>${bus.to}</strong></p>
            <p>Departure: ${bus.departureTime}, Arrival: ${bus.arrivalTime}</p>
            <p>Travel date: ${formatDate(bus.travelDate)}</p>
            <p>Fare: ₹${bus.fare} · Available seats: ${bus.availableSeats}</p>
            <div class="bus-actions">
                <button type="button" data-bus-id="${bus._id}">Select this bus</button>
            </div>
        `;
        busesList.appendChild(busCard);
    });
};

const renderBooking = (bus) => {
    selectedBusInfo.innerHTML = `
        <p><strong>Bus:</strong> ${bus.operator} • ${bus.busNumber}</p>
        <p><strong>Route:</strong> ${bus.from} → ${bus.to}</p>
        <p><strong>Travel date:</strong> ${formatDate(bus.travelDate)}</p>
        <p><strong>Fare per seat:</strong> ₹${bus.fare}</p>
    `;
    selectedBusIdField.value = bus._id;
    seatNumberField.max = bus.totalSeats;
    bookingForm.classList.remove('hidden');
    clearMessage(bookingMessage);
};

const renderBookings = (bookings) => {
    bookingResults.innerHTML = '';
    bookings.forEach((booking) => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
            <h3>${booking.passengerName} — ${booking.status}</h3>
            <p><strong>Bus:</strong> ${booking.busId.operator} ${booking.busId.busNumber}</p>
            <p><strong>Route:</strong> ${booking.busId.from} → ${booking.busId.to}</p>
            <p><strong>Travel date:</strong> ${formatDate(booking.busId.travelDate)}</p>
            <p><strong>Seat:</strong> ${booking.seatNumber} · Fare: ₹${booking.fare}</p>
            <p><strong>Booked on:</strong> ${formatDate(booking.bookingDate)}</p>
        `;
        bookingResults.appendChild(bookingCard);
    });
};

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const from = document.querySelector('#from').value.trim();
    const to = document.querySelector('#to').value.trim();
    const travelDate = document.querySelector('#travelDate').value;

    if (!from || !to || !travelDate) {
        showMessage(resultsMessage, 'Please fill in from, to, and travel date.', 'error');
        return;
    }

    clearMessage(resultsMessage);
    busesList.innerHTML = '<p>Searching for buses…</p>';

    try {
        const response = await fetch(api.searchBuses(from, to, travelDate));
        if (!response.ok) {
            const error = await response.json();
            busesList.innerHTML = '';
            showMessage(resultsMessage, error.message || 'No buses found.', 'error');
            return;
        }
        const buses = await response.json();
        if (!Array.isArray(buses) || buses.length === 0) {
            busesList.innerHTML = '';
            showMessage(resultsMessage, 'No buses found for this route and date.', 'error');
            return;
        }
        lastSearchBuses = buses;
        renderBusCards(buses);
    } catch (error) {
        busesList.innerHTML = '';
        showMessage(resultsMessage, 'Unable to load buses. Check your backend server.', 'error');
    }
});

busesList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-bus-id]');
    if (!button) return;
    const busId = button.dataset.busId;
    const bus = lastSearchBuses.find((item) => item._id === busId);
    if (!bus) {
        showMessage(resultsMessage, 'Unable to find selected bus details.', 'error');
        return;
    }
    renderBooking(bus);
});

bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const passengerName = document.querySelector('#passengerName').value.trim();
    const passengerEmail = document.querySelector('#passengerEmail').value.trim();
    const passengerPhone = document.querySelector('#passengerPhone').value.trim();
    const seatNumber = Number(document.querySelector('#seatNumber').value);
    const busId = selectedBusIdField.value;

    if (!passengerName || !passengerEmail || !passengerPhone || !seatNumber || !busId) {
        showMessage(bookingMessage, 'Please complete all booking fields.', 'error');
        return;
    }

    clearMessage(bookingMessage);
    bookingMessage.textContent = 'Submitting booking…';

    try {
        const response = await fetch(api.createBooking, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ busId, passengerName, passengerEmail, passengerPhone, seatNumber })
        });

        const result = await response.json();
        if (!response.ok) {
            showMessage(bookingMessage, result.message || 'Booking failed.', 'error');
            return;
        }

        showMessage(bookingMessage, `Booking confirmed! Seat ${result.seatNumber} is reserved.`, 'info');
        bookingForm.reset();
    } catch (error) {
        showMessage(bookingMessage, 'Unable to submit booking. Check server status.', 'error');
    }
});

bookingsSearchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#searchEmail').value.trim();
    if (!email) {
        showMessage(bookingsMessage, 'Please enter your email.', 'error');
        return;
    }

    clearMessage(bookingsMessage);
    bookingResults.innerHTML = '<p>Loading bookings…</p>';

    try {
        const response = await fetch(api.passengerBookings(email));
        const result = await response.json();
        if (!response.ok) {
            bookingResults.innerHTML = '';
            showMessage(bookingsMessage, result.message || 'No bookings found.', 'error');
            return;
        }
        renderBookings(result);
    } catch (error) {
        bookingResults.innerHTML = '';
        showMessage(bookingsMessage, 'Unable to load bookings. Check backend server.', 'error');
    }
});
