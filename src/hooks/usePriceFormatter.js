export function usePriceFormatter(){
    function formatPrice(price){
        // price = String(price)
        // console.log('form p',price)
        //remove leading zeros
        if(price[0]==='0'){
            price=price.replace('0','')
            if(price[0]==='0') price=price.replace('0','')
        }
        // console.log(price)
        //find index of decimal
        const decimalIndex = price.indexOf('.');
        // console.log(decimalIndex)
        if(decimalIndex>=0){
            //if decimal is -3 price has 2 decimal places. otherwise it has one
            if(price[decimalIndex]===price[price.length-3] && price.length >= '0.00'.length) return `$${price}`;
            if(decimalIndex===0){
                if(price[decimalIndex]===price[price.length-3]) return `$0${price}`;
                else return `$0${price}0`
            }
            else if(price[decimalIndex]===price[price.length-2]) return `$${price}0`;
            else return `$${Number(price).toFixed(2)}`;
        }else{ // no decimal found.
            // if price has a value or is 0
            if(price) return `${price}.00`;
            else return '$0.00'
        }
    }
    return {formatPrice};
}
export default usePriceFormatter;