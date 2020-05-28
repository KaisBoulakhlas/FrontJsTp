class IndexController extends BaseController {
    constructor() {
        super();
        $('#headerLogo').innerHTML = `<i class='material-icons' style='padding-top:1%;'>add_shopping_cart</i>Listes de courses`;
        this.displayAllLists();
    }

    async changeArchived(listId){
        const list = await this.model.getList(listId);
        console.log(list.id);
        list.archived = true;
        try{
            if(await this.model.update(list) === 200){
                this.toast(`Liste ${list.shop} archivée`,'green darken-1 rounded')
                this.displayAllLists();
            } else{
                this.displayServiceError();
            }
        } catch(err){
            console.log(err);
            this.displayServiceError();
        }
    }

    async displayAllLists(){
        let content = "";
        const body =  $("#tableBodyAllLists");
        const table = $("#tableAllLists");
        try {
            for (const list of await this.model.getAllLists()) {
                const date = list.date.toLocaleDateString();
                content += `<tr id="list-${list.id}">
                                <td><a title="Archiver" class="waves-effect waves-light btn"  onclick="indexController.changeArchived(${list.id})" style="margin-bottom: 10px;"><i class="material-icons">archive</i></a></td>
                                <td>${list.shop}</td>
                                <td>${date}</td>
                                <td><a title="Visualiser" class="waves-effect waves-light btn"  onclick="indexController.displayItemsOfList(${list.id});" style="margin-bottom: 10px;"><i class="material-icons">visibility</i></a></td>
                                <td><a title="Modifier" class="waves-effect waves-light btn"  onclick="indexController.editList(${list.id})" style="margin-bottom: 10px;"><i class="material-icons">edit</i></a></td>
                                <td><a title="Supprimer" class="waves-effect waves-light btn"  onclick="indexController.deleteList(${list.id})" style="margin-bottom: 10px;"><i class="material-icons">delete</i></a></td>
                            </tr>`
            }
            body.innerHTML = content;
            if(this.getCountRow('#tableBodyAllLists') > 0){
                table.style.visibility = "visible";
                $('#header').style.visibility = "visible";
                $('#footer').style.display = "none";
            } else{
                $('#header').style.visibility = "hidden";
                table.style.visibility = "hidden";
                $('#footer').style.display = "block";
                $('#footer').innerHTML = `<h4 class="container collapsible" id="nothing">Aucunes listes de courses.</h4>`;
            }

        } catch(err) {
            console.log(err);
            this.displayServiceError();
        }
    }

    async editList(id) {
        try {
            const list = await this.model.getList(id)
            if (list === undefined) {
                this.displayServiceError()
                return
            }
            if (list === null) {
                this.displayNotFoundError()
                return
            }
            this.selectedList = list;
            navigate("new_list")
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }


    async editItem(id) {
        try {
            const item = await this.model.getItem(id)
            if (item === undefined) {
                this.displayServiceError()
                return
            }
            if (item === null) {
                this.displayNotFoundError()
                return
            }
            this.selectedItem = item;
            navigate("new_item");
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    undoDeleteList(){
        if(this.deletedList){
            this.model.insertList(this.deletedList).then(status => {
                    if(status === 200){
                        console.log("yes")
                        this.deletedList = null;
                        this.toast("Opération annulée.",'green darken-1 rounded');
                        this.displayAllLists();
                    }
            }).catch(_=> this.displayServiceError())
        }
    }

    undoDeleteItem(listId){
        console.log(this.deletedItem);
        try{
            if(this.deletedItem){
                console.log("oui");
                this.model.insertItem(this.deletedItem).then(status => {
                    if(status === 200){
                        console.log("yes");
                        this.deletedItem = null;
                        this.toast("Opération annulée.",'green darken-1 rounded');
                        this.displayItemsOfList(listId);
                    }
                }).catch(_=> this.displayServiceError())
            }
        } catch(err){
            console.log(err);
            this.displayServiceError();
        }
    }

    async deleteItem(itemId){
        try {
            const item = await this.model.getItem(itemId);
            if (item === undefined) {
                this.displayServiceError();
                return
            }
            if (item === null) {
                this.displayNotFoundError();
                return
            }

            $('#spanDeleteList').innerText = `la course ${item.label}`;
            $('#btnDelete').onclick = async () => {
                if(await this.model.deleteItem(itemId) === 200){
                    this.deletedItem = item;
                    console.log(this.deletedItem);
                    this.toast(`<span>Supression effectuée</span><button class="btn-flat toast-action-black" onclick="indexController.undoDeleteItem(${item.listid})">Annuler</button>`,'green darken-1 rounded')
                    this.displayItemsOfList(item.listid);
                } else if(await this.model.deleteItem(itemId) === 404){
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

    async deleteList(id){
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
                    this.deletedList = list;
                    this.toast(`<span>Supression effectuée</span><button class="btn-flat toast-action-black" onclick="indexController.undoDeleteList();">Annuler</button>`,'green darken-1 rounded')
                    this.displayAllLists();
                } else if(await this.model.delete(id) === 404){
                    this.displayNotFoundError();
                } else if (await this.model.delete(id) === 403){
                    this.toast("Accès interdit",'red darken-1')
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

    async displayItemsOfList(listId){
        navigate('new_item');
        const list = await this.model.getList(listId);
        self.list = list;
        const items = await this.model.getAllItemsOfList(listId);
        const table = $("#tableAllItems");
        const div = $("#table");
        let content = "";
        try{
            for(let item of items){
                content += `<tr id="item-${item.id}">
                            <td><p>
                                   <label>
                                          ${item.checked === true ?
                                            `<input type="checkbox" id="check-${item.id}" checked name="name[]"  onclick="newItemController.updateItemChecked(${item.id})"/>`
                                            : `<input type="checkbox" id="check-${item.id}"  name="name[]"  onclick="newItemController.updateItemChecked(${item.id})"/>`
                                          }
                                   <span></span>
                                   </label>
                                </p>
                            </td>
                            <td>${item.quantite}</td>
                            <td>${item.label}</td>
                            <td><a title="Modifier" class="waves-effect waves-light btn"  onclick="indexController.editItem(${item.id})" style="margin-bottom: 10px;"><i class="material-icons">edit</i></a></td>
                            <td><a title="Supprimer" class="waves-effect waves-light btn"  onclick="indexController.deleteItem(${item.id})" style="margin-bottom: 10px;"><i class="material-icons">delete</i></a></td>
                       </tr>
`;
                console.log(`${item.quantite}-${item.label}-${item.checked}-${list.id}`)
            }
            $("#tableBodyAllItems").innerHTML = content;
            if(this.getCountRow('#tableBodyAllItems') > 0){
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

window.indexController = new IndexController();
