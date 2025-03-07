import { v4 as uuidv4 } from 'uuid';
export class Item {
    constructor(_id,name="",description="", price="000.00", addOns=[], removes=[], options=[], position=0){
        this.price = price;
        this._id =_id || uuidv4();
        this.name = name;
        this.description = description;
        this.addOns = Array.isArray(addOns) ? addOns : [];
        this.removes = Array.isArray(removes) ? removes : [];
        this.options = Array.isArray(options) ? options : [];
        this.position=position;
    }
}
export default Item;