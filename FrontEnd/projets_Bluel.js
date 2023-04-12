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