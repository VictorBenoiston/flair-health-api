export interface IPatient {
    id: string, 
    full_name: string,
    birthdate: string,
    ssn: string,
    contact_number: string,
    email?: string,
    medical_history: string ,
    address: string ,
    gender: string ,
    has_insurance: boolean,
    insurance_carrier?: string | null,
    user_id: string,
    // profile_picture_url?: string,
    created_at?: string,
    updated_at?: string
}
