const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYnp4bXNrYWdwcm92cWNjcm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc1NTM0MzksImV4cCI6MTk2MzEyOTQzOX0.wkKK4FheZyrNrf7B04tLKfQuyVwpMO3ycPvoUWD6S9M';

const SUPABASE_URL = 'https://rbbzxmskagprovqccrmk.supabase.co';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//WORKSHOPS
//get workshops and participant info, going to limit editing workshops for now
export async function getWorkshops() {
    const response = await client
        .from('workshops')
        .select(`*, workshop-participants (*)`);

    return response.body;
}


//PARTICIPANTS
//get participants/workshop info and create/delete a  participant
export async function getAllParticipants() {
    const response = await client
        .from('workshop-participants')
        .select('*');

    return response.body;
}

export async function deleteParticipant(id) {
    const response = await client
        .from('workshop-participants')
        .delete()
        .match({ id: id })
        .single();

    return response.body;
}

export async function createParticipant(participant) {
    const response = await client
        .from('workshop-participants')
        .insert(participant);

    return response.body;
}

//LOGIN/LOGOUT AND USER AUTH
export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./workshops');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });

    return response.user;
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}


// function checkError({ data, error }) {
//     return error ? console.error(error) : data;
// }