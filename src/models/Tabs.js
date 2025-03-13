import { v4 as uuidv4 } from 'uuid';
export class Remove {
    constructor(_id,name=""){
        this._id =_id || uuidv4();
        this.name = name;
    }
}
export class AddOn {
    constructor(_id,name="", price="000.00"){
        this._id =_id || uuidv4();
        this.name = name;
        this.price=price;
    }
}
export class Option {
    constructor(_id,name="",req=false,conent=[]){
        this._id =_id || uuidv4();
        this.name = name;
        this.req = req;
        this.conent = Array.isArray(conent) ? conent : [];
    }
}