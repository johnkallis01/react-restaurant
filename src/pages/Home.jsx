import { useEffect } from 'react'
const Home = () => {

    useEffect( () => {
        const makeCall = async () => {
            try{
                const response = await fetch('http://localhost:8080/api');
                const data = await response.json();
                console.log(data)
            }catch(err){
                console.log(err)
            }
            
        }
        makeCall();
    })
    return (
    <>
        <div>
            Home
        </div>
    </>
    )
}
export default Home;