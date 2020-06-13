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
                                <td><a title="Partages" class="waves-effect waves-light btn"  onclick="indexController.displaySharesOfList(${list.id})" style="margin-bottom: 10px;"><i class="material-icons">info_outline</i></a></td>
                                <td><a title="Archiver" class="waves-effect waves-light btn"  onclick="indexController.changeArchived(${list.id})" style="margin-bottom: 10px;"><i class="material-icons">archive</i></a></td>
                                <td>${list.shop}</td>
                                <td>${date}</td>
                                <td><a title="Visualiser" class="waves-effect waves-light btn"  onclick="indexController.displayItemsOfList(${list.id});" style="margin-bottom: 10px;"><i class="material-icons">visibility</i></a></td>
                                <td><a title="Modifier" class="waves-effect waves-light btn"  onclick="indexController.editList(${list.id})" style="margin-bottom: 10px;"><i class="material-icons">edit</i></a></td>
                                <td><a title="Partager" class="btn waves-effect waves-light"  onclick="indexController.addShareModal(${list.id})" style="margin-bottom: 10px;"><i class="material-icons">share</i></a></td>
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

    async addShareModal(id){
        this.selected_user = null;
        this.list_id = id;
        const users = await this.model.getAllUsers();
        const shared_users = await this.model.getAllShareOfList(id);

        const msg = $('#addShareUserSelect');
        const input = $('#addPartage-autocomplete-input');
        const options = {};
        let result;

        //Reset les données à l'ouvertur de la modal
        msg.innerHTML = 'Vous n avez sélectionner personne';
        input.value = null;
        $('#radioReadShare').checked = true;

        for(let i = 0; i < users.length; i++){ //Parcours sur TOUS les users
            shared_users.map( x => { //Parcours sur les users qui ont déjà cette liste en partage
                if(users[i].id === x.user_id) users.splice(i, 1); //Si l'user est dféjà partager on le vire du tableau
            });
            if(!!users[i]) {
                options[users[i].login] = null;
            } //Si l'user est toujours dans le tableau on le push dans les options
        }

        var elem = $('#addPartage-autocomplete-input');
        M.Autocomplete.init(elem, {data:options, minLength: 3, onAutocomplete: e =>{
                result = users.filter(x => x.login === e);
                this.selected_user = result[0];
                msg.innerHTML = (`Vous avez sélectionné <label class='important-stuff'>${result[0].name}</label>.`);
            }});
        this.getModal('#modal-addPartage').open();
    }

    async addShare(){
        try{
            const radio = $('#addPartage-radio');
            const radio_value = radio.elements["rights"].value;

            if(this.selected_user === undefined || this.selected_user === null) {
                return this.toast('Veuillez entrer un utilisateur','red darken-1');
            }
            this.toast(`Le partage de ${this.selected_user.name} a été effectué`,'green darken-1 rounded');
            this.model.insertShare(new Partage(null, this.selected_user.id, this.list_id, radio_value))
                .then(this.getModal('#modal-addPartage').close())
                .catch( e=> console.log(e))
        }catch (e) {
            console.log(e)
        }

    }

    async displaySharesOfList(id){
        let content = "";
        const list = await this.model.getList(id);
        const table = $("#tableAllSharesOfList");
        console.log(list.id);
        const title = $('#title');
        title.innerHTML = `<h4>Partages de la liste ${list.shop}</h4>`;
        const sharesOfList = await this.model.getAllShareOfList(id);
        const body = $('#tableBodyAllSharesOfList');
        console.log(sharesOfList);
        for(let share of sharesOfList){
            const droit = share.droit ? "Lecture/écriture" : "Lecture";
            const date = share.date.toLocaleDateString();
            content += `<tr id="share-${share.id}">
                            <td>${share.shop}</td>
                            <td>${date}</td>
                            <td>${share.login}</td>
                            <td>${droit}</td>
                        </tr>`
        }

        body.innerHTML = content;

        if(this.getCountRow('#tableBodyAllSharesOfList') > 0){
            table.style.visibility = "visible";
            $('#header-share').style.visibility = "visible";
            $('#footer-share').style.display = "none";
        } else{
            $('#header-share').style.visibility = "hidden";
            table.style.visibility = "hidden";
            $('#footer-share').style.display = "block";
            $('#footer-share').innerHTML = `<h5 class="container collapsible" id="nothing">Aucuns partages de la liste ${list.shop}.</h5>`;
        }
        this.getModal('#modalSharesOfList').open();
    }
}

window.indexController = new IndexController();
