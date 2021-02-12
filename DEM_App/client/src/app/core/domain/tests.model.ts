export interface Test {
    test_id: number,
    patient_id: number,    
    score: number,
    comments: string
}

export const defaultTest: Test = {
    test_id: null,
    patient_id: null,    
    score: null,
    comments: ""
};

export interface SubTest {
    test_id: number,
    sub_test_id: number,
    sub_test_type_id:number, 
    audio: any, 
    audio_text: string, 
    time: number, 
    additions: number, 
    deletions: number, 
    substitutions: number,
    transpositions: number,
    mistakes_list: any[]
}

export const defaultSubTest: SubTest = {
    test_id: null,
    sub_test_id: null, 
    sub_test_type_id: null,
    audio: null, 
    audio_text: "", 
    time: null, 
    additions: 0, 
    deletions: 0, 
    substitutions: 0,
    transpositions: 0,
    mistakes_list: []
};

export interface subTestType {
    subTestId: number;
    subTestTitle: string;
}

export const subTests: subTestType[] = [
    {
        subTestId: 1,
        subTestTitle: 'Vertcal A'
    },
    {
        subTestId: 2,
        subTestTitle: 'Vertcal B'
    },
    {
        subTestId: 3,
        subTestTitle: 'Horizontal'
    }
];