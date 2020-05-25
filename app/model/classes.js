class List {
    constructor(shop, date){
        this.shop = shop;
        this.date = date;
        this.archived = false;
    }
    toString(){
        return `${this.shop}`
    }

}

class Item {
    constructor(label, quantite, listid){
        this.label = label;
        this.quantite = quantite;
        this.checked = false;
        this.listid = listid;
    }
}