import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../assets/pages/menus.css';
const EditMenu = () => {
    const { id } = useParams();
    const {menus, error} = useSelector((state)=>state.menus);
    const [menu, setMenu] = useState(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(null);
    const [editFlags, setEditFlags]=useState({
        menuName: false,
        sections: []
        //section:[     
        // {name: false, description: false, items: [{
        //      name: false, price: false, despcription: false
        //   }]}]
    });
    const menuNameInputRef = useRef(null);
    const sectionNameInputRef = useRef([]);
    // const sectionDescripInputRef = useRef(null);
    // const itemNameInputRef = useRef(null);
    // const itemPriceInputRef = useRef(null);
    // const itemDescripInputRef = useRef(null);

    
    const handleMenuName = () => {
        if(editFlags['menuName']){
            setEditFlags({...editFlags, menuName:false})
        }else{
           setEditFlags({...editFlags, menuName: true}); 
        }
    }
    const handleOnChangeMenuName = (e) => {
        setMenu({...menu, name: e.target.value})
        //later will call db to update
    }
    const handleSectionName = (i) => {
        if(editFlags.sections[i].name){
            setEditFlags((prev)=>({
                ...prev,
                sections: prev.sections.map((section, index)=>
                index===i ? {...section, name: false} : section
            )}))
            setActiveSectionIndex(null)
        }else{
            setEditFlags((prev)=>({
                ...prev,
                sections: prev.sections.map((section, index)=>
                index===i ? {...section, name: true} : section
            )}))
            setActiveSectionIndex(i)
        }
    }
    const handleOnChangeSectionName = (e, index)=>{
        // setMenu({...menu, section[index]})
        menu.section[index].name=e.target.value;
    }
    const focusInput = (ref) => {
        console.log(ref)
        ref?.focus();
    }
    useEffect(() => {
        if(menuNameInputRef.current && editFlags['menuName']){
            menuNameInputRef.current.focus();
        }
    },[editFlags])
    useEffect(() => {
        focusInput(sectionNameInputRef.current[activeSectionIndex])
    },[activeSectionIndex]);
    // useEffect(() => {
    //     focusInput(sectionDescriptionInputRef.current[activeSectionIndex])
    // },[activeSectionIndex]);
    // useEffect(() => {
    //     focusInput(itemNameInputRef.current[activeItemIndex])
    // },[activeItemIndex]);
    // useEffect(() => {
    //     focusInput(itemPriceInputRef.current[activeItemIndex])
    // },[activeItemIndex]);
    // useEffect(() => {
    //     focusInput(itemDescriptionInputRef.current[activeItemIndex])
    // },[activeItemIndex]);
    useEffect(() => {
        const findMenu = menus.find(menu=> menu._id === id);
        if(!findMenu) return;
        const updatedEditFlags = {...editFlags, sections: []}
        // editFlags['sectionName']=Array(menu.sections.length).fill(false);
        // editFlags['sectionDescrip']=Array(menu.sections.length).fill(false);
        findMenu.sections.forEach((section, i)=>{
            updatedEditFlags.sections[i] = {
                name: false,
                description: false,
                items: section.items.map(() => ({
                    name: false,
                    price: false,
                    description: false
                }))
            }
        })
        setEditFlags(updatedEditFlags)
        setMenu(findMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);   

    if(error) return <p>Error: {error}</p>

    return (
        <>
          {menu && 
            <div className='display-menu'>
                <div className="menu-name" >
                    {!editFlags['menuName'] && <span onClick={handleMenuName}>{menu.name}</span>}
                    {editFlags['menuName'] && 
                        <input type='text'
                            ref={menuNameInputRef}
                            value={menu.name}
                            onChange={handleOnChangeMenuName}
                            onBlur={handleMenuName}
                        />}
                </div>
                {menu.sections.map((section,i)=>(
                    <div key={i} className='section edit'>
                       <div className='section-name edit'>
                        {!editFlags.sections[i].name && <span onClick={()=>handleSectionName(i)}>{section.name}</span>}
                        {editFlags.sections[i].name && 
                            <input type='text'
                                ref={(el)=>sectionNameInputRef.current[i]=el}
                                value={section.name}
                                onChange={()=>handleOnChangeSectionName(i)}
                                onBlur={()=>handleSectionName(i)}
                            />}
                        
                        </div>
                       <div className="section-container edit">
                            {section.items.map((item,j)=>(
                                <div className="item-container edit" key={j}>
                                    <div className="item-name edit">{item.name}</div>
                                    <div className="item-description edit">{item.description}</div>  
                                </div>
                            ))}
                       </div>
                    </div>
                ))}
            </div>}
        </>
    )
}
export default EditMenu;