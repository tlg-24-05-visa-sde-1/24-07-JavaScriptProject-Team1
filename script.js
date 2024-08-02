// Add an event listener to the form with the ID "detailsForForm" that triggers the handleFormSubmit function when the form is submitted.
document
  .querySelector("#detailsForForm")
  .addEventListener("submit", handleFormSubmit);

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevents the default form submission behavior (which would reload the page).

  // Retrieve values from the form fields by accessing them through the event target's elements property.
  const destinationName = event.target.elements["name"].value;
  const destinationLocation = event.target.elements["location"].value;
  //   const destinationPhoto = event.target.elements["photo"].value;
  const destinationDescription = event.target.elements["description"].value;

  //Ditched photo field cuz I want a random one generated!

  const photoUrl = await fetchPhoto(destinationLocation);

  // Reset the form fields after submission.
  //rename to resetFormValue ?
  resetCardValue(event.target);

  // Create a new card with the destination details.
  const destinationCard = createDestinationCard(
    destinationName,
    destinationLocation,
    // destinationPhoto,
    photoUrl,
    destinationDescription
  );

  // Get the container where destination cards are displayed.
  const listContainer = document.querySelector("#destinationsContainer");

  // If it's the first card added, change the title to "Wish List".
  if (listContainer.children.length === 0) {
    document.querySelector("#title").innerHTML = "Wish List";
  }

  // Append the newly created destination card to the list container.
  listContainer.appendChild(destinationCard);
}

//Fetch with API key: read up about these
// async
// await
async function fetchPhoto(location) {
  const accessKey = "vKqXBxA_8rL3q5vJVC9HN5SR6BrDGNyed2q6GTMhegc";
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=${location}&client_id=${accessKey}`
  );
  const data = await response.json();
  return (
    data.urls.small ||
    "https://cavchronicle.org/wp-content/uploads/2018/03/top-travel-destination-for-visas-900x504.jpg"
  );
}

// Function to reset the values of the form fields.
function resetCardValue(form) {
  for (let i = 0; i < form.length; i++) {
    form.elements[i].value = ""; // Set each form field's value to an empty string.
  }
}

// Function to create a card for a destination.
function createDestinationCard(name, location, photoUrl, description) {
  // Create the main card div element.
  const card = document.createElement("div");
  card.setAttribute("class", "card");
  card.style.width = "15rem";
  card.style.height = "fit-content";
  card.style.margin = "20px";

  // Create an image element for the card.
  const img = document.createElement("img");
  img.setAttribute("class", "card-img");
  img.setAttribute("alt", name);
  // If no photo URL is provided, use the default image.
  img.setAttribute(
    "src",
    photoUrl.length === 0
      ? "https://cavchronicle.org/wp-content/uploads/2018/03/top-travel-destination-for-visas-900x504.jpg"
      : photoUrl
  );

  // Append the image to the card.
  card.appendChild(img);

  // Create a div element for the card body (contains text and buttons).
  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  // Create and append a title element to the card body.
  const cardTitle = document.createElement("h4");
  cardTitle.setAttribute = ("class", "card-title");
  cardTitle.innerText = name;
  cardBody.appendChild(cardTitle);

  // Create and append a subtitle element (location) to the card body.
  const cardLocation = document.createElement("h5");
  cardLocation.setAttribute = ("class", "sub-title");
  cardLocation.innerText = location;
  cardBody.appendChild(cardLocation);

  // If a description is provided, create and append a paragraph element for it.
  if (description.length !== 0) {
    const cardDescription = document.createElement("p");
    cardDescription.setAttribute = ("class", "paragraph-description");
    cardDescription.innerText = description;
    cardBody.appendChild(cardDescription);
  }

  // Create a container for the buttons.
  const groupButtons = document.createElement("div");
  groupButtons.setAttribute("class", "button-container");

  // Create an Edit button and set up its event listener.
  const editButton = document.createElement("button");
  editButton.setAttribute = ("class", "btn btn-warning");
  editButton.innerText = "Edit";
  editButton.addEventListener("click", editDestinaton);

  // Create a Remove button and set up its event listener.
  const removeButton = document.createElement("button");
  removeButton.setAttribute = ("class", "btn btn-danger");
  removeButton.innerText = "Remove";
  removeButton.addEventListener("click", removeDestination);

  // Append the Edit and Remove buttons to the button container.
  groupButtons.appendChild(editButton);
  groupButtons.appendChild(removeButton);

  // Append the button container to the card body.
  cardBody.appendChild(groupButtons);

  // Append the card body to the main card element.
  card.appendChild(cardBody);

  // Return the complete card element.
  return card;
}

//WHEN CARD EDITS--GET NEW PHOTO
//CHANGE GET URL to splash

// Function to handle editing a destination card.
function editDestinaton(event) {
  // Get the card body and extract its title, location, and photo URL.
  const cardBody = event.target.parentElement.parentElement;
  const title = cardBody.children[0];
  const location = cardBody.children[1];
  const description = cardBody.children[2];
  const card = cardBody.parentElement;
  const photoUrl = card.children[0];

  // Prompt the user to enter new values.
  const newTitle = window.prompt("Enter new name");
  const newSubtitle = window.prompt("Enter new location");
  const newDescription = window.prompt(
    "Enter new description",
    description ? description.innerText : ""
  );

  const newPhotoUrl = window.prompt("Enter new photo URL", photoUrl.src);

  // If the user provides a new title, update the card.
  if (newTitle.length > 0) {
    title.innerText = newTitle;
  }

  // If the user provides a new location, update the card.
  if (newSubtitle.length > 0) {
    location.innerText = newSubtitle;
  }

  if (newDescription.length > 0) {
    if (description) {
      description.innerText = newDescription;
    } else {
      const newDescriptionElement = document.createElement("p");
      newDescriptionElement.setAttribute("class", "paragraph-description");
      newDescriptionElement.innerText = newDescription;
      cardBody.insertBefore(newDescriptionElement, cardBody.children[2]);
    }
  }

  // If the user provides a new photo URL, update the card image.
  if (newPhotoUrl.length > 0) {
    photoUrl.setAttribute("src", newPhotoUrl);
  }
}

// Function to handle removing a destination card.
function removeDestination(event) {
  // Get the card and remove it from the DOM.
  const cardBody = event.target.parentElement.parentElement;
  const card = cardBody.parentElement;
  card.remove();
}
