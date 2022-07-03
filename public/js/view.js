/* Add Mariner Validation */

const applicationModal = document.getElementById('applicationModal');
// const firstNameInput = document.getElementById('first-name');
// const lastNameInput = document.getElementById('last-name');
// const birthDateInput = document.getElementById('birth-date');
const marinerIDNumb = document.getElementById('marinerIDHidden');
console.log(marinerIDNumb);
let marinerIDNumber = $('#marinerIDHidden').val();
console.log(marinerIDNumber);
const applicationButton = document.getElementById('appModalButton');
const licensesButton = document.getElementById('licenses-button');
const appArea = document.getElementById('appArea');
const downloadAppButton = document.getElementById('download-app-button');
const deleteAppButton = document.getElementById('delete-app-button');
const appModal = new mdb.Modal(applicationModal);

// Places the Mariner ID into the Licenses Button URL
licensesButton.href = `/licenses/${marinerIDNumber}`;

// Formats Phone Number
function formatPhoneNumber(value) {
    // If input is falsy, return the value
    if (!value) return value;

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
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
    )}-${phoneNumber.slice(6, 9)}`;
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
function uploadApp() {
    let processingAgent = document.getElementById('processing-agent').value;
    console.log(marinerIDNumber + '\n' + processingAgent);

    // When 'Upload' is clicked
    $('#target').submit(function (e) {
        e.preventDefault();
        let formData = new FormData(this);
        console.log('THIS:' + this);
        // formData.append('file', e.target.files[0]);
        formData.append('marinerIDNumber', marinerIDNumber);
        console.log('Form-Data' + formData);

        // Make a POST request with the selected file
        $.ajax({
            type: 'POST',
            url: '/appUpload',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (r) {
                console.log('Result: ' + r);
                $('#closeApplicationModal').trigger('click');
            },
            error: function (err) {
                console.log('Error: ' + err[0]);
            },
        });
    });
}

// Downloads Application for a given MarinerID
function downloadApp(id) {
    // Opens a new window to download the application for the requested ID
    // This is because an AJAX call will send the information to the console
    // instead of downloading the file
    window.open('/appDownload?marinerID=' + id);
}

// Deletes an Application for a given MarinerID
function deleteAppConfirm(id) {
    // Open a confirmation window for deleting the application
    let deleteConfirm = confirm(
        'Are you sure you want to delete this application? This cannot be undone.'
    );
    if (deleteConfirm) {
        $.ajax({
            type: 'POST',
            url: '/deleteApp',
            data: { marinerID: id },
            success: function (result) {
                console.log(result);
                $('#closeApplicationModal').trigger('click');
            },
            error: function (error) {
                console.log('Error: ' + error);
            },
        });
    } else {
        console.log('Delete Cancelled!');
    }
}

// Checks to see if an application for the specified MarinerID exists,
function checkIfAppExists() {
    $.ajax({
        type: 'GET',
        url: '/getApp',
        data: { marinerID: marinerIDNumber },
        success: function (result) {
            console.log('result:' + JSON.stringify(result));
            let resultJSON = JSON.parse(JSON.stringify(result));
            if (resultJSON['appExists']) {
                appArea.innerHTML =
                    '<span>' +
                    resultJSON['appFilename'] +
                    "</span> &nbsp; &nbsp; <div class='mt-3'><button class='btn text-white fw-bold' id='download-app-button' onclick='downloadApp(" +
                    marinerIDNumber +
                    ")' class='btn pl-3 text-white fw-bold' style='background-color: var(--green-color);'><i class='bi bi-download'></i>&nbsp;Download</button> &nbsp; &nbsp; <button id='delete-app-button' class='btn btn-danger fw-bold' onclick='deleteAppConfirm(" +
                    marinerIDNumber +
                    ")'><i class='bi bi-trash'></i>&nbsp;Delete</button></div>";
            } else {
                appArea.innerHTML =
                    '<strong><em>No application has been uploaded</em></strong>';
            }
        },
        error: function (err) {
            console.log('error:' + err[0]);
        },
    });
}

/**
 * @function checkAppModal
 * @return {description}
 */
function checkAppModal() {
    // if (firstNameInput.value != '' && lastNameInput != '' && birthDateInput.value != '') {
    console.log(applicationModal);
    applicationModal.addEventListener('show.mdb.modal', () => {
        checkIfAppExists();
    });
    appModal.show();
}

$('#appModalButton').click(function () {
    checkAppModal();
});
