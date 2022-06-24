/* Add Mariner Validation */

const applicationModal = document.getElementById('applicationModal');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const birthDateInput = document.getElementById('birth-date');

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

function checkAppModal() {
  if (firstNameInput.value != '' && lastNameInput != '' && birthDateInput.value != '') {
    console.log(applicationModal);
    const appModal = new mdb.Modal(applicationModal);
    appModal.show();
  }
  else {
    alert('Please ensure that the First Name, Last Name and Date of Birth fields are filled out.');
  }
}

function uploadApp(){
        let marinerID = document.getElementById("mariner-id").value;
        let processingAgent = document.getElementById("processing-agent").value;
        console.log(marinerID + "\n" + processingAgent);

  $("#target").submit(function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    console.log("THIS:" + this);
    // formData.append('file', e.target.files[0]);
    formData.append('marinerIDNumber', marinerID);
    console.log("Form-Data" + formData)


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

// let marinerID = document.getElementById("mariner-id").value;

// applicationModal.addEventListener('shown.mdb.modal', (e) => {
//   $.ajax({
//     type: "GET",
//     url: "/getApp",
//     data:
//   })
// });