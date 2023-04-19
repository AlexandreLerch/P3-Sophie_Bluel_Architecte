//////CODE CORRESPONDANT AU PREMIER AFFICHAGE DE LA PAGE
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();


function genererProjets(projets){
    projets.forEach(function(projet) {
     
        // Récupération de l'élément du DOM qui accueillera les fiches
        const divGallery = document.querySelector(".gallery")

        // Création d’une balise dédiée au projet
        const figure = document.createElement("figure");
        figure.id="figure" +projet.id
        figure.classList.add("figure")
                
        // Création des balises 
        const image = document.createElement("img");
        image.src = projet.imageUrl;
        figure.appendChild(image)

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = projet.title;

        figure.appendChild(figcaption);

        divGallery.appendChild(figure);
    });
}

// premier affichage de la page
genererProjets(projets);

//////FIN DU CODE CORRESPONDANT AU PREMIER AFFICHAGE DE LA PAGE


//////CODE CORRESPONDANT AUX FILTRES DES CATEGORIES

const categories = await fetch("http://localhost:5678/api/categories");
const cat = await categories.json();

const boutonTous = document.createElement("button");
boutonTous.innerText = "Tous";
document.querySelector(".filtres").appendChild(boutonTous);
boutonTous.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    genererProjets(projets)
});

