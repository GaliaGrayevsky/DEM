export type LANG_TYPE = {
    lang_code: string,
    long_name: string
}

export const LANGS: LANG_TYPE[] = [
    {
        lang_code: 'he',
        long_name: 'Hebrew'
    },
    {
        lang_code: 'en',
        long_name: 'English'
    },
    {
        lang_code: 'ru',
        long_name: 'Russian'
    },
    {
        lang_code: 'ar',
        long_name: 'Arabic'
    }
];

export enum SEX {
    MALE = 'Male',
    FEMALE = 'Female'
}

export const getLanguageLongName = function(lang_code: string): string | null {
    for (let i=0; i < LANGS.length; i++){
        if (LANGS[i].lang_code == lang_code){
            return LANGS[i].long_name;
        }
    }

    return null;
}

/**
 * Sub test types
 */

 export type SUBTEST_TYPE = {
     test_type_id: number;
     title: string
 }

 export const SUBTESTS: SUBTEST_TYPE[] = [
     {
        test_type_id: 1,
        title: 'Vertical A'
     },
     {
        test_type_id: 2,
        title: 'Vertical B'
     },
     {
        test_type_id: 3,
        title: 'Vertical Horizontal'
     },
 ]

 export const enum COLORS {
    'INSERT' = '#9cd694',
    'DELETE' = '#d3b0b0',
    'REPLACE' = '#f1e67b',
    'TRANSPOSE' = '#9495d6'
 }