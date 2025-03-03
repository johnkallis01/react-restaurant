import PropTypes from 'prop-types';
import { useMemo } from 'react';
// import '../assets/components/displaymenu.css';
// import { useEffect } from 'react';

const DisplaySchedule = ({days}) => {
    function printTimes(start, end){
        return (start.hour%12 ? start.hour%12 : '12') + ':' + 
        (start.min ? start.min : '00') + 
         (start.pm ? ' PM ' : ' AM ') + '-' + 
         (end.hour%12 ? end.hour%12 : '12') + ':' +
          (end.min ? end.min : '00') + 
          (end.pm ? ' PM' : ' AM');
    }
    // useEffect(() => {
    //     console.log('display schuedle',days)
    // })
    const sameTimes = useMemo(() => {
        if(!days || !days.length) return [];
        const openDays = days.filter(day=>day.open);
        
        if(!openDays.length) return [];
        let outterArr = []; //groupedDays[]
        let stringArr = []; //result
        let innerArr = [openDays[0]]; //tempGroup

        stringArr.push({
            names: innerArr[0].day.name,
            times: { start: innerArr[0].start, end: innerArr[0].end}
        });

        for(let i=1; i<openDays.length; i++){
            const prevDay = innerArr[0];
            const current = openDays[i];
            // console.log(prevDay)
            // console.log(current)
            if(prevDay.start.hour===current.start.hour &&
                prevDay.end.hour === current.end.hour &&
                prevDay.start.min === current.start.min &&
                prevDay.end.min === current.end.min){
                    // console.log('push current')
                innerArr.push(current)
            }else{
                // console.log('else')
                outterArr.push(innerArr);
                innerArr=[current];
                stringArr.push({
                    names: innerArr[0].day.name,
                    times: {start: innerArr[0].start, end: innerArr[0].end}
                });
            }
        }

        if(innerArr.length) outterArr.push(innerArr);

        outterArr.forEach((arr, i)=>{
            if(arr.length > 1) stringArr[i].names+=`-${arr[arr.length-1].day.name}`;
            stringArr[i].times=printTimes(stringArr[i].times.start, stringArr[i].times.end)
        });
        // console.log(outterArr)
        // console.log(stringArr)
        return stringArr;
    },[days]);
    if (sameTimes.length === 0) return <p>No schedule data</p>;
    return (
        <div className="schedule">
            <ul>
                {sameTimes.map((days,i)=>(
                    <li key={i}>
                        <span className='name'>{days.names+": "}</span>
                        <span className='time'>{days.times}</span>  
                    </li>
                ))}
            </ul>
        </div>
    )
    
}
DisplaySchedule.propTypes={
    days: PropTypes.array.isRequired,
}
export default DisplaySchedule;