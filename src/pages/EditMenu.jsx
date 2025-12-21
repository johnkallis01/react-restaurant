import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useDispatch } from 'react-redux';
import {updateMenu} from '../store/menuSlice';
import PriceInput from '../components/ui/PriceInput'
import ModalDeleteItem from '../components/ui/modals/ModalDeleteItem';
import ModalOptions from '../components/ui/modals/ModalOptions';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';
import '../assets/pages/menus.css';
import Item from '../models/Item';
import { AddOn,Remove } from '../models/Tabs';
import usePriceFormatter from '../hooks/usePriceFormatter';
// import useClickOutside from '../hooks/useClickOutside';

const EditMenu = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const {formatPrice} = usePriceFormatter();
    const {menus, error} = useSelector((state)=>state.menus);
    const [menu, setMenu] = useState(null);
    // const [newSectionFlag, setNewSectionFlag] = useState(false);
    //array of length=sections.length to show new item
    const [newItemFlag, setNewItemFlag] = useState([]);
    const [newItem, setNewItem] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState({});

    

    const [activeSectionIndex, setActiveSectionIndex] = useState(null);
    const [activeSectionRef, setActiveSectionRef] = useState(null);

    const [activeItemIndex, setActiveItemIndex] = useState(null);
    const [activeItemRef, setActiveItemRef] = useState(null);
    
    
    
    
    const [editFlags, setEditFlags]=useState({
        menuName: false,
        sections: []
        //sections:[     
        // {name: false, description: false, items: [{
        //      name: false, price: false, despcription: false
        //   }]}]
    });
    const [addNewItemFlag, setAddNewItemFlag] = useState(false);
    const [newPriceFlag, setNewPriceFlag] = useState(false);
    
    const menuNameInputRef = useRef(null);
    const sectionNameInputRef = useRef([]);
    const sectionDescriptionInputRef = useRef([]);
    const newItemNameInputRef=useRef([]);
    const newItemDescriptionInputRef=useRef([]);
    const itemNameInputRef = useRef([]);
    
    // const newItemPriceInputRef=useRef([])
    const itemDescriptionInputRef = useRef([]);

    /** 
     * @param {HTMLElement} ref - references an <input> DOM element 
     */
    const focusInput = (ref) => {
        // console.log('focus',ref)
        ref?.focus();
    }
    /*****
     *  Options AddOns Removes Logic and data
     ****/
    //constants
    const OAR = ['options','addOns','removes'];
    //state addOns/removes
    const [activeAddOnRef, setActiveAddOnRef] = useState(null);
    const [activeRemovesRef, setActiveRemovesRef] = useState(null);
    const [activeNewItemRef, setActiveNewItemRef] = useState(null);
    const [viewFlags, setViewFlags] = useState([]);
    const [newAddOn, setNewAddOn] = useState(()=>new AddOn());
    const [newRemove, setNewRemove] = useState(()=>new Remove());
    //state options
    const [optionModal, setOptionModal] = useState(false);
    const [optionObject, setOptionObject] = useState({});

    //refs
    const addOnInputRef = useRef({})
    const removesInputRef = useRef({});
    /**
     * @param {string} refKey contains the indices of the section, item, remove 'i-j-k'
     * @param {string} tab 'addOns' or 'removes'
     * @returns the ref key as the array key
     */
    const handleRefKey = (refKey, tab) => {
        // console.log(refKey)
        if(tab==='addOns') setActiveAddOnRef(refKey);
        else if (tab==='removes') setActiveRemovesRef(refKey);
        // console.log(refKey, activeRemovesRef, activeAddOnRef)
        return refKey;
    }
    /**
     * @param {string} field - the tab type 'removes', addOns', 'options'
     * @param {number} index - the section index
     * @param {number} jndex - the item index
     */
    const handleViewTabs = (field, index, jndex) => {
        // console.log(field, index)
        // console.log(viewFlags)
        //map through flags object.
        //if on active index of item set field to true
        //else if item has true value set all to false
        if(field === 'removes' || field === 'addOns'){
            setViewFlags((prev)=>(
                prev.map((view,i)=>{
                    return (i===index) ? {
                        addOns: false, removes: false,
                        [field]: !view[field]
                    } : (view.options || view.addOns || view.removes) ? {
                        addOns: false, removes: false,
                    } : view
                })
            ))
        }
        /**
         * for addOns, removes
         * sets the active addOn ref back to null and creates a new Object for creation
         * 
         * for options sets the option item for the modal and opens the modal
         */
        switch(field){
            case 'addOns':
                setActiveAddOnRef(null);
                setNewAddOn(new AddOn());
                break;
            case 'removes':
                setActiveRemovesRef(null);
                setNewRemove(new Remove());
                break;
            case 'options':
                //set option object and open modal
                setOptionObject({...menu.sections[index].items[jndex], section_id: menu.sections[index]._id});
                setOptionModal(!optionModal);
                break;
        }
    }
    /**
     * 
     * @param {event} e can also be the price if recieving data from PriceInput component
     * @param {number} i section index
     * @param {number} j item index
     * @param {number} k tab index
     * @param {string} field 'name', or 'price'
     * @param {string} tab tab type 'addOns' or 'removes'
     * @param {Boolean} isNew 
     */
    const handleOnChangeTab = (e, i, j,k, field,tab, isNew) => {
        // console.log(e, i, j,k, field,tab, isNew)
        const value= (field==='price') ? e : e.target.value;
        // console.log(value)
        if(isNew){
            //assigns the input to the tab object
            if(tab==='addOns'){
                setNewAddOn((prev)=>{
                    const updated = {
                        ...prev,
                        [field]:value
                    }
                    console.log(updated)
                    return updated;
                })
                console.log(newAddOn)
            }
            else if(tab==='removes'){
                console.log('is new, removes')
                console.log(value)
                setNewRemove({
                    name: value
                })
            }
            console.log(newAddOn)
        }
        else{
            //assigns the input to the existing tab object
           setMenu((prev)=>({
                ...prev,
                sections: prev.sections.map((section, index)=>{
                    if(index===i){
                        return {
                            ...section,
                            items: section.items.map((item,jndex)=>{
                                if(jndex===j){
                                    return {...item,
                                    [tab]: item?.[tab].map((val,kndex)=>
                                        kndex===k ? {...val, [field]:value } : val
                                    )
                                }
                            }
                            return item;
                            })
                        }
                    }
                    return section;
                })
            }))  
        }
    }
    /**
     * 
     * @param {Number} i section index
     * @param {Number} j item index
     * @param {String} tab tab type 'addOns' or 'price'
     */
    const postNewTab = (i,j,tab)=>{
        console.log(newAddOn);
        //adds the new data to the existing menu state
        setMenu((prev)=>({
            ...prev,
            sections: prev.sections.map((section, index)=>{
                if(index===i){
                    return {
                        ...section,
                        items: section.items.map((item,jndex)=>{
                            if(jndex===j && tab==='removes' && newRemove.name){
                                return {...item,
                                    removes: [...item.removes,{
                                        name: newRemove.name,
                                        _id: newRemove._id
                                    }]
                                }
                            }
                            else if(jndex===j && tab==='addOns' && newAddOn.name){
                                return {...item,
                                    addOns: [...item.addOns,{
                                        name: newAddOn.name,
                                        _id: newAddOn._id,
                                        price: newAddOn.price
                                    }]
                                }
                            }
                            return item;
                        })
                    }
                }
                return section;
            })
        }))
        //closes the price input and creates a new AddOn Object
        if(tab==='addOns'){
            setNewPriceFlag(false);
            setNewAddOn(()=>new AddOn());
        } //creates new removes instince
        else if(tab==='removes') setNewRemove(()=>new Remove());
        // adds a new flag to the editFlags object for the newly created data
        setEditFlags((prev)=>({
            ...prev, sections: prev.sections.map((section,index)=>
                index===i ? {...section, 
                    items: section.items.map((item,jndex)=>{
                        if(jndex===j && tab==='removes') {
                            return {
                                ...item,
                                removes: [...item.removes, {
                                    name: false,
                                }]
                            }
                        }
                        else if (jndex===j && tab==='addOns'){
                            return {
                                ...item,
                                addOns: [...item.addOns,{
                                    name: false,
                                    price: false
                                }]
                            }
                        }
                        else{
                            return item;
                        }
                    })
                } : section )}))
    }
    /**
     * 
     * @param {number} i section index
     * @param {number} j item index
     * @param {boolean} isNew 
     */
    const handlePriceTab = (i,j, isNew) =>{
        // console.log('h price tab')
        // console.log(i, j , isNew)
        if(isNew) handleItemFlag(i,null,'description', true);
        else handleItemFlag(i,j, 'description', false);
    }
    const handleOptionModal = (obj) =>{
        // console.log(obj)
        if(!optionModal) setOptionObject(obj);
        else setOptionObject(null);
        setOptionModal(!optionModal);
    }
    /**
     * @param {object} obj item or section object
     *  updates the local menu and 
     *  dispatches update to redux/database
     */
    const handleAddOption = (obj)=>{
        console.log(obj);
        let isItem = obj.section_id ? true : false;
        console.log(isItem)
        if(isItem){
            console.log('item')
            setMenu(prev=>({
                ...prev,
                sections: menu.sections.map(section=>(
                    section._id === obj.section_id ?
                        {...section, 
                            items: section.items.map(item=>(
                                item._id === obj._id ?
                                {...item, options: [...obj.options]} : item
                            ))
                        } : section
                ))
            }))

        }else{
            console.log('section')
            //
            setMenu(prev=>({
                ...prev,
                sections: menu.sections.map(section=>(
                    section._id === obj._id ?
                      {...section, options: [...obj.options]} : section
                ))
            }))

        }
        handleOptionModal(null);
        dispatch(updateMenu(menu));
    }
    /****
     * watches the active ref key
     * focuses the input when the tab is opened
     ****/
    useEffect(() => {
        // console.log(activeAddOnRef)
        // console.log(addOnInputRef.current)
        if(activeAddOnRef){
            focusInput(addOnInputRef.current[activeAddOnRef])
        }
    },[activeAddOnRef]);
    useEffect(() => {
        // console.log(activeRemovesRef)
        // console.log(removesInputRef.current)
        if(activeRemovesRef){
            focusInput(removesInputRef.current[activeRemovesRef])
        }
    },[activeRemovesRef]);

    const findItemIndex = (secIn,itIn) => {
        return menu.sections.slice(0,secIn).reduce((index, section)=>index + section.items.length,0)+itIn;
    }
    const handleMenuName = () => {
        setEditFlags({...editFlags, menuName: !editFlags['menuName']});
        // console.log(editFlags['menuName'])
        if(editFlags.menuName){
            dispatch(updateMenu(menu));
        }
    }
    const handleOnChangeMenuName = (e) => {
        setMenu({...menu, name: e.target.value});
        
        //later will call db to update
    }
    const handleSectionFlag = (i, field) => {
        // console.log('handle seciton flag')
        setEditFlags((prev)=>({
            ...prev,
            sections: prev?.sections?.map((section, index)=>
            index===i ? {...section, [field]: !section[field]} : section
        )}))
        // console.log(editFlags.sections[i][field])
        if(editFlags.sections[i][field]){
            dispatch(updateMenu(menu));
        }
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
            if(editFlags.sections[i].items[j][field]){
                dispatch(updateMenu(menu));
            }
            const itemIndex = findItemIndex(i,j);
            setActiveItemRef((prev) => (prev===null) ? field : null);
            setActiveItemIndex((prev) => (prev===null) ? itemIndex : null);
        }
    }
    const handleOnKeyDownItem = (e, i, j, field, isNew) =>{
        // console.log('key down', e.target.value)
        // console.log('on input', e.key)
        // console.log(i, j , field)
        if(isNew){
            if(e.key ==='Enter'){
                 handleAddNewItem(i);
            }
            else if(e.key ==='Tab'){
                e.preventDefault();
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
            if(e.key ==='Enter'){
                e.preventDefault();
                // console.log(e.key)
                handleItemFlag(i,j, 'name', false)
                // handleAddNewItem(i);
            }
            else if(e.key ==='Tab'){
                e.preventDefault();
                // console.log('tab')
                handleItemFlag(i,j,'price', false);
            }
            else{
                handleOnChangeItem(e,i,j,field,false)
            }

        }       
    }
    const handleAddNewItem=(i) => {
        // console.log(newItem)
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
            // console.log(menu.sections[i].items)
            setAddNewItemFlag(true);
            

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
        // console.log(e,i,j,field, isNew)
        let value= (field==='price') ? e : e.target.value;
        // console.log(value)
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
    
    
    const handleOnChangeSection = (e, i, field)=>{
        // console.log(e.target.value)
        setMenu((prev)=>({
            ...prev, sections: prev.sections.map((section, index)=>
            index===i ? {...section, [field]: e.target.value} : section)
        }))
    }
    const handleDeleteModal = (item, sectionId) =>{
        if(!openDeleteModal) setDeleteItem({...item,sectionId});
        else setDeleteItem(null);

        setOpenDeleteModal(!openDeleteModal);
    }
    const handleDeleteItem = () => {
        // console.log('x', menu)
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
        setOpenDeleteModal(false)
    }
    const handleTabFlag = (i, j, k,tab, field)=>{
        // console.log(i, j, k, field);
        setEditFlags((prev) => ({
            ...prev,
            sections: prev.sections.map((section, index) => {
                if (index === i) {
                    return {
                        ...section,
                        items: section.items.map((item, jndex) =>{
                            if(jndex === j && tab === 'addOns')  { 
                                return {
                                    ...item,
                                    addOns: item?.addOns?.map((addOn,kndex)=>
                                        (kndex===k) ? {...addOn, [field]: !addOn[field]} : addOn
                                    )
                                }
                             }
                             else if (jndex===j && tab ==='removes'){
                                return {
                                    ...item,
                                    removes: item?.removes?.map((remove,kndex)=>
                                        (kndex===k) ? {[field]: !remove[field]} : remove
                                    )
                                }
                             }
                             return item;
                        })
                    };
                }
                return section;
            })
        }));
        setActiveAddOnRef(null)
        setActiveRemovesRef(null)
        // console.log(editFlags)
        // setActiveAddOnRef(null)
    }
    const handleDeleteTab = (i,j,k,tab)=>{
        console.log(i,j,k,tab)
        setMenu((prev)=>({
            ...prev,
            sections: prev.sections.map((section, index)=>{
                if(index===i){
                    return {
                        ...section,
                        items: section.items.map((item,jndex)=>{
                            if(jndex===j){
                                return {   ...item,
                                    [tab]: item?.[tab]?.filter((val,kndex)=>kndex!==k)
                                }
                            }
                            return item;
                        })
                    }
                }
                return section;
            })
        })) 
    }
    useEffect(() => {
        console.log(menu)
    },[menu])
    // useEffect(() => {
    //     console.log(itemOptionModal)
    // }, [itemOptionModal])
    useEffect(() => {
        if(addNewItemFlag) dispatch(updateMenu(menu));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[addNewItemFlag])
    
    useEffect(() => {
        // console.log('ue', newItemNameInputRef, activeSectionIndex)
        // console.log(activeNewItemRef)
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
        // console.log('ref',itemNameInputRef.current, activeItemIndex)
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
        // populates flags and newItem data etc
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
                items: section.items.map((item) => ({
                    name: false,
                    price: false,
                    description: false,
                    addOns: item.addOns?.map(()=>({
                        price: false,
                        name: false
                    })) || [],
                    removes: item.removes?.map(() => ({
                        name: false
                    })) || [],
                })),
            })
        }
        setNewItem(updatedNewItem)
        setNewItemFlag(updatedNewItemFlags)
        setEditFlags(updatedEditFlags)
        setViewFlags(updatedViewFlags)
        setMenu(findMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, menus.length]);
    // useEffect(() => {
    //     console.log('New Items:', newItem);
    //     console.log('New Item Flags:', newItemFlag);
    //      console.log('new view flags:',viewFlags);
    //     console.log('Edit Flags:', editFlags);
        
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [newItem, newItemFlag, editFlags]);
    useEffect(()=>{
        // console.log('view Flags')
       let input = document.querySelector('input');
       if(input) input.focus();
    },[viewFlags])
    if(error) return <p>Error: {error}</p>

    return (
        <>
          {menu && 
            <div className='display-menu'>
                {/* display menu name and input for menu name edit */}
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
                {/* map through menu.sections to display section content */}
                {menu.sections.map((section,i)=>(
                    <div key={i} className='section-container edit'>
                       <div className='section-name edit'>
                        {/* display section name or input for editing section name */}
                        {!editFlags?.sections[i].name && <span onClick={()=>handleSectionFlag(i, 'name')}>{section.name}</span>}
                        {editFlags?.sections[i].name && 
                            <input type='text'
                                ref={(el)=>sectionNameInputRef.current[i]=el}
                                value={section.name}
                                onChange={(e)=>handleOnChangeSection(e,i, 'name')}
                                onBlur={()=>handleSectionFlag(i, 'name')}
                            />}
                            <div className='new-item'>
                                <label>New Option</label>
                                <button onClick={()=>handleOptionModal(section)}>
                                    <Icon path={mdiPlus} size={0.4}/>
                                </button>

                                <label>New Item</label>
                                <button onClick={()=>handleItemFlag(i,null, 'show', true)}>
                                    <Icon path={mdiPlus} size={0.4}/>
                                </button>
                            </div>
                        </div>
                        {/* display section description or input for editing section description */}
                        <div className="section-description">
                            {!editFlags.sections[i].description && 
                            (section.description.length > 0 ? 
                                <span onClick={()=>handleSectionFlag(i,'description')}>{section.description}</span> :
                                <span onClick={()=>handleSectionFlag(i,'description')}>{'add new description'}</span>
                            )}
                            {editFlags.sections[i].description &&
                                <input type='text'
                                    ref={(el)=>sectionDescriptionInputRef.current[i]=el}
                                    value={section.description}
                                    onChange={(e)=>handleOnChangeSection(e,i,'description')}
                                    onBlur={()=>handleSectionFlag(i,'description')}
                            />}
                        </div>
                       <div className="section-body edit">
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
                                                <input type='text'
                                                    ref={(el)=>newItemNameInputRef.current[i]=el}
                                                    value={newItem[i]?.name}
                                                    onKeyDown={(e)=>handleOnKeyDownItem(e,i,null,'name', true)}
                                                    onChange={(e)=>handleOnChangeItem(e,i,null,'name', true)}
                                                    // onChange={(e)=>e.preventDefault()}
                                                    onBlur={()=>handleItemFlag(i,null,'name',true)}
                                                />}
                                        </span>
                                        {!newItemFlag[i].price && <span onClick={()=>handleItemFlag(i,null,'price', true)}>{formatPrice(newItem[i].price)}</span>}
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
                                    style={{height: (viewFlags[findItemIndex(i,j)]?.['addOns']||viewFlags[findItemIndex(i,j)]?.['removes']) ? '100%' : '8.7rem'}}>
                                    <div className="item-name edit">
                                        <span className='item-button'>
                                            <button onClick={()=>handleDeleteModal(item, section._id)}>
                                                <Icon path={mdiClose} size={0.5}/>
                                            </button>
                                            {!editFlags.sections[i].items[j]?.name && <span onClick={()=>handleItemFlag(i,j,'name', false)}>{item.name}</span>}
                                            {editFlags.sections[i].items[j]?.name && 
                                                <input type='text'
                                                    ref={(el)=>itemNameInputRef.current[findItemIndex(i,j)]=el}
                                                    value={item.name}
                                                    onKeyDown={(e)=>handleOnKeyDownItem(e,i,j,'name', false)}
                                                    onChange={(e)=>handleOnChangeItem(e,i,j,'name', false)}
                                                    onBlur={()=>handleItemFlag(i,j,'name', false)}
                                                />}
                                        </span>
                                        {!editFlags.sections[i].items[j]?.price && <span onClick={()=>handleItemFlag(i,j,'price', false)}>{formatPrice(item.price)}</span>}
                                        {editFlags.sections[i].items[j]?.price && 
                                        <PriceInput
                                            price={item.price} 
                                            setPriceOnChange={(p)=>handleOnChangeItem(p,i,j,'price',false)} 
                                            handleOnBlur={() => handleItemFlag(i,j,'price', false)}
                                            handlePriceTab={()=>handlePriceTab(i,j, false)}
                                        />}
                                            
                                    </div>
                                    <div className="item-description edit">
                                        {!editFlags.sections[i].items[j]?.description ? ( item.description.length ? (<span onClick={()=>handleItemFlag(i,j,'description', false)}>{item.description}</span>):
                                        <span onClick={()=>handleItemFlag(i,j,'description', false)}>{'add item description'}</span>) :
                                        <textarea
                                            ref={(el)=>itemDescriptionInputRef.current[findItemIndex(i,j)]=el}
                                            value={item.description}
                                            onChange={(e)=>handleOnChangeItem(e,i,j,'description',false)}
                                            onBlur={()=>handleItemFlag(i,j,'description',false)}
                                        ></textarea>} 
                                    </div>
                                    <div className="tabs">
                                        <div className="tab-titles">
                                            {/* {viewFlags[findItemIndex(i,j)]} */}
                                            {OAR.map((oar,k)=> (
                                                 
                                                <button key={k}
                                                    style={{borderBottom: viewFlags[findItemIndex(i,j)]?.[oar] ? '0.0625rem solid' : '0.0625rem solid transparent'}}
                                                    onClick={()=>oar!=='options' ? handleViewTabs(oar, findItemIndex(i,j)) : handleViewTabs(oar, i, j)}>{oar}</button>

                                            ))}
                                        </div>
                                        
                                            {viewFlags[findItemIndex(i,j)]?.['addOns'] && 
                                                <div className="tab-content">
                                                    <div className="item-name tab">
                                                        <span className='item-button'>
                                                            <button className='delete-button' onClick={()=>postNewTab(i,j,'addOns')}>
                                                                <Icon path={mdiPlus} size={0.4}/>
                                                            </button>
                                                            <input type='text'
                                                                value={newAddOn.name}
                                                                onChange={(e)=>handleOnChangeTab(e,i,j,null, 'name', 'addOns', true)}
                                                            />
                                                        </span>
                                                        <span className="price">
                                                            {!newPriceFlag ? 
                                                                <span onClick={()=>setNewPriceFlag(!newPriceFlag)}>{formatPrice(newAddOn.price)}</span> :
                                                                <PriceInput
                                                                    price={newAddOn.price}
                                                                    setPriceOnChange={(p)=>handleOnChangeTab(p,i,j,null,'price', 'addOns', true)}
                                                                    handleOnBlur={()=>setNewPriceFlag(false)}
                                                                />
                                                            }
                                                        </span>
                                                    </div>
                                                    {/* display addOns and inputs */}
                                                    {item.addOns.length > 0 && 
                                                        item.addOns.map((addOn, k)=>{
                                                            const refKey = `${i}-${j}-${k}`; //ref keys for addOn and removes inputs
                                                            // console.log(refKey)
                                                            return (
                                                            <div className='item-name tab' key={k}>
                                                                <span className='item-button tab'>
                                                                    <button className='delete-button' onClick={()=>handleDeleteTab(i,j,k,'addOns')}>
                                                                        <Icon path={mdiClose} size={0.4}/>
                                                                    </button>
                                                                    {!editFlags.sections[i].items[j]?.addOns?.[k].name ? 
                                                                    <span onClick={()=>handleTabFlag(i,j,k,'addOns', 'name')}>{addOn.name}</span> : 
                                                                        <input type='text'
                                                                            ref={(el)=>addOnInputRef.current[handleRefKey(refKey,'addOns')]=el}
                                                                            value={addOn.name}
                                                                            onChange={(e)=>handleOnChangeTab(e,i,j,k,'name','addOns',false)}
                                                                            onBlur={()=>handleTabFlag(i,j,k,'addOns', 'name')}
                                                                        />
                                                                    }
                                                                </span>
                                                                <div className='price'>
                                                                    {!editFlags.sections[i].items[j]?.addOns[k].price ?
                                                                        <span  onClick={()=>handleTabFlag(i,j,k,'addOns', 'price')}>{formatPrice(addOn.price)}</span> :
                                                                        <span className='price'>
                                                                            <PriceInput
                                                                                price={addOn.price} 
                                                                                setPriceOnChange={(p)=>handleOnChangeTab(p,i,j,k,'price','addOns',false)} 
                                                                                handleOnBlur={() => handleTabFlag(i,j,k,'addOns','price')}
                                                                                // handlePriceTab={()=>handlePriceTab(i,j, false)}
                                                                            />
                                                                        </span>}
                                                                </div>
                                                            </div>
                                                        )})
                                                    }
                                                </div>
                                            }
                                            {viewFlags[findItemIndex(i,j)]?.['removes'] && 
                                                <div className="tab-content">
                                                    <div className="item-name tab">
                                                        <span className="item-button">
                                                            <button className='delete-button'>
                                                                <Icon path={mdiPlus} size={0.4}/>
                                                            </button>
                                                            <input type='text'
                                                                value={newRemove.name}
                                                                onChange={(e)=>handleOnChangeTab(e,i,j,null, 'name', 'removes', true)}
                                                                onBlur={()=>postNewTab(i,j,'removes')}
                                                            />
                                                        </span>
                                                    </div>
                                                    
                                                    {item.removes.length > 0 && 
                                                        item.removes.map((remove, k)=>{
                                                            const refKey = `${i}-${j}-${k}`;
                                                            // console.log(refKey)
                                                            // setActiveAddOnRef(refKey);
                                                            return (
                                                            <div className='item-name tab' key={k}>
                                                                <span className='item-button tab'>
                                                                    <button className='delete-button' onClick={()=>handleDeleteTab(i,j,k,'removes')}>
                                                                        <Icon path={mdiClose} size={0.4}/>
                                                                    </button>
                                                                    {!editFlags.sections[i].items[j]?.removes?.[k].name ? 
                                                                    <span onClick={()=>handleTabFlag(i,j,k,'removes','name')}>{remove.name}</span> : 
                                                                        <input type='text'
                                                                            ref={(el)=>removesInputRef.current[handleRefKey(refKey,'removes')]=el}
                                                                            value={remove.name}
                                                                            onChange={(e)=>handleOnChangeTab(e,i,j,k,'name', 'removes', false)}
                                                                            onBlur={()=>handleTabFlag(i,j,k,'removes', 'name')}
                                                                        />
                                                                    }
                                                                </span>
                                                            </div>
                                                        )})
                                                    }
                                                </div>
                                            }
                                    </div>
                                </div>
                            ))}
                       </div>
                    </div>
                ))}
            </div>}
            {openDeleteModal && <ModalDeleteItem item={deleteItem} closeCancel={handleDeleteModal} closeDelete={handleDeleteItem} />}
            {optionModal && <ModalOptions item={optionObject} closeCancel={handleOptionModal} closeSubmit={(item)=>handleAddOption(item)} />}
        </>
    )
}
export default EditMenu;