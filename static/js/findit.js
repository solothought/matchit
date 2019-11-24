/**
 * Generate all possible blocks having 1 symbol common between any 2 blocks
 * @param {number} size : number of symbols in a block
 */
function createBlocks(size){
    p = size-1;

    var cards = [];
    for(var i=0; i< p; i++){
        var set = [];
        set.push(p*p);
        for(var j=0; j < p ; j++ ){
            set.push( i * p + j );
        }
        cards.push(set) ;
    }

    for(var i=0; i<p; i++){
        for(var j=0; j < p ; j++ ){
            var set = [];
            set.push(p * p + 1 + i);
            for(var k=0; k < p ; k++ ){
                set.push( k * p + (j + i * k) % p )  ;
            }
            cards.push( set);
        }
    }
    
    var set = [];
    for(var i=0; i<p+1; i++){
        set.push(p * p + i);
    }
    cards.push( set ) ;

    return cards;
}

function totalCombinations(n){
    p = n-1;
    return Math.pow(p,2) + p + 1;
}

function createBlocksForNonPrime(size){
    var blocks = [];
    var matrix = new Array([7]);


}

//console.log(createBlocks(9));
//console.log(totalCombinations(9));

//test

const SymbolsOnACard = 6; // n = 2, 3, 4, 6, 8, 12, 14, 18, 20, 24, 30, 32; n-1 is a prime number
const blocks = createBlocks( SymbolsOnACard );
//console.log(totalCombinations( SymbolsOnACard ));

function checkForCardWithoutCommonSymbol(){

    console.log("Looking for cards with no common symbol");
    //let unmatchingCards = new Set();
    const unmatchingCards = {};
    
    let counter = 0;
    for(let i=0;i<blocks.length; i++){
        let unmatchingCounter = 0;
        let matchingCounter = 0;
        for(let j=0;j<blocks.length; j++){
            if(i===j) continue;
            if( doesIntersect( blocks[i], blocks[j]) ) {
                matchingCounter++;
            }else{
                //console.log(`${blocks[j]} is not matching with ${blocks[i]}`)
                unmatchingCounter++;
                counter++;
                //unmatchingCards.push({I:i, card: blocks[j]});
                if( !unmatchingCards[i] ) unmatchingCards[i] = [ blocks[i] ];
                //unmatchingCards[i].push({index: j, cards: blocks[j] });
                //unmatchingCards[i].push(blocks[j]);
                unmatchingCards[i].push(j);
            }
        }
    
        if(matchingCounter === (blocks.length -1) ){
            //console.log("Complete match", i, blocks[i]);
        }
    }
    console.log("Unmatching Cards:" , unmatchingCards);
    console.log("Total Unmatching Cards:" , Object.keys(unmatchingCards).length );
    if( Object.keys(unmatchingCards).length > 0){
        console.log("Each card is unmatching with" , unmatchingCards[ Object.keys(unmatchingCards)[0] ].length - 1,  " cards" );
    }
    //console.log("Unmatching Cards:" , JSON.stringify(unmatchingCards, null,1 ) );
}

function doesIntersect(arr1, arr2){
    for(let i=0;i<arr1.length; i++){
        if(arr2.indexOf(arr1[i]) !== -1) return true;
    }
    return false;
}

//checkForCardWithoutCommonSymbol();