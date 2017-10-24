import { isDev } from './common'

export const DB_CONFIG = {
    apiKey: "AIzaSyCmnoJEwqiaq-lavYiVySWdo77uSWIcFK4",
    authDomain: "earlybirdshopers.firebaseapp.com",
    databaseURL: "https://earlybirdshopers.firebaseio.com",
    projectId: "earlybirdshopers",
    storageBucket: "earlybirdshopers.appspot.com",
    messagingSenderId: "853475325627"
}

export const API_ENDPOINT = isDev ? 'http://localhost:5000/earlybirdshopers/us-central1/api/' : 'https://us-central1-earlybirdshopers.cloudfunctions.net/api/' 


/*
TOKEN

"eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2MjhlNTY2OTBjMTY5OTk3NjJlMTEwZjlkOWQzZjk4N2I4ZmFkODMifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWFybHliaXJkc2hvcGVycyIsImF1ZCI6ImVhcmx5YmlyZHNob3BlcnMiLCJhdXRoX3RpbWUiOjE1MDc4ODk4ODYsInVzZXJfaWQiOiJPekY2bkYzNHVMUXBuU0ZEbkZRbU8wV2liSmYxIiwic3ViIjoiT3pGNm5GMzR1TFFwblNGRG5GUW1PMFdpYkpmMSIsImlhdCI6MTUwODg0NjYwOCwiZXhwIjoxNTA4ODUwMjA4LCJlbWFpbCI6InlvZmZlLm9yQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ5b2ZmZS5vckBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.EEeKMuoN32XZxB2MaQhxyIYfsbvC7n7lLMLolOdavKLMNjgtIqGEpT5frOVYSa1YXAMeOUajEthx8T3rdlyDlp8PChp0lrVVmKkW028tV1wL3BC_KOl0PYfm4W1SoX2NYp00rQaJ5Sffwwl2zddQXyMg_Aoidcn_f94UZmEQQRHfB8M8nShtSyJcQB9NpIeygGoGjAG-PStq7jo4yNPAdEjRRm0tW31hTmQzgY6f892ilWw_ptx08wA6r0ze-mff9UhqJMYYvyA_EOgVNXGAIP8KzPwgsJBApdITaLcZzGvlWPfj0fN-_3-dpqefJXoUyO89dpBDvnEG_WVeu0Of6Q"

*/