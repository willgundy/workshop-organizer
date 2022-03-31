import { checkAuth, logout, getWorkshops, createParticipant } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const workshopSelect = document.getElementById('workshopName');
const participantForm = document.getElementById('participantForm');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', () => {
    addWorkshopOptions();
});


async function addWorkshopOptions() {
    const workshops = await getWorkshops();

    workshopSelect.innerHTML = '';

    for (let workshop of workshops) {
        const optionel = document.createElement('option');
        optionel.value = workshop.id;
        optionel.textContent = workshop.name;

        workshopSelect.append(optionel);
    }
}

window.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(participantForm);

    const participantName = data.get('participantName');
    const workshopId = data.get('workshopName');

    const participant = {
        name: participantName,
        workshop_id: workshopId
    };

    await createParticipant(participant);

    window.location.href = '../workshops';
});