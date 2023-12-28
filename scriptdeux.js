//**Afficher Projet**/

const apiWorks = "http://localhost:5678/api/works"

const sectionGallery = document.querySelector(".gallery")
let getPhotos;
fetch(apiWorks)
    .then( data => data.json()) /* récupère les données brut */
    .then( jsonlistPhotos => {
        getPhotos = jsonlistPhotos
        console.log(jsonlistPhotos); /* affiche les éléments dans la console */
        afficherPhotos(jsonlistPhotos, sectionGallery)
    })

function afficherPhotos(array,container, isModal = false) {
    container.innerHTML =""
    for (let i = 0; i < array.length; i++) { /* boucle for pour itéré chaque élément */
        const figurePhotos = document.createElement('figure')/* création élément figure */
        const imgPhotos = document.createElement('img') /* création de 'l'image */
        imgPhotos.src = array[i].imageUrl/* récuperer via l'url  */
        figurePhotos.appendChild(imgPhotos) /* rattache l'iamge à la figure */
        figurePhotos.dataset.id = array[i].id;

        if (!isModal){
        const figureDesc = document.createElement('figcaption')/* création élément figureDesc pour le texte */
        figureDesc.innerHTML = array[i].title /* ajout texte dans figureDesc */
        figureDesc.classList.add("fig-desc")
        figurePhotos.appendChild(figureDesc)/* ajout figureDesc sous l'image dans figure */ 
    }
        if (isModal) {
            const trashIcon = document.createElement('div')
            const trash = document.createElement('i')
    
            trashIcon.classList.add("trash-modal")
            trashIcon.classList.add(`trash-${i}`)
            trash.classList.add('fa-solid', 'fa-trash-can')
    
            trashIcon.appendChild(trash)
            figurePhotos.appendChild(trashIcon)
            
        }
    container.appendChild(figurePhotos)/* on ajoute tout dans le conteneur */
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
            afficherPhotos(getPhotos, sectionGallery)
        })

        for (let i = 0; i < categories.length; i++) {

        const filterButton = document.createElement('button') /* création des boutons */
        filterButton.innerText = categories[i].name /* récupere les infos via le name */
        filterButton.classList.add("button-categories")
        container.appendChild(filterButton) /* ajoute les boutons dans le container */
       
        filterButton.addEventListener("click", function () { /* ajout ecouteur d'évenements aux btns */
            const categoryId = categories[i].id; /* extraire l'id de la catégorie du btn qu'on a cliqué, stock dans variable categoryId */
            console.log("filtrer par catégorie :", categoryId);
            const photosFiltrer = getPhotos.filter(photo => photo.categoryId === categoryId); /* filter sur Array photos, on récupere les photos qui ont l'ID qui est = a l'ID de la catégorie sur laquelle on a cliqué */
            console.log("Photos filtrées :", photosFiltrer);

            afficherPhotos(photosFiltrer, sectionGallery);
        });
        
    }
    } 


/**Faire apparaitre fenetre Modale **/  

const openModal = function (e){
    e.preventDefault()     
    const target = document.querySelector(e.target.getAttribute('href'))
    if (!target) {
        console.error('Modal non trouvé.');
        return
    }

    target.style.display = null
    target.removeAttribute ('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target

    if (modal){
        modal.addEventListener('click',closeModal)
        const closeBtn = modal.querySelector('.close')
        if (closeBtn){
            closeBtn.addEventListener('click', closeModal)
        }

        const stopBtn = modal.querySelector('.js-modal-stop')
        if (stopBtn){
        stopBtn.addEventListener('click', stopPropagation)
        }
    }
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = 'none'
    modal.setAttribute ('aria-hidden', true)
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)

    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}


document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)

})


/**Afficher photos dans la fenetre modale**/ 


const modalWrapper = document.querySelector('.modal-wrapper')

function afficherGaleriePhoto() {
    const modalPhoto = document.createElement('div')
    const modalLigne = document.createElement('div')
    const modalBtn = document.createElement('div')


    modalPhoto.classList.add('modal-photos')
    modalLigne.classList.add('modal-ligne')
    modalBtn.classList.add('modal-btn')
    modalBtn.innerText ='Ajouter une photo'

    modalWrapper.appendChild(modalPhoto)
    modalWrapper.appendChild(modalLigne)
    modalWrapper.appendChild(modalBtn)
 
    fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(jsonlistPhotos => {
        getPhotos = jsonlistPhotos;
        const photoContainer = document.querySelector('.modal-photos')
        afficherPhotos(getPhotos, photoContainer, true);

        const figureDescs = photoContainer.querySelectorAll('.figcaption')
        figureDescs.forEach(figureDesc => {
            figureDesc.remove()
        })    
        deletePhotos() /* j'apelle la fonction ici, sinon le node list est lu avant meme que les trash soient créées  */
    })
}
afficherGaleriePhoto()



  /* supprimer au clic l'image de la galerie et de la base de données */

function deletePhotos() {
    const trashAll = document.querySelectorAll('.trash-modal')
    trashAll.forEach(trashIcon =>{
        trashIcon.addEventListener('click',(e) => {
            const id = trashIcon.parentElement.dataset.id
            const init = {
                method: 'DELETE', 
                headers: {'Authorization': `Bearer ${token}`},
            }
            fetch("http://localhost:5678/api/works/" +id,init)
            .then((response) =>{
                if(!response.ok){
                    console.log(("le delete n'a pas marché"));
                }
                return response.json()
            })
            .then((data)=>{
                console.log("le delete a réussi voila la data", data)
                afficherGaleriePhoto()
               
            })
        })
    })
}
