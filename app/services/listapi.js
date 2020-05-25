class ListAPI extends BaseAPIService {
    constructor() {
        super("list")
    }
    getAll(){
        return fetchJSON(this.url,this.token)
    }
    insert(list) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }
    get(id) {
        return fetchJSON(`${this.url}/${id}`, this.token)
    }

    getListsArchived(){
        return fetchJSON("http://localhost:3333/listArchived",this.token)
    }

    delete(id) {
        this.headers.delete('Content-Type');
        return fetch(`${this.url}/${id}`, { method: 'DELETE', headers: this.headers })
    }

    update(list) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }
}



