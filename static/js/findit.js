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

/* console.log(createBlocks(4));
console.log(totalCombinations(4)); */