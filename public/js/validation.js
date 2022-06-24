/* Add Mariner Validation */

const applicationModal = document.getElementById('applicationModal');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const birthDateInput = document.getElementById('birth-date');
const marinerID = document.getElementById("mariner-id").value;
const applicationButton = document.getElementById('appModalButton');
const licensesButton = document.getElementById('licenses-button');
const appArea = document.getElementById('appArea');
console.log(appArea);



// Places the Mariner ID into the Licenses Button URL
licensesButton.href = `/licenses/${marinerID}`;


window.addEventListener('DOMContentLoaded', (e) => {
  $.ajax({
    type: "GET",
    url: `/getApp`,
    data: {"marinerID": marinerID},
    success: function (result) {
      console.log("result:" + result);
    },
    error: function (err) {
      console.log("error:" + err[0]);
    }
  })
});

// Formats Phone Number
function formatPhoneNumber(value) {
  // If input is falsy, return the value
  if (!value) return value

  // Clear input for non-digits
  let phoneNumber = value.replace(/[^\d]/g, '');

  // Length of phone number
  let phoneNumberLength = phoneNumber.length;

  // Return value with no formatting if area code is not finished
  if (phoneNumberLength < 4) return phoneNumber;

  // If past area code, return with formatting
  if (phoneNumberLength < 7) { 
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  // If length is greater than 7, format and return
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 9)}`;
}
 
// Phone number formatter
function phoneNumberFormatter() {
  // Get input field
  const inputField = document.getElementById('phone-number');
  // Format input
  const formattedInputValue = formatPhoneNumber(inputField.value);
  // Set value to formatted input
  inputField.value = formattedInputValue;
}

/**
 * Checks to see if
 * First Name, Last Name and Date of Birth
 * are filled out before allowing the App Modal to open
 */

// Uploads the application document to the database
function uploadApp(){
        let processingAgent = document.getElementById("processing-agent").value;
        console.log(marinerID + "\n" + processingAgent);

  // When 'Upload' is clicked
  $("#target").submit(function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    console.log("THIS:" + this);
    // formData.append('file', e.target.files[0]);
    formData.append('marinerIDNumber', marinerID);
    console.log("Form-Data" + formData)

    // Make a POST request with the selected file
    $.ajax({
      type: "POST",
      url: "/appUpload",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      success: function (r) {
        console.log("Result: " + r);
      },
      error: function (err) {
        console.log("Error: " + err[0]);
      }
    });
  });
}

// Checks to see if an application for the specified MarinerID exists,
function checkIfAppExists() {
  $.ajax({
    type: "GET",
    url: "/getApp",
    data: { "marinerID": marinerID },
    success: function (result) {
      console.log("result:" + JSON.stringify(result));
      let resultJSON = JSON.parse(JSON.stringify(result));
      appArea.innerHTML = resultJSON["appFilename"];
    },
    error: function (err) {
      console.log("error:" + err[0]);
    }
  });
}

function checkAppModal() {
  // if (firstNameInput.value != '' && lastNameInput != '' && birthDateInput.value != '') {
  if (1 === 1) {
      console.log("HEYYYO");
      console.log(applicationModal);
      const appModal = new mdb.Modal(applicationModal);
    applicationModal.addEventListener('show.mdb.modal', (e) => {
      console.log("AADFAD"); 
      checkIfAppExists();
      });
      appModal.show();
  }
  else {
    alert('Please ensure that the First Name, Last Name and Date of Birth fields are filled out.');
  }
}

$('#appModalButton').click(function () {
  console.log("AGADFa");
  checkAppModal();
});


// Display the file name in the UI, along with buttons for
// downloading or deleting the application file
function displayApplicationAndControls() { }


// Deletes the application for the selected MarinerID
// Pop-up window that confirms delete before continuing
function deleteApplicationForMarinerID(marinerID) { }

// Download the previously uploaded application file for the specified MarinerID
function downloadApplicationForMarinerID(marinerID) { }