let editForm = document.querySelector("form#dog-form")
let displayForm = document.querySelector("table.margin")
// CHECK INNERHTML, GLOBAL SELECTORS 
//deliverable 1 is probably get, so we make a fetch request, invoke it too!
//inside fetch, usually a helper to render onto DOM 
//this render function adds it, gotta remember to append and have dataset.id/classes/ids as needed
// this will be invoked bc its a helper to GET 
//say we have a form, make an fnc event on outermost Element of form 
// have to invoke these again, limit e.target.matches as needed
//call a helper (might need ID), this helper could be a fetch request of sorts
//depends on what kind of event you created

//addToEditForm was just a click event showing data to form
//was specific to this lab, better UI 


fetchDogs()
displayFormEvent()
editFormEvent()

function fetchDogs(){
  fetch("http://localhost:3000/dogs")
  .then(res => res.json())
  .then(dogArr => {
    dogArr.forEach((dogObj) => {
      addDogToTable(dogObj)
    })
  })
}

function addDogToTable(dogObj) {

  tr = document.createElement("tr")
  tr.dataset.id = dogObj.id 
  tdName = document.createElement("td")
  tdName.className ="dog-name"
  tdBreed = document.createElement("td")
  tdBreed.className ="dog-breed"
  tdSex = document.createElement("td")
  tdSex.className = "dog-sex"
  tdButton = document.createElement("td")
  button = document.createElement("button")

  button.innerText = "Edit Dog"
  button.className = "edit"
  button.dataset.id = dogObj.id 
  tdButton.append(button)

  tdName.innerText = dogObj.name
  tdBreed.innerText = dogObj.breed 
  tdSex.innerText = dogObj.sex 


  tr.append(tdName, tdBreed, tdSex, tdButton)
  displayForm.append(tr)


}

function displayFormEvent() {
  displayForm.addEventListener("click", (e) => {
    if (e.target.matches("button.edit")) {
      getDogInfo(e.target.dataset.id)
    }
    
  })
}

function getDogInfo(dogId){
  fetch(`http://localhost:3000/dogs/${dogId}`)
  .then(res => res.json())
  .then(dogObj => {
    addToEditForm(dogObj)
  })
}

function addToEditForm(dogObj) {
  let editName = editForm.querySelector('input[name="name"]')
  editName.value = dogObj.name 
  let editBreed = editForm.querySelector('input[name="breed"]')
  editBreed.value = dogObj.breed 
  let editSex = editForm.querySelector('input[name="sex"]')
  editSex.value = dogObj.sex 
  editForm.dataset.id = dogObj.id 

}

function editFormEvent(){
  editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let newName = e.target.name.value 
    let newBreed = e.target.breed.value
    let newSex = e.target.sex.value 


    let newDog = {
      name: newName,
      breed: newBreed,
      sex: newSex,
      id: e.target.dataset.id
    }
    patchDog(newDog)
    e.target.reset()
  })
}

function patchDog(newDog) {
  fetch(`http://localhost:3000/dogs/${newDog.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(newDog)
  })
  .then(res => res.json())
  .then(updatedDog => {
    console.log("UPDATED DOG:", updatedDog)
    let newRow = displayForm.querySelector(`tr[data-id='${updatedDog.id}']`)
    let newName = newRow.querySelector(".dog-name")
    let newBreed = newRow.querySelector(".dog-breed")
    let newSex = newRow.querySelector(".dog-sex")

    newName.innerText = updatedDog.name
    newBreed.innerText = updatedDog.breed 
    newSex.innerText = updatedDog.sex 
  })

}