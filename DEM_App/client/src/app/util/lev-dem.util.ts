export const HORIZONTAL_TRANSCRIPT = '37598257461476379392432175374874652923646329174652537484521779392147632574637598';
export const HORIZONTAL_TRANSCRIPT_X = '3x75xx9xx825xx7x4xx61xx4x7x6x37x9x3x9xx243xxx2xx175xx3x7x4x874x65xxxx29x2xx3x6x4632x9xxxx17xxx4x65x25x37xx4xx84xx5x2xx17793xx9xxx21xx4xx7x632x5x7xx4x637x5xx9xx8';

export const VERTICAL_A_TRANSCRIPT = '3759825746147637939245217537487465292364';
export const VERTICAL_A_TRANSCRIPT_DISPLAY = '3475529187255377446817447665327992339624';
export const VERTICAL_B_TRANSCRIPT = '6329174652537484521779392147632574637598';
export const VERTICAL_B_TRANSCRIPT_DISPLAY = '6739239912714467562352357744864357251978';

export type Distance = {
    additions: number;
    deletions: number;
    substitutions: number;
    transpositions: number;
    text: string;
    ops: any[]
}

export const mapDigits = {
    'one': 1,
    'two': 2,
    'to': 2,
    'too': 2,
    'three': 3,
    'tree': 3,
    'sweet': 3,
    'free': 3,
    'four': 4,
    'for': 4,
    '4 or': 4,
    'or':4,
    'point':4,
    '\\.': 4,
    'full': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'один': 1,
    'раз': 1,
    'два': 2,
    'три': 3,
    'четыре': 4,
    'пять': 5,
    'шесть': 6,
    'семь': 7,
    'всем': 7,
    'восемь': 8,
    'девять': 9,
    'אחד': 1,
    'אחת': 1,
    'שתיים': 2,
    'שניים': 2,
    'שלוש': 3,
    'שלושה': 3,
    'ארבע': 4,
    'ארבעה': 4,
    'חמש': 5,
    'חמשה': 5,
    'שש': 6,
    'ששה': 6,
    'שבע': 7,
    'שבעה': 7,
    'שמונה': 8,
    'תשע': 9,
    'תשעה': 9
}

export function cleanString(a: string): string {
    for (let key in mapDigits){
        if (a.indexOf(key)>=0){
            let re = new RegExp(key,"g");
            a = a.replace(re,mapDigits[key]);
        }
    }

    /** Removing any spaces or not number chars in the transcript */
    a = a.replace(/\D/g,'');

    return a;
}


/**
 * levenshtein damerau distance algorithm and returns minimal requested 
 * number of opperations needed to convert form source string to target string
 * 
 * @param a string source: in the case of this app, it is card text
 * @param b string target: in the case of this app, it is an transcript
 * 
 */
