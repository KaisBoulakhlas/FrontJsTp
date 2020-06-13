class PartageAPI extends BaseAPIService {
    constructor() {
        super("share");
    };

    getAll() {
        return fetchJSON(this.url, this.token)
    };

    getAllShareOfList(id) {
        return fetchJSON(`http://localhost:3333/shareList/${id}`, this.token)
    };

    getShareById(id) {
        return fetchJSON(`http://localhost:3333/partage/${id}`, this.token)
    };

    insert(share) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(share)
        });
    };

    update(share) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(share)
        });
    };
}