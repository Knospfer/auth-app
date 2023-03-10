//questa è la risposta della api di login
export interface AuthResponse {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    image: string,
    token: string,
}