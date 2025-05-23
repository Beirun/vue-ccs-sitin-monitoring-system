export type CurrentSitin = {
    sitin_id: string
    idno: string
    firstname: string
    middlename: string
    lastname: string
    email: string
    username: string
    course: string
    yearlevel: string
    poke_icon: string
    sitin_purpose: string
    sitin_laboratory: string
    sitin_timein: string
}

export type Sitin = {
    sitin_id: string
    idno: string
    fullname: string
    course: string
    yearlevel: string
    sitin_purpose: string
    sitin_laboratory: string
    sitin_timein: string
    sitin_timeout: string
}

export type SitinByStudent = {
    sitin_id: string
    sitin_purpose: string
    sitin_laboratory: string
    sitin_timein: string
    sitin_timeout: string
    sitin_feedback: string
}

export type SitinFeedback = Sitin & {
    sitin_feedback: string
}

