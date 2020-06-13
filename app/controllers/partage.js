class PartageController extends BaseController {
    constructor() {
        super();
        $('#headerLogo').innerHTML = `<i class='material-icons' style='padding-top:1%;'>share</i>Partages`;
        this.displayShare();
        this.datePicker();
    }

    async displayShare(){
        let content = "";
        const body =  $("#tableBodyAllListsShare");
        const table = $("#tableAllListsShare");

        console.log(await this.model.getAllShare())
        try {

            for (const shareList of await this.model.getAllShare()) {

                const droit = shareList.droit ? `<a title="Modifier" class="waves-effect waves-light btn"  onclick="partageController.openModalOfSharedList(${shareList.list_id});"><i class="material-icons">edit</i></a>` : 'Modification interdite'
                const date = shareList.date.toLocaleDateString();
                content += `<tr id="list-${shareList.id}">
                                <td>${shareList.shop}</td>
                                <td>${date}</td>
                                <td>${shareList.name}</td>
                                <td>${droit}</td>
                            </tr>`
            }

            body.innerHTML = content;

            if(this.getCountRow('#tableBodyAllListsShare') > 0){
                table.style.visibility = "visible";
                $('#header').style.visibility = "visible";
                $('#footer').style.display = "none";
            } else{
                $('#header').style.visibility = "hidden";
                table.style.visibility = "hidden";
                $('#footer').style.display = "block";
                $('#footer').innerHTML = `<h4 class="container collapsible" id="nothing">Aucunes listes de courses partagées.</h4>`;
            }

        }  catch(err) {
            console.log(err);
            this.displayServiceError();
        }
    }

    async openModalOfSharedList(id){
            const list = await this.model.getListShare(id)
                if(list === null) {
                    return this.displayNotFoundError();
                }
                if(list === undefined) {
                    return this.displayServiceError();
                }
                if(list === 403) {
                    return this.displayUnauthorizedError();
                }

                this.currentListUpdated = list;
                const date = list.date.toLocaleDateString();
                $('#shop').value = list.shop;
                $('#date').value = date;
                this.getModal("#modalUpdateSharedList").open();

    }
    async updateSharedList(){
        try {
            let shop = $("#shop").value;
            let date = $("#date").value;
            this.currentListUpdated.shop = shop;
            this.currentListUpdated.date = date;
            if(shop.value === null || date.value === null) {
                return this.toast('Veuillez entrer des valeurs','red darken-1');
            }
            console.log(this.currentListUpdated)
            if (shop != null && date != null) {
                await this.model.updateShare(this.currentListUpdated);
                this.toast(`La liste a bien été modifiée`,'green darken-1 rounded');
                this.getModal("#modalUpdateSharedList").close();
                this.displayShare();
            }
        } catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }
}

window.partageController = new PartageController();
