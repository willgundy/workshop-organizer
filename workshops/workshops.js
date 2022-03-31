import { checkAuth, logout, getWorkshops, deleteParticipant } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const workshopsContainer = document.getElementById('workshopsContainer');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    await displayWorkshops();
});


async function displayWorkshops() {
    const workshops = await getWorkshops();

    workshopsContainer.innerHTML = '';

    for (let workshop of workshops) {
        const workshopDiv = document.createElement('div');
        const workshopName = document.createElement('h3');

        workshopName.textContent = workshop.name;
        workshopDiv.id = workshop.id;
        workshopDiv.classList.add('workshopDiv');

        workshopDiv.append(workshopName);

        for (let participant of workshop.workshopParticipants) {
            const participantName = document.createElement('p');
            participantName.textContent = participant.name;

            participantName.addEventListener('click', async () => {
                await deleteParticipant(participant.id);
                displayWorkshops();
            });

            workshopDiv.append(participantName);
        }

        workshopsContainer.append(workshopDiv);
    }
}