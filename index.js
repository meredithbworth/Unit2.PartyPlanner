const COHORT = "2310-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-meredith/events`;

const state = {
  parties: [],
};

//get all parties
const getParties = async () => {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    state.parties = json.data;

    renderParties();
  } catch (error) {
    console.log(error);
  }
};

//add a party
const addParty = async (event) => {
  event.preventDefault();

  const addPartyForm = document.querySelector("#new-party-form");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        date: new Date(addPartyForm.date.value).toISOString(),
        description: addPartyForm.description.value,
        location: addPartyForm.location.value,
      }),
    });

    if (!response.ok) {
      alert("Failed to add party");
    }

    addPartyForm.name.value = "";
    addPartyForm.date.value = "";
    addPartyForm.description.value = "";
    addPartyForm.location.value = "";
    //re-render parties after adding the party
    await getParties();
  } catch (error) {
    console.error(error);
  }
};

//delete a party
const deleteParty = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to delete party");
    }

    //re-render parties after deleting the party
    await getParties();
  } catch (error) {
    console.error(error);
  }
};

//render the party data on the page
const renderParties = () => {
  const partyContainer = document.querySelector("#party-container");

  //resets HTML of all parties
  partyContainer.innerHTML = "";

  if (!state.parties.length) {
    const h2 = document.createElement("h2");
    h2.innerHTML = "No parties";
    partyContainer.appendChild(h2);
  }

  state.parties.forEach((party) => {
    const partyElement = document.createElement("div");
    partyElement.classList.add("party");
    partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.location}</p>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
    partyContainer.appendChild(partyElement);
  });

  //add event listener to delete the parties
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", async (event) => {
      try {
        const id = event.target.dataset.id;
        await deleteParty(id);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const init = async () => {
  await getParties();
  const partyForm = document.querySelector(".new-party-btn");
  partyForm.addEventListener("click", addParty);
};

init();