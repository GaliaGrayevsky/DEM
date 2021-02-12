import { LANGS, LANG_TYPE, SEX } from './constants';

export interface Patient {
    patient_id: number,
    doctor_id: string,
    lang_code: string,
    age: number,
    sex: SEX
}

export const defaultPatient: Patient = {
    patient_id: null,
    doctor_id: null,
    lang_code: LANGS[0].lang_code,
    age: 6,
    sex: SEX.FEMALE
};
