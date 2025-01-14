/*
 * @Author: flowmar
 * @Date: 2022-07-03 07:45:53
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-11-02 11:34:21
 */

// const errors = require('bluebird/js/release/errors');

const marinerID = document.getElementById('marinerIDHidden').value || next;
const appModal = new mdb.Modal(applicationModal);
const editModal = new mdb.Modal(editActivityModal);

// Formats Phone Number
/**
 * If the input is falsy, return the value. If the input is less than 4 characters,
 * return the value. If the input is less than 7 characters, return the value with
 * formatting. If the input is greater than 7 characters, return the value with
 * formatting
 * @param value - The value of the input
 * @returns A formatted phone number
 */
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

/**
 * When the user types in the input field, format the input value and set the value
 * to the formatted input.
 */
function phoneNumberFormatter() {
    // Get input field
    const inputField = document.getElementById('phone-number');
    // Format input
    const formattedInputValue = formatPhoneNumber(inputField.value);
    // Set value to formatted input
    inputField.value = formattedInputValue;
}

// Home Phone Number formatter

function homePhoneNumberFormatter() {
    // Get input field
    const inputField = document.getElementById('home-phone');
    // Format input
    const formattedInputValue = formatPhoneNumber(inputField.value);
    // Set value to formatted input
    inputField.value = formattedInputValue;
}

/**
 * When the user clicks the 'Upload' button, the file is sent to the server and the
 * modal is closed
 */
function uploadApp() {
    let processingAgent = document.getElementById('processing-agent').value;
    console.log(marinerID + '\n' + processingAgent);

    // When 'Upload' is clicked
    $('#target').submit(function (e) {
        e.preventDefault();
        let formData = new FormData(this);
        console.log('THIS:' + this);
        // formData.append('file', e.target.files[0]);
        formData.append('marinerIDNumber', marinerID);
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
                let rJSON = JSON.parse(JSON.stringify(r));
                console.log(rJSON);
                $('#closeApplicationModal').trigger('click');
                $('#application-id').val(rJSON['appID']);
                alert('Application Uploaded!');
            },
            error: function (err) {
                console.log('Error: ' + err.message);
            },
        });
    });
}

/**
 * It opens a new window to download the application for the requested ID
 *
 * @param id The MarinerID of the application to download
 */
// Downloads Application for a given MarinerID
function downloadApp(id) {
    // Opens a new window to download the application for the requested ID
    // This is because an AJAX call will send the information to the console
    // instead of downloading the file
    window.open('/appDownload?marinerID=' + id);
}

/**
 * When the user clicks the delete button, a confirmation window pops up asking if
 * they're sure they want to delete the application. If they click "OK", the
 * application is deleted from the database
 *
 * @param id The MarinerID of the application to be deleted
 */
// Deletes an Application for a given MarinerID
function deleteAppConfirm(id) {
    // Open a confirmation window for deleting the application
    let deleteConfirm = confirm(
        'Are you sure you want to delete this application? This cannot be undone.'
    );
    if (deleteConfirm) {
        $.ajax({
            type: 'DELETE',
            url: '/application',
            data: { marinerID: id },
            success: function (result) {
                console.log(result);
                $('#closeApplicationModal').trigger('click');
                $('#application-id').attr('value', '');
                $('#application-id').val('');
                alert('Application Deleted!');
            },
            error: function (error) {
                console.log('Error: ' + error);
            },
        });
    } else {
        console.log('Delete Cancelled!');
    }
}

/**
 * It checks if the mariner has an application uploaded. If he does, it displays
 * the filename and two buttons: Download and Delete. If he doesn't, it displays a
 * message saying that no application has been uploaded
 */
