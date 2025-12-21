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
    constructor(_id= uuidv4(), name="", req=false, content=[]){
        this._id =_id;
        this.name = name;
        this.req = req;
        this.content = Array.isArray(content) ? content : [];
    }
}
export class OptionValue {
    constructor(name='', price='000.00'){
        this.name=name;
        this.price=price;
    }
}