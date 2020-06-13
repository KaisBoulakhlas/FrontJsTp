class Model {
    constructor() {
        this.api = new ListAPI();
        this.apiItem = new ItemAPI();
        this.apiUser = new UserAccountAPI();
        this.apiPartage = new PartageAPI();
    }

    async getAllUsers(){
        let users = [];
        for (let user of await this.apiUser.getAll()) {
            users.push(Object.assign(new User(), user));
        }
        return users;
    };

    async getAllShare(){
        let shares = [];
        for(let share of await this.apiPartage.getAll()){
            share.date = new Date(share.date);
            shares.push(Object.assign(new Partage(), share));
        }
        return shares;
    };

    async getShare(id){
        try{
            const share = Object.assign(new Partage(), await this.apiPartage.getShareById(id));
            return share;
        }
        catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };

    async getListShare(id){
        try {
            const list = Object.assign(new List(), await this.api.getListShare(id));
            list.date = new Date(list.date);
            return list;
        }catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };

    async getAllShareOfList(id){
        let shares = [];
        for(let share of await this.apiPartage.getAllShareOfList(id)){
            share.date = new Date(share.date);
            shares.push(Object.assign(new Partage(), share));
        }
        return shares;
    };


    async getAllItemsOfList(listId){
        let items = [];
        const list = await this.api.get(listId);
        console.log(list);
        for(let item of await this.apiItem.getAllItemsOfList(list.id)){
            items.push(Object.assign(new Item(),item))
        }
        return items;
    }

    async getAllLists() {
        let lists = [];
        for (let list of await this.api.getAll()) {
            list.date = new Date(list.date);
            lists.push(Object.assign(new List(),list))
        }
        return lists
    }

     insertList(list){
        return this.api.insert(list).then(res => res.status)
    }

    insertItem(item){
        return this.apiItem.insert(item).then(res => res.status)
    }

    insertShare(share){
        try{
            return this.apiPartage.insert(share);
        } catch (e) {
            if (e === 404){
                return null;
            }
            if (e === 403) {
                return 403;
            }
            return undefined;
        }
    };

    update(list){
        return this.api.update(list).then(res => res.status)
    }

    updateItem(item){
        return this.apiItem.update(item).then(res => res.status)
    }

    updateShare(share){
        try {
            return this.apiPartage.update(share);
        } catch (e) {
            if (e === 404) {
                return null;
            }
            if (e === 403) {
                return 403;
            }
            return undefined;
        }
    };

    delete(id) {
        return this.api.delete(id).then(res => res.status)
    }

    deleteItem(id) {
        return this.apiItem.delete(id).then(res => res.status)
    }

    async getList(id) {
        try {
            const list = Object.assign(new List(), await this.api.get(id));
            list.date = new Date(list.date);
            return list
        } catch (e) {
            if (e === 404) return null;
            return undefined
        }
    }

    async getItem(id) {
        try {
            const item = Object.assign(new Item(), await this.apiItem.get(id));
            return item
        } catch (e) {
            if (e === 404) return null;
            return undefined
        }
    }

    async getAllListsArchived(){
        let listsArchived = [];
        for (let listArchived of await this.api.getListsArchived()){
            listsArchived.push(Object.assign(new List(), listArchived))
        }
        return listsArchived;
    }




}