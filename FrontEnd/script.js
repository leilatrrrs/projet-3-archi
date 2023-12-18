//**Afficher Projet**/

const apiWorks = "http://localhost:5678/api/works"

const sectionGallery = document.querySelector(".gallery")
let photos;
fetch(apiWorks)
    .then( data => data.json()) /* récupère les données brut */
    .then( jsonlistPhotos => {
       photos = jsonlistPhotos
        console.log(jsonlistPhotos); /* affiche les éléments dans la console */
        afficherPhotos(jsonlistPhotos, sectionGallery)
    })

function afficherPhotos(array,container) {
    container.innerHTML =""
    for (let i = 0; i < array.length; i++) { /* boucle for pour itéré chaque élément */
        const figurePhotos = document.createElement('figure')/* création élément figure */
        
        const imgPhotos = document.createElement('img') /* création de 'l'image */
        imgPhotos.src = array[i].imageUrl/* récuperer via l'url  */
        figurePhotos.appendChild(imgPhotos) /* rattache l'iamge à la figure */
        
        const figureDesc = document.createElement('figcaption')/* création élément figureDesc pour le texte */
        figureDesc.innerHTML = array[i].title /* ajout texte dans figureDesc */
        figureDesc.classList.add("fig-desc")
        figurePhotos.appendChild(figureDesc)/* ajout figureDesc sous l'image dans figure */

        container.appendChild(figurePhotos) /* on ajoute tout dans le conteneur */
    }
}

/** Afficher filter-bar**/

const apiCategories = "http://localhost:5678/api/categories"

const sectionFilterBar = document.querySelector(".filter-bar")

fetch(apiCategories)
    .then( data => data.json()) /* récupère les données brut */
    .then( jsonlistCategories => {
        console.log(jsonlistCategories); /* affiche les éléments dans la console */
        afficherFiltre(jsonlistCategories, sectionFilterBar)
    })

function afficherFiltre(categories, container) {
        const buttonAll = document.createElement("button") /* création d'un bouton */ 
        buttonAll.innerText = "Tous" /* bouton affichera "tous" */
        buttonAll.classList.add("button-categories")
        container.appendChild(buttonAll) /* ajout du bouton dans le container */

        buttonAll.addEventListener("click", function () { /* ajout ecouteur d'évenements au btn "tous" */
            afficherPhotos(photos, sectionGallery)
        })

        for (let i = 0; i < categories.length; i++) {

        const filterButton = document.createElement('button') /* création des boutons */
        filterButton.innerText = categories[i].name /* récupere les infos via le name */
        filterButton.classList.add("button-categories")
        container.appendChild(filterButton) /* ajoute les boutons dans le container */
       
        filterButton.addEventListener("click", function () { /* ajout ecouteur d'évenements aux btns */
            const categoryId = categories[i].id; /* extraire l'id de la catégorie du btn qu'on a cliqué, stock dans variable categoryId */
            console.log("filtrer par catégorie :", categoryId);
            const photosFiltrer = photos.filter(photo => photo.categoryId === categoryId); /* filter sur Array photos, on récupere les photos qui ont l'ID qui est = a l'ID de la catégorie sur laquelle on a cliqué */
            console.log("Photos filtrées :", photosFiltrer);

            afficherPhotos(photosFiltrer, sectionGallery);
        });
        
    }
    }
