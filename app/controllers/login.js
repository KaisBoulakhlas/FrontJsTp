class LoginController extends BaseController {
    constructor() {
        super(false);
        this.svc = new UserAccountAPI()
    }

    logout(){
        sessionStorage.removeItem("token");
        if(sessionStorage.getItem("token")){
            navigate("index");
        } else{
            $("#nav-mobile").style.display = "none";
            navigate("login");
        }
        navigate('login');
    }

    async authenticate() {
        let login = $('#fieldLogin').value;
        let password = $('#fieldPassword').value;
        console.log(login);
        console.log(password);
        if(login === "" && password === ""){
            this.toast("Les deux champs sont vides.",'red darken-4');
            return
        }
        if(login === ""){
            this.toast("Veuillez entrer un login",'red darken-4');
            return
        }
        if(password === ""){
            this.toast("Veuillez entrer un mot de passe",'red darken-4');
            return
        }

            if ((login != null) && (password != null)) {
                this.svc.authenticate(login, password)
                    .then(res => {
                        sessionStorage.setItem("token", res.token);
                        window.location.replace("index.html")
                    })
                    .catch(err => {
                        console.log(err);
                        if (err === 401) {
                            this.toast("Adresse e-mail ou mot de passe incorrect",'red darken-4')
                        } else {
                            this.displayServiceError()
                        }
                    })
            }
    }
}

window.loginController = new LoginController();
