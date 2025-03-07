import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PriceInput from '../components/PriceInput'
import ModalDeleteItem from '../components/ui/modals/ModalDeleteItem';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';
import '../assets/pages/menus.css';
import Item from '../models/Item';
// import useClickOutside from '../hooks/useClickOutside';


const EditMenu = () => {
    const { id } = useParams();
    const {menus, error} = useSelector((state)=>state.menus);
    const [menu, setMenu] = useState(null);
    // const [newSectionFlag, setNewSectionFlag] = useState(false);
    const [newItemFlag, setNewItemFlag] = useState([]);
    const [newItem, setNewItem] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState({});
    const [activeSectionIndex, setActiveSectionIndex] = useState(null);
    const [activeSectionRef, setActiveSectionRef] = useState(null);
    const [activeItemIndex, setActiveItemIndex] = useState(null);
    const [activeItemRef, setActiveItemRef] = useState(null);
    const [activeNewItemRef, setActiveNewItemRef] = useState(null);
    const [viewFlags, setViewFlags] = useState([])
    const [editFlags, setEditFlags]=useState({
        menuName: false,
        sections: []
        //sections:[     
        // {name: false, description: false, items: [{
        //      name: false, price: false, despcription: false
        //   }]}]
    });
    const menuNameInputRef = useRef(null);
    const sectionNameInputRef = useRef([]);
    const sectionDescriptionInputRef = useRef([]);
    const newItemNameInputRef=useRef([]);
    const newItemDescriptionInputRef=useRef([]);
    const itemNameInputRef = useRef([]);
    // const newItemPriceInputRef=useRef([])
    const itemDescriptionInputRef = useRef([]);
    

    const handleView = (field, index) => {
        console.log(index)
        console.log(viewFlags)
        setViewFlags((prev)=>(
            prev.map((view,i)=>
                (i===index) ? {
                    options: false,
                    addOns: false,
                    removes: false,
                    [field]: !view[field]
                } : view
            )
        ))
    }
    const OAR = ['options','addOns','removes'];
    const findIndex = (secIn,itIn) => {
        return menu.sections.slice(0,secIn).reduce((index, section)=>index + section.items.length,0)+itIn;
    }
    const handleMenuName = () => {
        setEditFlags({...editFlags, menuName: !editFlags['menuName']});
    }
    const handleOnChangeMenuName = (e) => {
        setMenu({...menu, name: e.target.value})
        //later will call db to update
    }
    const handleSectionFlag = (i, field) => {
        setEditFlags((prev)=>({
            ...prev,
            sections: prev?.sections?.map((section, index)=>
            index===i ? {...section, [field]: !section[field]} : section
        )}))
        // console.log(activeSectionIndex)
        setActiveSectionRef((prev)=> (prev===null) ? field : null)
        setActiveSectionIndex((prev) => (prev===null) ? i : null)
    }
    const handleItemFlag = (i,j, field, isNew) => {
        // console.log('handleItemFlag: ',field)
        // console.log(i, j, field, isNew)
        if(isNew){
            // console.log('isnew')
            setNewItemFlag((prev) => 
                prev.map((item, index)=>
                    (index === i) ? {...item,  [field]: !item[field]} : item
                )
            )
            // console.log('after', newItemFlag)
            field !== 'show' ? setActiveNewItemRef((prev) => (prev===null) ? field : null) : null;
            field !== 'show' ? setActiveSectionIndex((prev) => (prev===null) ? i : null) : null;
        }
        else{
            // console.log('not new', i, j, field, isNew)
            setEditFlags((prev) => ({
                ...prev,
                sections: prev.sections.map((section, index) => {
                    if (index === i) {
                        return {
                            ...section,
                            items: section.items.map((item, jndex) =>
                                jndex === j ? { ...item, [field]: !item[field] } : item
                            )
                        };
                    }
                    return section;
                })
            }));
            const itemIndex = findIndex(i,j);
            setActiveItemRef((prev) => (prev===null) ? field : null);
            setActiveItemIndex((prev) => (prev===null) ? itemIndex : null);
        }
    }
    const handleOnKeyDownItem = (e, i, j, field, isNew) =>{
        // console.log('key up', e.target.value)
        // console.log('on input', e.key)
        // console.log(i, j , field)
        if(isNew){
           if(e.key ==='Enter'){
                // handleNewItemFlag(i, field)
                handleAddNewItem(i);
            }
            else if(e.key ==='Tab'){
                e.preventDefault();
                // console.log('tab')
                switch(field){
                    case 'name':
                        // handleNewItemFlag(i, 'name');
                        handleItemFlag(i,null,'price', true);
                    break;
                    // case 'price':
                    //     handleNewItemFlag(i,'description');
                    // break;
                }
            }  
        }else{
            e.preventDefault();
            if(e.key ==='Enter'){
                // console.log(e.key)
                handleItemFlag(i,j, 'name', false)
                // handleAddNewItem(i);
            }
            else if(e.key ==='Tab'){
                // e.preventDefault();
                // console.log('tab')
                handleItemFlag(i,j,'price', false);
            } 
        }       
    }
    const handleAddNewItem=(i) => {
        console.log(newItem)
        //add new Item to local render
        if(newItem[i].name){
            setMenu((prev)=>({
                ...prev, sections: prev.sections.map((section, index)=>
                index===i ? {...section, items:[...section.items, {
                    name: newItem[i].name,
                    price: newItem[i].price,
                    description: newItem[i].description
                }]} : section)
            }));
            //add edit flag for newly created item
            setEditFlags((prev)=>({
                ...prev, sections: prev.sections.map((section,index)=>
                    index===i ? {...section, items: [...section.items, {
                        name: false,
                        price: false,
                        description: false
                    }]} : section)}))
            //reset newly created item to default new item
            setNewItem((prev)=>
                prev.map((item, index)=>
                    (index===i) ? new Item() : item
            ));
            //close new item render
            handleItemFlag(i, null, 'name', true)
            handleItemFlag(i, null,'show', true)
        }
    }
    const handleOnChangeItem = (e, i, j, field, isNew) => {
        let value= (field==='price') ? e : e.target.value;
        if(isNew){
            let value = (field==='price') ? e : e.target.value;
            setNewItem((prev)=>
                prev.map((item, index)=>
                    (index===i) ? {...item, [field]:value } : item
            ));
        }
        else{
           setMenu((prev)=>({
                ...prev,
                sections: prev.sections.map((section, index)=>{
                    if(index===i){
                        return {
                            ...section,
                            items: section.items.map((item,jndex)=>
                                jndex===j ? { ...item, [field]: value} : item
                            )
                        }
                    }
                    return section;
                })
            }))  
        }
    }
    const handlePriceTab = (i,j, isNew) =>{
        // console.log('h price tab')
        // console.log(i, j , isNew)
        if(isNew) handleItemFlag(i,null,'description', true);
        else handleItemFlag(i,j, 'description', false);
    }
    const handleOnChangeSection = (e, i, field)=>{
        // console.log(e.target.value)
        setMenu((prev)=>({
            ...prev, sections: prev.sections.map((section, index)=>
            index===i ? {...section, [field]: e.target.value} : section)
        }))
    }
    const handleDeleteModal = (item, sectionId) =>{
        if(!openModal) setDeleteItem({...item,sectionId});
        else setDeleteItem(null);

        setOpenModal(!openModal);
    }
    const handleDeleteItem = () => {
        console.log('x', menu)
        setMenu((prev)=>({
            ...prev,
            sections: prev.sections.map(section=>{
                if(section._id===deleteItem.sectionId){
                    return {
                        ...section,
                        items: section.items.filter(item=>item._id!==deleteItem._id )  
                    }
                }
                return section;
            })
        })) 
        // menu.sections.forEach(section=>{
        //     section.items = section.items.filter(item=> item._id !== deleteItem._id)
        // })
        setOpenModal(false)
    }
    const focusInput = (ref) => {
        console.log(ref)
        ref?.focus();
    }
    useEffect(() => {
        // console.log('ue', newItemNameInputRef, activeSectionIndex)
        console.log(activeNewItemRef)
        switch(activeNewItemRef){
            case 'name':
                focusInput(newItemNameInputRef.current[activeSectionIndex])
                break;
            // case 'price':
            //      focusInput(newItemPriceInputRef.current[activeSectionIndex])
            //     break;
            case 'description':
                focusInput(newItemDescriptionInputRef.current[activeSectionIndex]);
                newItemDescriptionInputRef.current[activeSectionIndex].selectionStart = newItemDescriptionInputRef.current[activeSectionIndex].innerHTML.length;
                break;
        }
        // focusInput(newItemNameInputRef.current[activeSectionIndex])
    },[activeSectionIndex, activeNewItemRef]);
    useEffect(() => {
        if(menuNameInputRef.current && editFlags['menuName']){
            menuNameInputRef.current.focus();
        }
    },[editFlags]);
    useEffect(() => {
        switch(activeSectionRef){
            case 'name':
                focusInput(sectionNameInputRef.current[activeSectionIndex])
                break;
            case 'description':
                focusInput(sectionDescriptionInputRef.current[activeSectionIndex])
                break;
        }
        
    },[activeSectionIndex, activeSectionRef]);
    useEffect(() => {
        console.log('ref',itemNameInputRef.current, activeItemIndex)
        switch(activeItemRef){
            case 'name':
                focusInput(itemNameInputRef.current[activeItemIndex])
                break;
            case 'description':
                focusInput(itemDescriptionInputRef.current[activeItemIndex]);
                // console.log(itemDescriptionInputRef.current[activeItemIndex].innerHTML.length)
                itemDescriptionInputRef.current[activeItemIndex].selectionStart = itemDescriptionInputRef.current[activeItemIndex].innerHTML.length;
                break;
        }
        // focusInput(itemNameInputRef.current[activeItemIndex])
    },[activeItemIndex, activeItemRef]);
    useEffect(() => {
        // console.log('wake up', menus.length, id)

        const findMenu = menus.find(menu=> menu._id === id);

        if(!findMenu) return;
        const updatedEditFlags = {...editFlags, sections: []}
        const updatedNewItemFlags = [];
        const updatedNewItem = [];
        const updatedViewFlags = [];
        for(const section of findMenu.sections){
            updatedNewItemFlags.push({
                show: false,
                name: false,
                price: false,
                description: false
            });
            // let item = new Item();
            // item.name = 'new item '+i;
            updatedNewItem.push(new Item());
            for(let i=0;i<section.items.length;i++){
                updatedViewFlags.push({
                    options: false,
                    addOns: false,
                    removes: false
                });
            }
            updatedEditFlags.sections.push({
                name: false,
                description: false,
                items: section.items.map(() => ({
                    name: false,
                    price: false,
                    description: false
                }))
            })
        }

        setNewItem(updatedNewItem)
        setNewItemFlag(updatedNewItemFlags)
        setEditFlags(updatedEditFlags)
        setViewFlags(updatedViewFlags)
        setMenu(findMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, menus.length]);
    useEffect(() => {
        console.log('New Items:', newItem);
        console.log('New Item Flags:', newItemFlag);
         console.log('new view flags:',viewFlags);
        console.log('Edit Flags:', editFlags);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newItem, newItemFlag, editFlags]);
    useEffect(()=>{
       let input = document.querySelector('input');
       if(input) input.focus();
    },[viewFlags])
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
                        {!editFlags?.sections[i].name && <span onClick={()=>handleSectionFlag(i, 'name')}>{section.name}</span>}
                        {editFlags?.sections[i].name && 
                            <input type='text'
                                ref={(el)=>sectionNameInputRef.current[i]=el}
                                value={section.name}
                                onChange={(e)=>handleOnChangeSection(e,i, 'name')}
                                onBlur={()=>handleSectionFlag(i, 'name')}
                            />}
                            <div className='new-item'>
                                <label htmlFor='new-item'>New Item</label>
                                <button onClick={()=>handleItemFlag(i,null, 'show', true)}>
                                    <Icon path={mdiPlus} size={0.4}/>
                                </button>
                            </div>
                        </div>
                        <div className="section-description">
                            {!editFlags.sections[i].description && <span onClick={()=>handleSectionFlag(i,'description')}>{section.description}</span>}
                            {editFlags.sections[i].description &&
                                <input type='text'
                                    ref={(el)=>sectionDescriptionInputRef.current[i]=el}
                                    value={section.description}
                                    onChange={(e)=>handleOnChangeSection(e,i,'description')}
                                    onBlur={()=>handleSectionFlag(i,'description')}
                            />}
                        </div>
                       <div className="section-container edit">
                            {newItemFlag[i].show && 
                                <div className='item-container'>
                                    <div className="item-name edit">
                                        <span className="item-button">
                                            <button onClick={()=>handleAddNewItem(i)}>
                                                <Icon
                                                    path={mdiPlus}
                                                    size={0.5}
                                                />
                                            </button>
                                            {!newItemFlag[i].name ?( newItem[i].name.length ? <span onClick={()=>handleItemFlag(i,null,'name', true)}>{newItem[i].name}</span>
                                                : <span onClick={()=>handleItemFlag(i,null,'name', true)}>{'new item name'}</span>
                                            ) :
                                                (<input type='text'
                                                    ref={(el)=>newItemNameInputRef.current[i]=el}
                                                    value={newItem[i]?.name}
                                                    onKeyDown={(e)=>handleOnKeyDownItem(e,i,null,'name', true)}
                                                    onChange={(e)=>handleOnChangeItem(e,i,null,'name', true)}
                                                    // onChange={(e)=>e.preventDefault()}
                                                    onBlur={()=>handleItemFlag(i,null,'name',true)}
                                                />)}
                                        </span>
                                        {!newItemFlag[i].price && <span onClick={()=>handleItemFlag(i,null,'price', true)}>{newItem[i].price}</span>}
                                        {newItemFlag[i].price && 
                                            <PriceInput type='text' 
                                                price={newItem[i].price}
                                                setPriceOnChange={(p)=>handleOnChangeItem(p,i,null,'price', true)} 
                                                handleOnBlur={() => handleItemFlag(i,null,'price', true)}
                                                handlePriceTab={()=>handlePriceTab(i,null, true)}
                                            />}
                                    </div>
                                    <div className="item-description edit">
                                    {!newItemFlag[i].description ? ( newItem[i].description.length ? 
                                        <span onClick={()=>handleItemFlag(i,null,'description', true)}>{newItem[i].description}</span> : 
                                        <span onClick={()=>handleItemFlag(i,null,'description', true)}>{'new item description'}</span>
                                    ) :
                                    <textarea
                                        ref={(el)=>newItemDescriptionInputRef.current[i]=el}
                                        value={newItem[i]?.description}
                                        onChange={(e)=>handleOnChangeItem(e,i,null,'description', true)}
                                        onBlur={()=>handleItemFlag(i,null,'description', true)}
                                    ></textarea>}
                                    </div>
                                </div>}
                            {section.items.map((item,j)=>(
                                <div className="item-container edit" key={j} 
                                    style={{height: viewFlags[findIndex(i,j)]?.['addOns'] ? '100%' : '8.7rem'}}>
                                    <div className="item-name edit">
                                        <span className='item-button'>
                                            <button onClick={()=>handleDeleteModal(item, section._id)}>
                                                <Icon
                                                    path={mdiClose}
                                                    size={0.5}
                                                />
                                            </button>
                                            {!editFlags.sections[i].items[j].name && <span onClick={()=>handleItemFlag(i,j,'name', false)}>{item.name}</span>}
                                            {editFlags.sections[i].items[j].name && 
                                                <input type='text'
                                                    ref={(el)=>itemNameInputRef.current[findIndex(i,j)]=el}
                                                    value={item.name}
                                                    onKeyDown={(e)=>handleOnKeyDownItem(e,i,j,'name', false)}
                                                    onChange={(e)=>handleOnChangeItem(e,i,j,'name', false)}
                                                    onBlur={()=>handleItemFlag(i,j,'name', false)}
                                                />}
                                        </span>
                                        {!editFlags.sections[i].items[j].price && <span onClick={()=>handleItemFlag(i,j,'price', false)}>{item.price}</span>}
                                        {editFlags.sections[i].items[j].price && 
                                        <PriceInput type='text' 
                                            price={item.price} 
                                            setPriceOnChange={(p)=>handleOnChangeItem(p,i,j,'price',false)} 
                                            handleOnBlur={() => handleItemFlag(i,j,'price', false)}
                                            handlePriceTab={()=>handlePriceTab(i,j, false)}
                                        />}
                                            
                                    </div>
                                    <div className="item-description edit">
                                        {!editFlags.sections[i].items[j].description ? ( item.description.length ? (<span onClick={()=>handleItemFlag(i,j,'description', false)}>{item.description}</span>):
                                        <span onClick={()=>handleItemFlag(i,j,'description', false)}>{'add item description'}</span>) :
                                        <textarea
                                            ref={(el)=>itemDescriptionInputRef.current[findIndex(i,j)]=el}
                                            value={item.description}
                                            onChange={(e)=>handleOnChangeItem(e,i,j,'description',false)}
                                            onBlur={()=>handleItemFlag(i,j,'description',false)}
                                        ></textarea>} 
                                    </div>
                                    <div className="tabs">
                                        <div className="tab-titles">
                                            {/* {viewFlags[findIndex(i,j)]} */}
                                            {OAR.map((oar,k)=>(
                                                <button key={k}
                                                    style={{borderBottom: viewFlags[findIndex(i,j)]?.[oar] ? '0.0625rem solid' : '0.0625rem solid transparent'}}
                                                    onClick={()=>handleView(oar, findIndex(i,j))}>{oar}</button>
                                            ))}
                                        </div>
                                        
                                            {viewFlags[findIndex(i,j)]?.['addOns'] && 
                                                <div className="tab-content">
                                                    <button>
                                                        <Icon path={mdiPlus} size={0.4}/>
                                                    </button>
                                                    <input type='text' />
                                                    {/* ref={addOnInputRef} */}
                                                </div>
                                            }
                                            {viewFlags[findIndex(i,j)]?.['removes'] && 
                                                <span>
                                                    <button>
                                                        <Icon path={mdiPlus} size={0.4}/>
                                                    </button>
                                                    <input type='text' />
                                                    {/* ref={removesInputRef} */}
                                                </span>
                                            }
                                        {/* </div> */}
                                    </div>
                                </div>
                            ))}
                       </div>
                    </div>
                ))}
            </div>}
            {openModal && <ModalDeleteItem item={deleteItem} closeCancel={handleDeleteModal} closeDelete={handleDeleteItem} />}
        </>
    )
}
export default EditMenu;