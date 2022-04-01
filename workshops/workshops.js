import { checkAuth, logout, getWorkshops, deleteParticipant, updateParticipantWorkshopId } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const workshopsContainer = document.getElementById('workshopsContainer');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async () => {
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
        workshopDiv.addEventListener('dragenter', dragEnter);
        workshopDiv.addEventListener('dragover', dragOver);
        workshopDiv.addEventListener('dragleave', dragLeave);
        workshopDiv.addEventListener('drop', drop);

        workshopDiv.append(workshopName);

        for (let participant of workshop.workshopParticipants) {
            const participantDiv = document.createElement('div');
            participantDiv.classList.add('participantDiv');
            participantDiv.id = participant.id;
            participantDiv.draggable = true;


            const participantName = document.createElement('p');
            participantName.textContent = participant.name;

            const removeParticipantEl = document.createElement('span');
            removeParticipantEl.classList.add('removeItem');
            removeParticipantEl.textContent = '\u00D7';

            removeParticipantEl.addEventListener('click', async () => {
                await deleteParticipant(participant.id);
                displayWorkshops();
            });

            participantDiv.addEventListener('dragstart', (e) => {
                dragStart(e);
            });

            participantDiv.append(participantName, removeParticipantEl);

            workshopDiv.append(participantDiv);
        }

        workshopsContainer.append(workshopDiv);
    }
}


function dragStart(e) {
    // console.log(e);
    e.dataTransfer.setData('text', e.target.id);
}

function dragEnter(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragOver');
}

function dragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragOver');
}

function dragLeave(e) {
    e.currentTarget.classList.remove('dragOver');
}

async function drop(e) {
    e.currentTarget.classList.remove('dragOver');

    const participantId = e.dataTransfer.getData('text');

    const participantElId = document.getElementById(participantId);

    e.currentTarget.append(participantElId);

    const workshopId = e.currentTarget.id;

    await updateParticipantWorkshopId(participantId, workshopId);
}