class NewItemController extends BaseController {
    constructor() {
        super();
        this.InputQuantite = $("#quantite");
        this.InputLabel = $("#label");
        this.list = self.list;
        if(indexController.selectedItem){
            self.item = indexController.selectedItem;
            indexController.selectedItem = null;
            $("#title").innerHTML = `Modifier la course ${self.item.label}<a title="back" class="waves-effect waves-light btn"  onclick="navigate('new_item');indexController.displayItemsOfList(self.item.listid)" style="margin-left: 10px;"><i class="material-icons">backspace</i></a>`;
            $("#quantite").value = self.item.quantite;
            $("#label").value = self.item.label;
            $("#hidden").innerText = "";
            $("#hidden2").innerText = "";
            $("#table").style.display = "none";
            $("#edit").style.width = "50%";
        }
    }


    async updateItemChecked(itemId){
        const item = await this.model.getItem(itemId);
        try{
            if(document.querySelector(`#check-${item.id}`).checked){
                item.checked = true;
            } else{
                item.checked = false;
            }
            if(await this.model.updateItem(item) === 200){
                if(item.checked){
                    this.toast(`Course ${item.label} achetée`,'green darken-1 rounded');
                } else{
                    this.toast(`Course ${item.label} à acheter.`,'red darken-4');
                }
            } else{
                this.displayServiceError();
            }
        } catch(err){
            console.log(err);
            this.displayServiceError();
        }
    }


    async saveItem(){
        const quantite = this.InputQuantite.value;
        const label = this.InputLabel.value;


        if(quantite === "" && label === ""){
            this.toast("Les deux champs sont vides.",'red darken-4');
            return
        }
        if(label === ""){
            this.toast("Le champ label est vide.",'red darken-4');
            return
        }
        if(quantite < 0){
            this.toast("Le champ quantité est négatif.",'red darken-4');
            return
        }
        if(Number(quantite) === 0 || quantite === ""){
            this.toast("Le champ quantité est vide/nul.",'red darken-4');
            return
        }

        if ((quantite !== "") && (label !== "")) {
            try{
                if (self.item) {
                    if(self.item.quantite === quantite && self.item.label === label){
                        this.toast("Veuillez modifier les valeurs",'red darken-4')
                    } else{
                        self.item.quantite = quantite;
                        self.item.label = label;
                        if (await this.model.updateItem(self.item) === 200) {
                            this.toast("La course a bien été modifée",'green darken-1 rounded');
                            await indexController.displayItemsOfList(self.item.listid);
                            self.item = null;
                        } else {
                            this.displayServiceError()
                        }
                    }
                } else{
                    if(await this.model.insertItem(new Item(label,quantite,this.list.id)) === 200){
                        this.toast("La course a bien été insérée",'green darken-1 rounded');
                        await indexController.displayItemsOfList(this.list.id);
                    } else{
                        this.displayServiceError();
                    }
                }
            } catch(err){
                console.log(err);
                this.displayServiceError();
            }


        }

    }




}

window.newItemController = new NewItemController();