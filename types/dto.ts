export interface User {
    uid: string
    firstName: string
    lastName: string
    email: string
    role: string
    image: string
}

export interface TeamCardProps {
    imageSrc: string,
    name: string,
    profession: string,
    facebookLink: string,
    twitterLink: string,
    instagramLink: string,
}