export function lev_dem_distance (a: string, b:string): Distance{ 
    let m = [];
    let min: Function = Math.min;

    /** Translate words into digits */

    // Fix for . //TODO: make it better AI so will not replace full stops for 4 where it is not required
    if (b.indexOf('.') > -1) {
        b = b.replace('.', '4');
    }

    for (let key in mapDigits){
        if (b.indexOf(key)>=0){
            let re = new RegExp(key,"g");
            b = b.replace(re,mapDigits[key]);
        }
    }

    /** Removing any spaces or not number chars in the transcript */
    b = b.replace(/\D/g,'');;

    if (!a) {
        return {
            additions: b.length,
            deletions: 0,
            substitutions: 0,
            transpositions: 0,
            text: b,
            ops: []        
        }
    }

    if (!b) {
        return {
            additions: 0,
            deletions: a.length,
            substitutions: 0,
            transpositions: 0,
            text: b,
            ops: []                
        }
    }

    for (let i = 0; i <= a.length; i++) {
        m[i] = [i];
    };
    for (let j = 0; j <= b.length; j++){
        m[0][j] = j;
    };

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
			if (a.charAt(i-1) == b.charAt(j-1)) {
				m[i][j] = m[i - 1][j - 1];
			} else {
                m[i][j] = min(
							   m[i - 1][j - 1] + 1,  // substitution
							   min(m[i][j - 1] + 1,  // insertion
							   m[i - 1 ][j] + 1) // deletion
							 )
			}		
					
			if (i > 1 && j > 1 && a.charAt(i-1) == b.charAt(j - 2) && a.charAt(i - 2) && b.charAt(j - 1)) {
				m[i][j] = min(m[i][j], m[i-2][j-2] + 1 /** transposition */); 
			}  
        }
    }
	
	console.log(m);
	// Generate array of the required operations
	
    let ops = [];
    let result = {
                    additions: 0,
                    deletions: 0,
                    substitutions: 0,
                    transpositions: 0,
                    text: b,
                    ops: []               
                }
	let i = a.length;
	let j = b.length;

    let adjustment_index = 0;
	
	while (!(i == 0 && j == 0)) {		
		
		if (i > 1 && j > 1 && a.charAt(i - 1) == b.charAt(j - 2) && a.charAt(i - 2) == b.charAt(j - 1)) { 
			if (m[i-2][j-2] < m[i][j]) {
                ops.push(['transpose', i, i - 1, a.charAt(i - 1), a.charAt(i - 2)]);
                result.transpositions++;
                i -= 2;
                j -= 2;
				continue;
			}		  
		}
		
		//console.log(m[i-1][j-1] , m[i][j-1], m[i-1][j]);
		//console.log(m[i-1][j-1] < m[i][j-1] , m[i-1][j-1] < m[i-1][j],m[i-1][j-1] < m[i][j-1] && m[i-1][j-1] < m[i-1][j]);
		
		
		// Treat the firt column
		if ( j == 0 && m[i-1][j] < m[i][j]) {
            ops.push(['delete', i - 1, i - 1, a.charAt(i - 1)]);
            result.deletions++;
            i -= 1;
			continue;
		}
		
		// Treat the firt column
		if ( i == 0 && m[i][j-1] < m[i][j]) {
            ops.push(['insert', j - 1, j - 1, b.charAt(j - 1)]);
            result.additions++;
            j -= 1;
			continue;
		}
		
		if (m[i-1][j-1] <= m[i][j-1] && m[i-1][j-1] <= m[i-1][j]) {
			if (m[i][j] > m[i-1][j-1]) {
                ops.push(['replace', i - 1, j - 1, a.charAt(i - 1), b.charAt(j - 1)]);
                result.substitutions++;
			}
			
			i -= 1;
            j -= 1;
			continue;
		}
		
		if (m[i][j-1] <= m[i-1][j-1]  && m[i][j-1] <= m[i-1][j]) {
            ops.push(['insert', j - 1, j - 1, b.charAt(j - 1)]);
            result.additions++;
            j -= 1;
			continue;
		}
		
		
		if ( m[i-1][j] <= m[i-1][j-1]  &&  m[i-1][j] <= m[i][j-1]) {
            ops.push(['delete', i - 1, i - 1, a.charAt(i - 1)]);
            result.deletions++;
            i -= 1;
		}
		
	}
		
    console.log(`The distance between ${a} and ${b} is ${+m[a.length][b.length]}`);
    console.log(`Requested operations are: `, ops);

    /* for (let i = ops.length; i--; i>=0){
        console.log(i, ops[i]);
        
        ops[i][1] = ops[i][1] + adjustment_index;
        ops[i][2] = ops[i][2] + adjustment_index;

        if (ops[i][0] == 'delete') {
            adjustment_index++;
        }

        if (ops[i][0] == 'insert') {
            adjustment_index--;
        }
    } */

    result['ops'] = ops;
    console.log('Summary: ', result);
	
	// Generate array of transformations
	
    return result;
}