cat.forEach(function(categorie, index) {
    const bouton = document.createElement("button");
    bouton.innerText = categorie.name;
    bouton.addEventListener("click", function() {
        const filtre = projets.filter(function(projet) {
            return projet.categoryId == index + 1;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjets(filtre);
    });
    document.querySelector(".filtres").appendChild(bouton);
})
//////FIN DU CODE CORRESPONDANT AUX FILTRES DES CATEGORIES


////////EFFACEMENT DES FILTRES SI CONNECTRION OK/////////////
if(sessionStorage.getItem('adminToken')) {
    const boxFiltres= document.querySelector(".filtres")
       boxFiltres.style = "display:none"
   
       const affichage = document.querySelectorAll(".iflogged")
       affichage.forEach(a => {a.setAttribute("style", null)})
   } else {console.log("false")}
////////FIN DE EFFACEMENT DES FILTRES SI CONNECTRION OK/////////////



//////////OUVERTURE DE LA MODALE1 AU CLICK DU BOUTON MODIFIER
let modal = null

/////////////OUVERTURE DE LA MODALE AU CLICK DU BOUTON MODIFIER
const openModal = async function(e) {
    e.preventDefault()
    let reponseModal = await fetch("http://localhost:5678/api/works")
    let projetsModal = await reponseModal.json();
    genererProjetsModal(projetsModal)
    
    const target = document.querySelector('#modal1')
    target.style.display = null
    target.setAttribute('aria-hidden', false)
    target.setAttribute('aria-modal', true)  
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

///////////////////FERMETURE DE LA MODALE AU CLICK SUR LA CROIX
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
e.stopPropagation()
}

////////////////ALIMENTATION DE LA MODALE LORS DE SON OUVERTURE APRES REFRESH

async function genererProjetsModal() {
    //REMISE A ZERO DE LA GALERIE
    document.querySelector(".gallery_modal").innerHTML=""
    //RECUPERATION DES WORKS EN FORMAT JSON
    let reponseModal = await fetch("http://localhost:5678/api/works")
    let projetsModal = await reponseModal.json();
    console.log(projetsModal)


    //RECUPERATION DE L'ELEMENT DU DOM QUI ACCUEILLERA LES FIGURES
const galleryModal = document.querySelector(".gallery_modal");
galleryModal.innerHTML = ""

//CREATION DE CHACUNE DES FIGURES DE LA GALERIE MODALLE
projetsModal.forEach(function(projetModal, i) {
  // Création d’une figure dédiée au projet dans la modale
  const figureModal = document.createElement("figure");
  figureModal.id = "figureModal" + projetModal.id;
  //console.log(figureModal.id)
  figureModal.className = "figureModal";
  galleryModal.appendChild(figureModal);

  // Création de l'image dans la figure de la modale 
  const imageModal = document.createElement("img");
  imageModal.src = projetModal.imageUrl;
  figureModal.appendChild(imageModal);

  // Création de la légende dans la figure de la modale 
  const figModalcaption = document.createElement("figcaption");
  figModalcaption.innerText = "editer";
  figureModal.appendChild(figModalcaption);

  // Création du bouton déplacmeent dans la figure de la modale  
  const boutonDeplacement = document.createElement("button");
  boutonDeplacement.className = "boutonDeplacement";
  boutonDeplacement.id = i + 1;
  figureModal.appendChild(boutonDeplacement);
  const iconDeplacement = document.createElement("i");
  iconDeplacement.className = "fa-solid fa-arrows-up-down-left-right";
  boutonDeplacement.appendChild(iconDeplacement);

  // Création du bouton suppression dans la figure de la modale  
  const suppression = document.createElement("button");
  suppression.className = "boutonSuppression";
  //suppression.id = projet.id
  suppression.type = "submit";
  figureModal.appendChild(suppression);
  const iconSuppression = document.createElement("i");
  iconSuppression.className = "fa-solid fa-trash-can";
  //iconSuppression.src = "assets/icons/trash-can-solid.svg"
  suppression.appendChild(iconSuppression);

  ////AJOUT DE LA FONCTION QUI PERMET DE SUPPRIMER LES PROJETS/////////////////////
  suppression.addEventListener('click', async function() {
    document.querySelector(".gallery_modal").removeChild(document.querySelector("#figureModal" + projetModal.id));
    document.querySelector(".gallery").removeChild(document.querySelector("#figure" + projetModal.id));

    //const ids = projetsModal.map(projetsModal => projetsModal.id);
    //console.log(ids); // Affiche [1, 2, 3]
    console.log(projetModal.id);
    const id = projetModal.id;
    await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.adminToken}`,
        }
      })
      .catch(err => console.log(err))
  })
});

} 

////////////////PREMIER AFFICHAGE DE LA MODALE/////////////////
document.querySelector(".js-modal").addEventListener('click', openModal)


//OUVERTURE DE LA GALERIE DE LA MODALE
const modal1 = document.querySelector("#modal1")
const modal2 = document.querySelector("#modal2")
const ajout = document.querySelector(".ajout")
ajout.addEventListener("click", function(){
    modal2.style = "display:flex"
})

/////////AFFICHAGE IMG SELECTIONNEE (VIGNETTE)
const formulaireAjout = document.querySelector("#formulaire_ajout_figure")
let inputFileModal = document.querySelector("#ajout_image")
const box = document.querySelector(".boite_grise")
const vignette = document.createElement("img")
inputFileModal.addEventListener("change", function(){
    const file = inputFileModal.files[0]
    vignette.src=  URL.createObjectURL(file)
    vignette.id="vignette"
    box.appendChild(vignette)
})

////////DEFINITION DES ACTIONS POUR RETURN & CLOSE
document.querySelector(".js-modal-return").addEventListener("click", function () {
    modal1.style="display:flex"
    modal2.style = "display:none"
})
document.querySelector(".js-modal-close2").addEventListener("click", function () {
    modal2.style="display:none"
})

////////RECUPERATION DES CATEGORIES & DU TOKEN VIA LE LOCALHOST
const adminToken = sessionStorage.getItem('adminToken')

cat.forEach(element => {    
    const option = document.createElement("option");
    option.value = element.id
    option.innerText = element.name
    document.querySelector("#category").appendChild(option)
})
  
////////CREATION DE LA FONCTION POUR AJOUTER LES FIGURES///////////
//récupération de l'image à insérer dans la figure à créer
let inputFile = document.querySelector("#ajout_image")
inputFile.classList.add("fileInput");
inputFile.setAttribute("accept",".png, .jpg, .jpeg");
inputFile.type= "file"

async function ajoutFigure () {
    // RECUPERATION DES DONNEES DE L'IMAGE    
    // récupération du title et de la catégorie depuis le formulaire "formulaireAjout"
    const titleValue = document.querySelector("#title").value
    let categoryValue = document.querySelector("#category").value;
    //récupération de l'url de l'image depuis le formulaire "formulaireAjout"
    const file = inputFile.files[0]
    //Alerte et blocage si le formulaire est incomplet
    if (titleValue && file) {
        } else {alert("Formulaire incomplet")
        return
    }

    //transformation de la valeur de l'id de "string" en "number"
    function roughScale(x, base) {
        const parsed = parseInt(x, base);
        if (isNaN(parsed)) {
            return 0
        } else {
            return parsed;
        }     
    }
    let categoryValueInt = roughScale(categoryValue, 10)

    //CREATION DU FORMDATA
    let formData = new FormData();
    formData.append('title', titleValue)
    formData.append('image', file)
    formData.append('category', categoryValueInt)

    //ENVOI DU FORMDATA A L'API POUR POSTER L'IMAGE, S'L EXISTE
    if (formData) {
        await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization':`Bearer ${adminToken}`,
                'accept': 'application/json',
            },
            body: formData
        })

 //////////////AJOUT INSTANTANNEE DE LA FIGURE DANS LA MODALE///////////////////////////
        .then(response => response.json())
        .then(data => {
            //Création des nouvelles figures dans la modale et sur la page d'accueil
            const galleryModal = document.querySelector(".gallery_modal");
            const newFigureModal = document.createElement("figure")
            const gallery = document.querySelector(".gallery");
            const newFigureAccueil = document.createElement("figure")
            //Ajout des id aux nouvelles figrues
            newFigureModal.id="figureModal"+data.id
            newFigureAccueil.id="figure" +data.id
            console.log(newFigureModal)

            //Ajout des class aux nouvelles figrues
            newFigureModal.classList.add("figureModal");
            newFigureAccueil.classList.add("figure");

            //lien des nouvelles figures à leur parent
            galleryModal.appendChild(newFigureModal)
            gallery.appendChild(newFigureAccueil)
            
            //Insertion des images aux nouvelles figures modales
            const newImageModal = document.createElement("img")
            let newFile = inputFileModal.files[0]
            newImageModal.src = URL.createObjectURL(newFile)
            newFigureModal.appendChild(newImageModal)

            //Insertion des images aux nouvelles figures de la page d'accueil
            const newImageAccueil = document.createElement("img")
            let newFileAccueil = inputFile.files[0]
            newImageAccueil.src = URL.createObjectURL(newFileAccueil)
            newFigureAccueil.appendChild(newImageAccueil)

            //Insertion des légendes aux nouvelles figures modales
            const figcaptionModal = document.createElement("figcaption");
            figcaptionModal.innerText = "editer";
            newFigureModal.appendChild(figcaptionModal);

            //Insertion des légendes aux nouvelles figures de la page d'accueil
            const figcaptionAccueil = document.createElement("figcaption");
            figcaptionAccueil.innerText = titleValue;
            newFigureAccueil.appendChild(figcaptionAccueil)

            //Création des boutons déplacement
            const newBoutonDeplacement = document.createElement("button");
            newBoutonDeplacement.className = "boutonDeplacement"
            //boutonDeplacement.id = i +1
            newFigureModal.appendChild(newBoutonDeplacement)
            const newIconDeplacement = document.createElement("i");
            newIconDeplacement.className = "fa-solid fa-arrows-up-down-left-right"
            newBoutonDeplacement.appendChild(newIconDeplacement)

            //Création du bouton suppression dans les nouvelles figures modales
            const newSuppression = document.createElement("button");
            newSuppression.className = "boutonSuppression"
            newSuppression.type = "submit"
            newFigureModal.appendChild(newSuppression)
            const iconSuppression = document.createElement("i");
            iconSuppression.className = "fa-solid fa-trash-can"
                    //iconSuppression.src = "assets/icons/trash-can-solid.svg"
            newSuppression.appendChild(iconSuppression)
        
            //"Mise en service" du bouton suppression pour les nouvelles figures de la modale
            newSuppression.addEventListener("click",function(){
               // document.querySelector(".gallery_modal").removeChild(document.querySelector(".figureModal" + data.id))
                //document.querySelector(".gallery").removeChild(document.querySelector(".figure" + data.id))
                document.querySelector(`#${newFigureModal.id}`).style="display:none"
                document.querySelector(`#${newFigureAccueil.id}`).style="display:none"
                console.log(data.id)
    
                const id = data.id
                fetch(`http://localhost:5678/api/works/${id}`, {
             method: "DELETE",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": `Bearer ${sessionStorage.adminToken}`,
                 }})
                 .catch(err => console.log(err))
               })
        })


    }
}

formulaireAjout.addEventListener("submit", function(event) {
    box.removeChild(document.querySelector("#vignette"))
    event.preventDefault()
    event.stopPropagation()
    ajoutFigure()
    
    let titleValue = document.querySelector("#title")
    titleValue.value=null
    
    modal2.style="display:none"
    //genererProjetsModal()
    modal1.style="display:flex"
})
