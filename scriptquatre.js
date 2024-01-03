//**Afficher Projet**/

const apiWorks = "http://localhost:5678/api/works"
const apiCategories = "http://localhost:5678/api/categories";
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
    if (!container) {
        console.error("Le conteneur n'est pas défini.");
        return;
    }
    container.innerHTML =""
    for (let i = 0; i < array.length; i++) { /* boucle for pour itéré chaque élément */
        const figurePhotos = document.createElement('figure')/* création élément figure */
        const imgPhotos = document.createElement('img') /* création de 'l'image */
        imgPhotos.src = array[i].imageUrl/* récuperer via l'url  */
        figurePhotos.appendChild(imgPhotos) /* rattache l'iamge à la figure */
        figurePhotos.dataset.id = array[i].id;
        console.log("l'id, c'est",figurePhotos);

        if (!isModal){
        const figureDesc = document.createElement('figcaption')/* création élément figureDesc pour le texte */
        figureDesc.innerHTML = array[i].title /* ajout texte dans figureDesc */
        figureDesc.classList.add("fig-desc")
        figurePhotos.appendChild(figureDesc)/* ajout figureDesc sous l'image dans figure */ 
        }
        if(isModal){
        const trashContainer = document.createElement('div')
        const trash = document.createElement('i')
        trashContainer.classList.add('modale-corbeille')
        trashContainer.classList.add(`trash-${i}`)
        trash.classList.add('fa-solid', 'fa-trash-can')
        trashContainer.appendChild(trash)
        figurePhotos.appendChild(trashContainer)

        trashContainer.addEventListener('click', function () {
            supprimerPhoto(getPhotos[i].id, i);
        })

    }    
    
    container.appendChild(figurePhotos)/* on ajoute tout dans le conteneur */

    }
    }


/** Afficher filter-bar**/


