/*
 * @Author: flowmar
 * @Date: 2022-07-03 07:45:53
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-05 01:35:12
 */

const marinerID = document.getElementById('marinerIDHidden').value;

const appModal = new mdb.Modal(applicationModal);

$(document).ready(() => {
    /* Add Mariner Validation */
    const applicationModal = document.getElementById('applicationModal');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const birthDateInput = document.getElementById('birth-date');
    const applicationButton = document.getElementById('appModalButton');
    let licensesButton = $('#licenses-button');
    const newLicenseURL = '/licenses/' + marinerID;
    licensesButton.attr('href', '/licenses/' + marinerID);
    console.log(licensesButton);
    const appArea = document.getElementById('appArea');
    const downloadAppButton = document.getElementById('download-app-button');
    const deleteAppButton = document.getElementById('delete-app-button');
    // Places the Mariner ID into the Licenses Button URL
});
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

/**
 * It gets the input field, formats the input, and sets the value to the formatted
 * input
 */
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
                console.log('Result: ' + JSON.parse(JSON.stringify(r)));
                $('#closeApplicationModal').trigger('click');
                location.reload();
            },
            error: function (err) {
                console.log('Error: ' + err.message);
            },
        });
    });
}

function refreshAppId(marinerIDNumber) {
    $.ajax({
        type: 'GET',
        url: '/getApp',
        data: { marinerID: marinerID },
        success: function (result) {
            let resultJSON = JSON.parse(JSON.stringify(result));
            console.log(resultJSON);
            if (resultJSON['appExists']) {
                $('application-id').attr('value', resultJSON['appId']);
                console.log('Success');
            }
        },
        error: function (err) {
            console.log('error:' + err.message);
        },
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
                $('#application-id').attr('value', '');
                $('#application-id').val('');
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
                $('#target').remove();
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
    console.log(applicationModal);
    applicationModal.addEventListener('show.mdb.modal', () => {
        checkIfAppExists();
    });
    appModal.show();
}

$('#appModalButton').click(function () {
    checkAppModal();
});