function checkIfAppExists() {
    $.ajax({
        type: 'GET',
        url: '/getApp',
        data: { marinerID: marinerID },
        success: function (result) {
            let resultJSON = JSON.parse(JSON.stringify(result));
            console.log(resultJSON);
            // If an application exists...
            if (resultJSON['appExists']) {
                // Hide the Upload Form
                $('#target').attr('style', 'display: none !important');
                // Show the Download/Delete Area
                appArea.innerHTML =
                    '<span>' +
                    resultJSON['appFilename'] +
                    "</span> &nbsp; &nbsp; <div class='mt-3'><button class='btn text-white fw-bold' id='download-app-button' onclick='downloadApp(" +
                    marinerID +
                    ")' class='btn pl-3 text-white fw-bold' style='background-color: var(--green-color);'><i class='bi bi-download'></i>&nbsp;Download</button> &nbsp; &nbsp; <button id='delete-app-button' class='btn btn-danger fw-bold' onclick='deleteAppConfirm(" +
                    marinerID +
                    ")'><i class='bi bi-trash'></i>&nbsp;Delete</button></div>";
            } else {
                $('#target').attr('style', 'display: block !important');
                // Otherwise display a message
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
 * The function checks if the application modal is open, and if it is, it checks if
 * the application exists
 */
function checkAppModal() {
    console.log('Checking app modal');
    console.log(applicationModal);
    appModal.show();
}

/**
 * If the user confirms the request to save the edited Mariner information, then
 * submit the form
 */
// Confirmation/request for saving edited Mariner
function confirmAndSaveMariner() {
    if (confirm('Save edited Mariner information?')) {
        document.getElementById('editMarinerForm').submit();
    } else {
        console.log('canceled!');
    }
}

/**
 * It takes the values of the input fields and sends them to the server
 */
function saveMarinerActivity() {
    let noteLength = $('#notes').val().length;
    if (noteLength == 0 || noteLength > 255) {
        alert('A Note must be less than 255 characters long.');
    } else {
        axios
            .post('/activity', {
                marinerIDActivity: $('#marinerActivityID').val(),
                activityProcessingAgent: $('#activityProcessingAgent').val(),
                activity: $('#notes').val(),
            })
            .then((response) => {
                console.log(response);
                location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

/**
 * When the user selects a rig type, send a request to the server to retrieve all
 * rigs of that type, then populate the rig select element with the results
 * @param selection - The value of the selected option in the dropdown
 */
function filterRigs(selection) {
    console.log(selection);
    // Send request to retrieve matching rigs
    axios
        .get('/rigs/' + selection)
        .then((response) => {
            // Select the dropdown
            let rigSelect = $('#vessel-name');
            // Clear out any previous data
            rigSelect.empty();
            let blankElement = document.createElement('option');
            blankElement.textContent = '';
            blankElement.value = 0;
            rigSelect.append(blankElement);
            // Loop through the response from the server, attaching rig options
            for (let rig of response.data) {
                let element = document.createElement('option');
                element.value = rig.RigID;
                element.textContent = rig.RigName;
                rigSelect.append(element);
            }
            // After Rigs are filtered, select the one that the Mariner was already assigned to.
            $('#vessel-name').val(marinerObject['RigID']);
            console.log(marinerObject['RigID']);
        })
        .catch((err) => {
            throw err;
        });
}

/**
 * It sends a request to the server to download a PDF file
 */
function downloadMarinerPDF() {
    // let url = '/info/' + marinerID;

    // Send a request to the server
    // axios
    //     .get(url)
    //     .then((response) => {
    //         console.log(response);
    //     })
    //     .catch((err) => console.log(err));
    window.open('/info?marinerID=' + `${marinerID}`);
}

$(document).ready(() => {
    /* Add Mariner Validation */
    const applicationModal = document.getElementById('applicationModal');
    const editActivityModal = document.getElementById('editActivityModal');
    // const firstNameInput = document.getElementById('first-name');
    // const lastNameInput = document.getElementById('last-name');
    // const birthDateInput = document.getElementById('birth-date');
    // const applicationButton = document.getElementById('appModalButton');

    // Put the MarinerID in the license button URL
    let licensesButton = $('#licenses-button');
    const newLicenseURL = '/licenses/' + marinerID;
    licensesButton.attr('href', '/licenses/' + marinerID);
    console.log(licensesButton);

    const appArea = document.getElementById('appArea');
    const downloadAppButton = document.getElementById('download-app-button');
    const deleteAppButton = document.getElementById('delete-app-button');

    $('#buttonDiv').on('click', '#appModalButton', function (e) {
        e.preventDefault();
        checkAppModal();
    });

    applicationModal.addEventListener('show.mdb.modal', () => {
        checkIfAppExists();
    });

    $('#save-edited-mariner').on('click', (e) => {
        e.preventDefault();
        confirmAndSaveMariner();
    });

    // editActivityModal.addEventListener('show.mdb.modal', () => {}
    // Show the edit mariner activity modal when the edit button is clicked
    $('#edit-mariner-activity-button').on('click', () => {
        editModal.show();
    });

    // $(document).on('submit', '#activityForm', () => {
    //     return false;
    // });
    // Prevent the default action of the save activity button
    $('#save-mariner-activity-button').on('click', (e) => {
        e.preventDefault();
    });

    // When the input to the employer field changes, update the rigs dropdown
    $('#employer').on('input', function (e) {
        if (e.target.value == '') {
            $('#vessel-name').empty();
        } else {
            filterRigs(e.target.value);
        }
    });

    if ($('#employer').val() != '') {
        filterRigs($('#employer').val());
    }
    // if ($('#employer').val() == '') {
    //     $('#vessel-name').empty();
    // }
});
