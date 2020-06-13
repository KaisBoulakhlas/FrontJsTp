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

class User {
    constructor(id, name, login) {
        this.id = id;
        this.name = name;
        this.login = login;
    };
}


class Partage {
    constructor(id, user_id, list_id, droit) {
        this.id = id;
        this.user_id = user_id;
        this.list_id = list_id;
        this.droit = droit;
    };
}