import { v4 as uuidv4 } from 'uuid';
export class AddOn {
    constructor(_id,name="", price="000.00"){
        this._id =_id || uuidv4();
        this.name = name;
        this.price=price;
    }
}
export default AddOn;