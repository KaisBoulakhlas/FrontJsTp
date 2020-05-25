class Model {
    constructor() {
        this.api = new ListAPI();
        this.apiItem = new ItemAPI()
    }

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

    update(list){
        return this.api.update(list).then(res => res.status)
    }

    updateItem(item){
        return this.apiItem.update(item).then(res => res.status)
    }

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