class NewListController extends BaseController {
    constructor() {
        super();
        super.datePicker();
        if(indexController.selectedList){
            self.list = indexController.selectedList;
            indexController.selectedList = null;
            $("#title").innerHTML = `Modifier la liste ${self.list.shop}<a title="back" class="waves-effect waves-light btn"  onclick="navigate('index')" style="margin-left: 10px;"><i class="material-icons">backspace</i></a>`;
            $("#shop").value = self.list.shop;
            $("#label").innerText = "";
            $("#date").value = self.list.date.toLocaleDateString()
        }
    }

     async saveList() {
         const shop = $("#shop").value;
         const date = $('#date').value;

         if(shop === "" && date === ""){
             this.toast("Les deux champs sont vides.",'red darken-4');
             return
         }
         if(shop === ""){
             this.toast("Le champ magasin est vide.",'red darken-4');
             return
         }
         if(date === ""){
             this.toast("Le champ date est vide.",'red darken-4');
             return
         }

         if ((shop !== "") && (date !== "")) {
             try {
                 if (self.list) {
                     if(self.list.shop === shop || self.list.date === date){
                         this.toast("Veuillez modifier les valeurs",'red darken-4')
                     } else{
                         self.list.shop = shop;
                         self.list.date = date;
                         self.list.archived = false;
                         if (await this.model.update(self.list) === 200) {
                             this.toast("La liste a bien été modifée",'green darken-1 rounded');
                             self.list = null;
                             navigate('index')
                         } else if(await this.model.update(self.list) === 403) {
                             this.toast("Accès interdit",'red darken-1')
                         }else{
                             this.displayServiceError()
                         }
                     }
                 } else {
                     if (await this.model.insertList(new List(shop, date)) === 200) {
                         this.toast("La liste a bien été insérée",'green darken-1 rounded');
                         navigate('index');
                     } else {
                         this.displayServiceError();
                     }
                 }
             } catch (err) {
                 console.log(err);
                 this.displayServiceError();
             }

         }
     }
}

window.newListController = new NewListController();

