export type UserType = {
    id: number
    name: string
    email: string
    password: string
    players: []
}

export type PlayerType = {
    id: number
    fullName: string
    position: string
    team: string
    status: string
    userId: number
}