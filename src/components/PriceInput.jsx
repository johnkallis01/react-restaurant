import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import '../assets/components/priceInput.css';
const PriceInput = ({price, setPriceOnChange, handleOnBlur, handlePriceTab}) => {
    const priceRef = useRef(null);
    const [localPrice, setLocalPrice] = useState(price.replace('.',''));
    // const formattedPrice = useMemo(() => {
    //     const leftHandSide = rawPrice.slice(0,-2);
    //     const rightHandSide = rawPrice.slice(-2);
    //     return leftHandSide + '.' + rightHandSide;
    // }, [rawPrice]);
    // useEffect(() => {
    //     console.log('useEf')
    //     localPrice.replace('.','')
    // },[localPrice])
    function moveDecimal(p){
        console.log('fp',p)
        p=p.replace('.','')
        let leftHandSide = p.slice(0,-2);
        let rightHandSide = p.slice(-2);
        // console.log(leftHandSide, rightHandSide)
        return leftHandSide + '.' + rightHandSide;
    }
    const formatPriceInput = (e) => {
        // console.log(e)
        if(e.key==='Enter') handleSendData();
        else if(e.key === 'Tab'){
            e.preventDefault();
            handleSendData();
            handlePriceTab();
        }
        else{
            if(e.key==='Backspace'){
                // console.log('backspace', e.target.value.slice(0,-1))
                setLocalPrice('0'+e.target.value.slice(0,-1));
                // e.target.value = formattedPrice;
                return;
            }
            const inputChar = e.key;
            if(/^\d$/.test(inputChar)){
                // console.log('num')
                setLocalPrice(e.target.value.slice(1)+inputChar)
                return;
            }
        }
        // e.target.value=formattedPrice;
    }
    const handleSendData = () => {
        // console.log(formattedPrice)
        setPriceOnChange(moveDecimal(localPrice));
        handleOnBlur();
        // price='000.00'
    }
    useEffect(() => {
        if(priceRef.current){
            priceRef.current.focus();
        }
    }, [])
  return (
    <span className='price-input'>
        <span className="prefix">$</span>
        <input
            type='text'
            ref={priceRef}
            placeholder='000.00'
            value={moveDecimal(localPrice)}
            onChange={(e)=>e.preventDefault()}
            onBlur={handleSendData}
            onKeyDown={formatPriceInput}
        />
    </span>
  )
}
PriceInput.propTypes = {
    price: PropTypes.string.isRequired,
    setPriceOnChange: PropTypes.func.isRequired,
    handleOnBlur: PropTypes.func.isRequired,
    handlePriceTab: PropTypes.func.isRequired
}
export default PriceInput;