const sectionFilterBar = document.querySelector(".filter-bar")
let getCategories
fetch(apiCategories)
    .then( data => data.json()) /* récupère les données brut */
    .then( jsonlistCategories => {
        getCategories = jsonlistCategories
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
let closeBtn;

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
        closeBtn = modal.querySelector('.close')
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
    if (e){
    e.preventDefault()
    }
    
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

let modalBtn;
let modalLigne; 
let modalPhoto;
let modalTitle;
const modalWrapper = document.querySelector('.modal-wrapper')

function afficherGaleriePhoto() {
    modalPhoto = document.createElement('div')
    modalLigne = document.createElement('div')
    modalBtn = document.createElement('div')
    modalTitle = document.getElementById('titlemodal')

    modalPhoto.classList.add('modal-photos')
    modalLigne.classList.add('modal-ligne')
    modalBtn.classList.add('modal-btn')
    modalBtn.innerText ='Ajouter une photo'

    modalWrapper.appendChild(modalPhoto)
    modalWrapper.appendChild(modalLigne)
    modalWrapper.appendChild(modalBtn)
 
    fetch(apiWorks)
    .then(data => data.json())
    .then(jsonlistPhotos => {
        getPhotos = jsonlistPhotos;
        const photoContainer = document.querySelector('.modal-photos')
        afficherPhotos(getPhotos, photoContainer, true);


        const figureDescs = photoContainer.querySelectorAll('.figcaption')
        figureDescs.forEach(figureDesc => {
            figureDesc.remove()
        })    
    })
    modalBtn.addEventListener('click', async (e) =>{
        e.preventDefault()
        hideModalContent()
        console.log('clic sur modalBtn');
        createForm(modalWrapper, getCategories)
    })
       
}
afficherGaleriePhoto()



// Ajoutez la fonction supprimerPhoto
function supprimerPhoto(photoId, index) {
    // Supprimer la photo de la galerie modale
    const modalPhoto = document.querySelector('.modal-photos');
    const modalTrash = document.querySelector(`.trash-${index}`);
    modalPhoto.removeChild(modalTrash.parentElement);

    // Supprimer la photo de la page principale
    const galleryPhoto = document.querySelector(`[data-id="${photoId}"]`);
    galleryPhoto.parentElement.removeChild(galleryPhoto);

    // Envoyer une demande de suppression à la base de données
    const apiWorksDelete = `http://localhost:5678/api/works/${photoId}`;
    const token = localStorage.getItem('token');

    fetch(apiWorksDelete, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then(response => {
        if (response.ok) {
            console.log(`Photo avec l'ID ${photoId} supprimée de la base de données.`);
        } else {
            console.error('Échec de la suppression de la photo de la base de données.');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la communication avec le serveur :', error);
    });
}










function hideModalContent() {
    modalLigne.style.display = 'none'
    modalBtn.style.display = 'none'
    modalPhoto.style.display = 'none'
    modalTitle.style.display = 'none'
    closeBtn.style.display = "none"
}


function showAllModalContent() {
    modalLigne.style.display = null
    modalBtn.style.display = null
    modalPhoto.style.display = null
    modalTitle.style.display = null
}

function hideCreateForm() {
    modalForm.style.display = "none"
    modalBackBtn.style.display = "none"
    modalCloseBtn.style.display = "none"
    modalTitre.style.display = "none"
    modalButton.style.display = "none"
    showAllModalContent()
}

let modalForm;
let modalBackBtn;
let modalCloseBtn;
let modalTitre;
let modalButton
function createForm(modalWrapper, getCategories) {
  

    /***création btn retour***/
    modalBackBtn = document.createElement("button")
    modalBackBtn.classList.add("js-form-back")
    const modalBackMark = document.createElement("i")
    modalBackMark.classList.add("fa-solid", "fa-arrow-left", "modal-back")
    modalBackBtn.appendChild(modalBackMark)
    modalBackBtn.addEventListener("click", function (){
        modalWrapper.innerHTML = ""
        afficherPhotos(apiWorks )/* pzs sur */
    })

    /***création btn fermeture***/
    modalCloseBtn = document.createElement("button")
    modalCloseBtn.classList.add('js-form-close')
    const modalCloseMark = document.createElement("i")
    modalCloseMark.classList.add("fa-solid", "fa-xmark")
    modalCloseBtn.appendChild(modalCloseMark)
    modalCloseBtn.addEventListener("click",closeModal)

    /***création formulaire***/
    modalTitre = document.createElement("h1")
    modalTitre.innerText ="Ajout photo"

    modalForm = document.createElement("form")
    modalForm.classList.add("modal-form")
    modalForm.setAttribute("action", "#")
    modalForm.setAttribute("method", "post")
    modalForm.setAttribute("enctype", "multipart/form-data") /* Pour la trasmission de fichier via un formualire HTML, car un fichier joint va etre transféré */

    const modalImageLabel = document.createElement("label")
    modalImageLabel.classList.add("modal-image-label")
    const modalImageIcon = document.createElement('i')
    modalImageIcon.classList.add("fa-regular", "fa-image")
    const modalImageInput = document.createElement("input")
    modalImageInput.type = "file"
    modalImageInput.name = "image"
    modalImageInput.setAttribute('accept', 'image/jpeg, image/jpg, image/png')

    

    const modalImageContainer = document.createElement("div"); // Créez une div pour contenir le label et l'input
    modalImageContainer.appendChild(modalImageLabel);
    modalImageContainer.appendChild(modalImageInput);

    modalForm.appendChild(modalImageContainer);
    const ModalBtnAdd = document.createElement("p")
    ModalBtnAdd.classList.add('modal-btn-add')
    ModalBtnAdd.innerText = '+ Ajouter photo'
    const modalText = document.createElement('p')
    modalText.classList.add('modal-text')
    modalText.innerText ='jpg, png: 4mo max'

    const modalTitleLabel = document.createElement("label")
    modalTitleLabel.setAttribute("for", "title")
    modalTitleLabel.innerText = "Titre"
    const modalTitleInput = document.createElement("input")
    modalTitleInput.type = "text"
    modalTitleInput.name = "title"

    const modalCategorieLabel = document.createElement("label")
    modalCategorieLabel.setAttribute("for", "category")
    modalCategorieLabel.innerText= "Catégorie"
    
    const modalCategorieSelect = document.createElement("select")
    modalCategorieSelect.name = "category"
    modalCategorieSelect.classList.add("modal-hide-text"); 

    getCategories.forEach(category=>{
        const modalOption = document.createElement("option")
        modalOption.value = category.id
        modalOption.textContent = category.name
        modalCategorieSelect.appendChild(modalOption)
    })

    const modalLine = document.createElement('div')
    modalLine.classList.add('modal-ligne')

    modalButton = document.createElement("button")
    modalButton.type = "submit"
    modalButton.innerText = "Valider"
    modalButton.classList.add("form-btn")
    
    modalImageLabel.appendChild(modalImageIcon);
    modalImageLabel.appendChild(modalImageInput);
    modalImageLabel.appendChild(ModalBtnAdd);
    modalImageLabel.appendChild(modalText);
    modalForm.appendChild(modalImageLabel);
    modalForm.appendChild(modalTitleLabel);
    modalForm.appendChild(modalTitleInput);
    modalForm.appendChild(modalCategorieLabel);
    modalForm.appendChild(modalCategorieSelect);
    modalForm.appendChild(modalLine);
    modalForm.appendChild(modalButton);
    modalWrapper.appendChild(modalBackBtn);
    modalWrapper.appendChild(modalCloseBtn);
    modalWrapper.appendChild(modalTitre);
    modalWrapper.appendChild(modalForm); 
  
   
    modalImageInput.addEventListener("change", function (e){
        checkImgSize(e, modalImageLabel)
    })
    modalForm.addEventListener("submit", function(e){
        sendFormData(e, modalImageInput, modalWrapper)
        hideCreateForm()
        showAllModalContent()
        
    })

}

document.addEventListener('DOMContentLoaded', function () {
    const modalWrapper = document.querySelector('.modal-wrapper');
    console.log("c'est", modalWrapper);
})



/* envoi données du formulaire */

async function sendFormData(e,modalImageInput) {
    e.preventDefault()

    const apiWorks = "http://localhost:5678/api/works"
    const token = localStorage.getItem('token')
    console.log("le token du form", token);
    const imgResult = modalImageInput.files[0]
    console.log("l'image result", imgResult);
    const title = document.querySelector("input[name='title']").value
    const modalCategorieSelect = document.querySelector("select[name='category']")
    const catId = modalCategorieSelect.options[modalCategorieSelect.selectedIndex].value

    if (!imgResult) {
        alert("Aucun fichier sélectionné");
        return
    }

      if (!title) {
        alert("Veuillez entrer un titre");
        return;  
    }

    if (!catId) {
        alert("Veuillez sélectionner une catégorie");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imgResult);
    formData.append('category', catId);


    try {
        const response = await fetch(apiWorks, {
          method: "POST",
          headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {
            const newWork = await response.json();
            getPhotos.push(newWork);
            sectionGallery.innerHTML = ""
            afficherPhotos(getPhotos, sectionGallery)
            console.log("Fermeture de la modale après ajout réussi.")
            closeModal()
            
    } else {
      console.log("Une erreur s'est produite lors de l'ajout de l'élément dans la galerie.");
    }
  } catch (error) {
    console.log("Une erreur s'est produite lors de la communication avec le serveur.", error);
  }
}


function checkImgSize(e, modalImageLabel) {
    const file = e.target.files[0]; // Récupère le fichier sélectionné
    if (file.size > 4 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 4 Mo.");
      // Réinitialise la valeur de l'input pour permettre à l'utilisateur de sélectionner à nouveau un fichier
      e.target.value = "";
    } else {
        // La taille du fichier est valide
        const imgPreview = document.createElement("img");
        imgPreview.classList.add("preview-img");
        imgPreview.src = URL.createObjectURL(file);
  
        // Remplace les éléments dans imgLabel par l'image sélectionnée
        modalImageLabel.innerHTML = "";
        modalImageLabel.appendChild(imgPreview);
        // Remplace les éléments dans imgLabel par l'image sélectionnée
        modalImageLabel.innerHTML = "";
        modalImageLabel.appendChild(imgPreview);
        modalButton.style.backgroundColor = "#1d6154"; 
      
    
      }
    }
  
  