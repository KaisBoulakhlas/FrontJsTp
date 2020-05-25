class ItemAPI extends BaseAPIService{
    constructor() {
        super("items");
    }
    getAllItemsOfList(id){
        return fetchJSON(`${this.url}/${id}`,this.token)
    }

    get(id) {
        return fetchJSON(`http://localhost:3333/item/${id}`,this.token)
    }

    delete(id) {
        this.headers.delete('Content-type');
        return fetch(`http://localhost:3333/item/${id}`, { method: 'DELETE', headers : this.headers })
    }

    insert(item) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch("http://localhost:3333/item", {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }

    update(item) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch("http://localhost:3333/item", {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }
}