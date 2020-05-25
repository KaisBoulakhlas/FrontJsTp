class HistoriqueController extends BaseController{
    constructor(){
        super();
        this.displayListsArchived();
    }

    async deleteListArchived(id){
        try {
            const list = await this.model.getList(id);
            if (list === undefined) {
                this.displayServiceError();
                return
            }
            if (list === null) {
                this.displayNotFoundError();
                return
            }

            $('#spanDeleteList').innerText = `la liste ${list.shop}`;
            $('#btnDelete').onclick = async () => {
                if(await this.model.delete(id) === 200){
                    this.toast(`Suppression de la liste ${list.shop} réussie`,'green darken-1 rounded')
                    this.displayListsArchived();
                } else if(await this.model.delete(id) === 404){
                    this.displayNotFoundError();
                } else{
                    this.displayServiceError()
                }
            };
            this.getModal('#modalConfirmDelete').open();

        } catch (err) {
            console.log(err);
            this.displayServiceError()
        }
    }

    async displayListsArchived(){
        let content = "";
        const tbody = $("#tableBodyAllListsArchived");
        const table = $("#tableAllListsArchived");
        const div = $("#container3");

        try{
            for(let listArchived of await this.model.getAllListsArchived()){
                const date = new Date(listArchived.date).toLocaleDateString();
                content += `<tr id="listArchived-${listArchived.id}">
                                <td>${listArchived.shop}</td>
                                <td>${date}</td>
                                <td><a title="Visualiser" class="waves-effect waves-light btn"  onclick="historiqueController.displayItemsOfListArchived(${listArchived.id});" style="margin-bottom: 10px;"><i class="material-icons">visibility</i></a></td>
                                <td><a title="Supprimer" class="waves-effect waves-light btn"  onclick="historiqueController.deleteListArchived(${listArchived.id})" style="margin-bottom: 10px;"><i class="material-icons">delete</i></a></td>
                            </tr>`;
            }
            tbody.innerHTML = content;
            if(this.getCountRow('#tableBodyAllListsArchived') > 0){
                table.style.visibility = "visible";
            } else{
                table.style.visibility = "hidden";
                div.innerHTML = `<h4 class="container collapsible" id="nothing">Aucunes listes de courses archivées.</h4>`;
            }
        } catch(err){
            console.log(err);
            this.displayServiceError();
        }
    }

    async displayItemsOfListArchived(listId){
        navigate('archived_items');
        const list = await this.model.getList(listId);
        const items = await this.model.getAllItemsOfList(list.id);
        const body = $('#tableBodyAllItemsArchived');
        const table = $('#tableAllItemsArchived');
        const div = $('#containerItemsArchived');
        let content = "";
        try{
            for(let item of items){
                content += `<tr id="item-${item.id}">
                                <td><p>
                                       <label>
                                              ${item.checked === true ?
                    `<input type="checkbox" id="check-${item.id}" checked name="name[]" disabled onclick="newItemController.updateItemChecked(${item.id})"/>`
                    : `<input type="checkbox" id="check-${item.id}"  name="name[]" disabled onclick="newItemController.updateItemChecked(${item.id})"/>`
                }
                                       <span></span>
                                       </label>
                                    </p>
                                </td>
                                <td>${item.quantite}</td>
                                <td>${item.label}</td>
                           </tr>`
            }
            body.innerHTML = content;

            if(this.getCountRow('#tableBodyAllItemsArchived') > 0){
                table.style.visibility = "visible";
            } else{
                table.style.visibility = "hidden";
                div.innerHTML = `<h4 class="container collapsible" id="nothing">Aucunes courses.</h4>`;
            }

        } catch(err){
            console.log(err);
            this.displayServiceError();
        }

    }
}

window.historiqueController = new HistoriqueController();