//////CODE CORRESPONDANT AU PREMIER AFFICHAGE DE LA PAGE
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();


function genererProjets(projets){
    for (let i = 0 ; i < projets.length; i++) {
        const projet = projets[i];
     
        // Récupération de l'élément du DOM qui accueillera les fiches
        const divGallery = document.querySelector(".gallery")

        // Création d’une balise dédiée au projet
        const figure = document.createElement("figure");
        figure.id="figure" +projet.id
                
        // Création des balises 
        const image = document.createElement("img");
        image.src = projet.imageUrl;
        figure.appendChild(image)

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = projet.title;

        figure.appendChild(figcaption);

        divGallery.appendChild(figure);
        }
}
// premier affichage de la page
genererProjets(projets);

//////FIN DU CODE CORRESPONDANT AU PREMIER AFFICHAGE DE LA PAGE


//////CODE CORRESPONDANT AUX FILTRES DES CATEGORIES

const categories = await fetch("http://localhost:5678/api/categories")
const cat = await categories.json();


const boutonTous = document.createElement("button");
boutonTous.innerText = "Tous";
document.querySelector(".filtres").appendChild(boutonTous);
boutonTous.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    genererProjets(projets)
});

for (let i = 0 ; i < cat.length; i++) {
    const bouton = document.createElement("button");
    bouton.innerText = cat[i].name
    bouton.addEventListener("click", function () {
        const filtre = projets.filter(function (projet) {
            return projet.categoryId == i+1;
            });  
            document.querySelector(".gallery").innerHTML = "";
            genererProjets(filtre);
        });

        document.querySelector(".filtres").appendChild(bouton);
}
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


    //RECUPERATION DE L'ELEMENT DU DOM QUI ACCUEILLERA LES FIGURES
    const galleryModal = document.querySelector(".gallery_modal");
    galleryModal.innerHTML = ""

    //CREATION DE CHACUNE DES FIGURES DE LA GALERIE MODALLE
    for (let i = 0; i < projetsModal.length; i++) {
        const projetModal = projetsModal[i];
     
        // Création d’une figure dédiée au projet dans la modale
        const figureModal = document.createElement("figure");
        figureModal.id = projetModal.id
        console.log(figureModal.id)
        figureModal.className = "figureModal"
        galleryModal.appendChild(figureModal);
                
        // Création de l'image dans la figure de la modale 
        const imageModal = document.createElement("img");
        imageModal.src = projetModal.imageUrl;
        figureModal.appendChild(imageModal)

        // Création de la légende dans la figure de la modale 
        const figModalcaption = document.createElement("figcaption");
        figModalcaption.innerText = "editer";
        figureModal.appendChild(figModalcaption);
        
        const suppression = document.createElement("button");
        suppression.className = "boutonSuppression"
        //suppression.id = projet.id
        suppression.type = "submit" 
        figureModal.appendChild(suppression)
        const iconSuppression = document.createElement("i");
        iconSuppression.className = "fa-solid fa-trash-can"
        //iconSuppression.src = "assets/icons/trash-can-solid.svg"
        suppression.appendChild(iconSuppression)
        
        // Création du bouton déplacmeent dans la figure de la modale  
        const boutonDeplacement = document.createElement("button");
        boutonDeplacement.className = "boutonDeplacement"
        boutonDeplacement.id = i +1
        figureModal.appendChild(boutonDeplacement);
        const iconDeplacement = document.createElement("i");
        iconDeplacement.className = "fa-solid fa-arrows-up-down-left-right"
        boutonDeplacement.appendChild(iconDeplacement)
       

         ////FONCTION QUI PERMET DE SUPPRIMER LES PROJETS/////////////////////
         suppression.addEventListener('click', async function() {
            const id = projetModal.id
            await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.adminToken}`,
            }})
            // .then(document.querySelector(".gallery_modal").innerHTML="")
            
            .then(document.querySelector(".gallery_modal").removeChild(document.querySelector("#fig" + id)))
        .then(document.querySelector(".gallery").removeChild(document.querySelector("#figure" + id)))
        


        

        //.then(const figureToSupress = document.querySelector("#figure" + id)
        //(console.log(figureToSupress)))
            .catch(err => console.log(err))
        })
    }

}  

// premier affichage de la page
document.querySelector(".js-modal").addEventListener('click', openModal)

//OUVERTURE DE LA GALERIE DE LA MODALE
const modal1 = document.querySelector("#modal1")
const modal2 = document.querySelector("#modal2")
const ajout = document.querySelector(".ajout")
ajout.addEventListener("click", function(){
  // let vignetteToSuppress = document.querySelector("#vignette")
  // vignetteToSuppress=null
  //  console.log(vignetteToSuppress)
  //  if(file.ok) {console.log("file présent")} else{console.log("pas de file")}
    //.then(genererProjetsModal(projetsModal))
    //modal2.reset()
    //modal1.style = "display:none"
    modal2.style = "display:flex"
})

/////////AFFICHAGE IMG SELECTIONNEE
const formulaireAjout = document.querySelector("#formulaire_ajout_figure")
    // Affichage vignette 
    //récupération de l'url de l'image
let inputFileModal = document.querySelector("#ajout_image")
const box = document.querySelector(".boite_grise")
const vignette = document.createElement("img")

inputFileModal.addEventListener("change", function(){
    const file = inputFileModal.files[0]
    vignette.src=  URL.createObjectURL(file)
    vignette.id="vignette"
    box.appendChild(vignette)

    
})

/*
    if (titleValue && file) {
        } else {alert("Formulaire incomplet")
    }

    //transformation de la valeur en number
    function roughScale(x, base) {
        const parsed = parseInt(x, base);
        if (isNaN(parsed)) {
            return 0
        } else {
            return parsed;
        }     
    }
    let categoryValueInt = roughScale(categoryValue, 10)

}

formulaire.addEventListener("submit", function(event) {
    event.preventDefault()
    ajoutFigure()
}) 

*/
////////////////////////////////////////


//DEFINITION DES ACTIONS POUR RETURN & CLOSE
document.querySelector(".js-modal-return").addEventListener("click", function () {
    modal1.style="display:flex"
    modal2.style = "display:none"
})
document.querySelector(".js-modal-close2").addEventListener("click", function () {
    modal2.style="display:none"
})

//RECUPERATION DES CATEGORIES & DU TOKEN VIA LE LOCALHOST
// let categoriesModal = await fetch("http://localhost:5678/api/categories")
// let catModal = await categoriesModal.json();
const adminToken = sessionStorage.getItem('adminToken')

cat.forEach(element => {    
    const option = document.createElement("option");
    option.value = element.id
    option.innerText = element.name
    document.querySelector("#category").appendChild(option)
});


//CREATION DE LA FONCTION POUR AJOUTER LES FIGURES


let inputFile = document.querySelector("#ajout_image")
inputFile.classList.add("fileInput");
inputFile.setAttribute("accept",".png, .jpg, .jpeg");
inputFile.type= "file";

async function ajoutFigure () {
    console.log(projets)
    // RECUPERATION DES DONNEES DE L'IMAGE    

    // récupération du title
    const titleValue = document.querySelector("#title").value
    let categoryValue = document.querySelector("#category").value;
    //récupération de l'url de l'image
    let inputFile = document.querySelector("#ajout_image")
    const file = inputFile.files[0]

    if (titleValue && file) {
        } else {alert("Formulaire incomplet")
    }

    //transformation de la valeur en number
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
              const galleryModal = document.querySelector(".gallery_modal");
              const newFigure = document.createElement("figure");
              const gallery = document.querySelector(".gallery");
                const newFigureAccueil = document.createElement("figure");
          
              newFigure.id="fig"+data.id//figure.id = "fig" + projet.id
              newFigureAccueil.id="fig"+data.id
              //////
              console.log(newFigure.id)
              console.log(newFigureAccueil.id)

              newFigure.classList.add("figures");
              galleryModal.appendChild(newFigure)
              newFigureAccueil.classList.add("figures");
              gallery.appendChild(newFigureAccueil)
              
              // Création des balises 
              const newImage = document.createElement("img")
              let newFile = inputFileModal.files[0]
              newImage.src = URL.createObjectURL(newFile)
              newFigure.appendChild(newImage)

              const newImageAccueil = document.createElement("img")
               let newFileAccueil = inputFile.files[0]
                newImageAccueil.src = URL.createObjectURL(newFileAccueil)
                newFigureAccueil.appendChild(newImageAccueil)
              
              const figcaption = document.createElement("figcaption");
            figcaption.innerText = "editer";
            newFigure.appendChild(figcaption);
            const figcaptionAccueil = document.createElement("figcaption");
              figcaptionAccueil.innerText = titleValue;
              newFigureAccueil.appendChild(figcaptionAccueil)
        
            const suppression = document.createElement("button");
            
            suppression.className = "boutonSuppression"
            //suppression.id = projets.id
            //newFigure.id = projets.id
            //console.log(suppression.id)
            suppression.type = "submit"
            newFigure.appendChild(suppression)
           suppression.addEventListener("click",function(){
            document.querySelector(".gallery_modal").removeChild(document.querySelector("#fig" + data.id))
            document.querySelector(".gallery").removeChild(document.querySelector("#figure" + data.id))
            //document.querySelector(`#${newFigure.id}`).style="display:none"
            //document.querySelector(`#${newFigureAccueil.id}`).style="display:none"

           })








            /*suppression.addEventListener('click', async function() {
                const id = projets.id
                await fetch(`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.adminToken}`,
                }})
            
         //   .then(document.querySelector(".gallery_modal").removeChild(document.querySelector("#fig" + id)))
          //  .then(document.querySelector(".gallery").removeChild(document.querySelector("#figure" + id)))
        

            //.then(const figureToSupress = document.querySelector("#figure" + id)
            //(console.log(figureToSupress)))
                .catch(err => console.log(err))
                
            })*/


       

        const iconSuppression = document.createElement("i");
        iconSuppression.className = "fa-solid fa-trash-can"
        //iconSuppression.src = "assets/icons/trash-can-solid.svg"
        suppression.appendChild(iconSuppression)
        //newFigure.appendChlid(suppression)
        
        //problème à voir avec le bouton deplacement
         const boutonDeplacement = document.createElement("button");
            boutonDeplacement.className = "boutonDeplacement"
            //boutonDeplacement.id = i +1
            
            
            newFigure.appendChild(boutonDeplacement);
            /*figureModal.addEventListener("mouseover", function() {
                if(boutonDeplacement.id === figureModal.id) {
                boutonDeplacement.style = "display:block"
                }
            })*/
             
            const iconDeplacement = document.createElement("i");
            iconDeplacement.className = "fa-solid fa-arrows-up-down-left-right"
            boutonDeplacement.appendChild(iconDeplacement)
        genererBoutonDeplacement()
              })
              ////////////////////////////////////////
             /* .then(data => {
                const gallery = document.querySelector(".gallery");
                const newFigureAccueil = document.createElement("figure");
            
                newFigureAccueil.id="fig"+data.id
                
                console.log(newFigureAccueil.id)
  
                newFigureAccueil.classList.add("figures");
                gallery.appendChild(newFigureAccueil)
                
                // Création des balises 
                const newImageAccueil = document.createElement("img")
               let newFileAccueil = inputFile.files[0]
                newImageAccueil.src = URL.createObjectURL(newFileAccueil)
                newFigureAccueil.appendChild(newImageAccueil)
                
                const figcaptionAccueil = document.createElement("figcaption");
              figcaptionAccueil.innerText = "editer";
              newFigureAccueil.appendChild(figcaptionAccueil)
              })*/




              ///////////////////////////////
        .then(box.removeChild(document.querySelector("#vignette")))
  
       // .then(document.querySelector(".gallery_modal").removeChild(document.querySelector("#fig" + id)))
        //.then(document.querySelector(".gallery").removeChild(document.querySelector("#figure" + id)))
          //.then(box.removeChild(document.querySelector("#vignette")))
   
      //.catch(error => console.error(error))
        
       
        //)
        .then(console.log(file))
        .then(console.log(inputFile))
        ///////On essaie d'ajouter directement la photo à la modale


        //.catch(err => console.log(err))
        
    }
}

formulaireAjout.addEventListener("submit", function(event) {
    event.preventDefault()
    event.stopPropagation()
    ajoutFigure()
    
    let titleValue = document.querySelector("#title")
    titleValue.value=null
    
    modal2.style="display:none"
    //genererProjetsModal()
    modal1.style="display:flex"
})
