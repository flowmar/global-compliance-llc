/*
 * @Author: flowmar
 * @Date: 2022-07-10 01:55:38
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-09-12 20:41:08
 */

let licenseID,
    licenseName,
    licenseType,
    licenseCountry,
    issueDate,
    expirationDate,
    gcPending,
    govtPending,
    crNumber,
    formNumber;

const licenseModal = new mdb.Modal(newLicenseModal);

/**
 * The function collects the information from the form that is currently active and
 * stores it in variables
 */
function collectFormInformation() {
    // Get the selected form
    let selectedForm = $('.active form');
    let selectedFormID = '#';
    selectedFormID += $('.active form').attr('id');

    console.log('selectedForm: ', selectedForm);
    // Get the selected form number
    let selectedFormNumber = selectedForm[0].dataset.formNumber;
    console.log('selectedFormNumber: ', selectedFormNumber);
    console.log(selectedForm[0].dataset.formNumber);

    // Use the selected form and number to select the fields
    marinerID = $(
        selectedFormID + ' #marinerIDhidden' + selectedFormNumber
    ).val();
    console.log(marinerID);

    licenseID = $(selectedFormID + ' #licenseID' + selectedFormNumber).val();
    console.log(licenseID);

    licenseType = $(
        selectedFormID + ' #licenseTypesField' + selectedFormNumber
    ).val();
    console.log(licenseType);

    crNumber = $(selectedFormID + ' #crNumber' + selectedFormNumber).val();
    console.log(crNumber);

    licenseCountry = $(
        selectedFormID + ' #countriesField' + selectedFormNumber
    ).val();
    console.log(licenseCountry);

    issueDate = $(selectedFormID + ' #issueDate' + selectedFormNumber).val();
    console.log(issueDate);

    expirationDate = $(
        selectedFormID + ' #expirationDate' + selectedFormNumber
    ).val();
    console.log(expirationDate);

    gcPending = $(selectedFormID + ' #gcPending' + selectedFormNumber).is(
        ':checked'
    );
    gcPending = gcPending ? 1 : 0;
    console.log(gcPending);

    govtPending = $(selectedFormID + ' #govtPending' + selectedFormNumber).is(
        ':checked'
    );
    govtPending = govtPending ? 1 : 0;
    console.log(govtPending);

    licenseName = $(
        selectedFormID + ' #licenseName' + selectedFormNumber
    ).val();
}

/**
 * The function `saveLicenseInformation()` is called when the user clicks the
 * "Save" button on the form. The function collects the information from the form,
 * and then sends a POST request to the server with the information
 */
function saveLicenseInformation() {
    collectFormInformation();
    // If there is no license ID, then it is a new license, so make a POST request
    if (licenseID === '') {
        // Post request with the form information
        axios
            .post('/licenses/' + marinerID, {
                licenseID: licenseID,
                licenseName: licenseName,
                licenseType: licenseType,
                licenseCountry: licenseCountry,
                issueDate: issueDate,
                expirationDate: expirationDate,
                gcPending: gcPending,
                govtPending: govtPending,
                crNumber: crNumber,
            })
            .then((response) => {
                console.log(response);
                alert('License Created!');
            })
            .catch((error) => console.log(error));
    }
    // If there IS a license ID, then it is modifying a license, so make a PUT request
    else {
        editLicenseInformation();
    }
}

/**
 * It collects the form information, then sends a PUT request to the server with
 * the updated information
 */
function editLicenseInformation() {
    collectFormInformation();

    axios
        .put('/licenses/' + marinerID, {
            licenseID: licenseID,
            licenseName: licenseName,
            licenseType: licenseType,
            licenseCountry: licenseCountry,
            issueDate: issueDate,
            expirationDate: expirationDate,
            gcPending: gcPending,
            govtPending: govtPending,
            crNumber: crNumber,
        })
        .then((response) => {
            console.log(response);
            alert('License Updated!');
            location.reload();
        })
        .catch((error) => console.log(error));
}

/**
 * The function checks to see if the checkboxes are checked, and if they are, it
 * sets the variable to 1, otherwise it sets it to 0. Then it sends a POST request
 * to the server with the data from the form
 */
function saveNewLicense() {
    // Check to see if the boxes are checked
    gcPending = $('#newLicenseGCPending').is(':checked');
    gcPending ? 1 : 0;
    govtPending = $('#newLicenseGovtPending').is(':checked');
    govtPending ? 1 : 0;

    axios
        .post('/licenses/' + marinerID, {
            licenseID: '',
            licenseName: $('#newLicenseName').val(),
            licenseType: $('#newLicenseType').val(),
            licenseCountry: $('#newLicenseCountry').val(),
            issueDate: $('#newLicenseIssueDate').val(),
            expirationDate: $('#newLicenseExpirationDate').val(),
            gcPending: gcPending,
            govtPending: govtPending,
            crNumber: $('#newLicenseCRNumber').val(),
        })
        .then((response) => {
            console.log(response);
            alert('License Added!');
            location.reload();
        })
        .catch((error) => console.log(error));
}

/**
 * It clones the first tab pane, inserts it after the last tab pane, and changes
 * the IDs of the buttons in the new tab pane
 */
function addNewLicenseForm() {
    // // Select the license form
    // let licenseForm = $('#licenseForm');
    // // Create a clone
    // let formClone = licenseForm.clone(true, true);
    // // Add a new entry to the tab list by cloning the last one
    // let tabButtonClone = $('#licensesTabList li:last').prev().clone(false);
    // // Insert it into the UI
    // tabButtonClone.insertBefore($('#licensesTabList li:last'));
    // // Change the attributes of the new button
    // let newSuffix = $('#licensesTabList li').length - 2;
    // let buttonContents = tabButtonClone.contents();
    // let id = buttonContents.attr('id').slice(0, -1);
    // id += newSuffix;
    // // console.log(id);
    // let ariaControls = buttonContents.attr('aria-controls').slice(0, -1);
    // ariaControls += newSuffix;
    // let buttonHref = buttonContents.attr('href').slice(0, -1);
    // buttonHref += newSuffix;
    // // console.log(ariaControls);
    // // console.log(buttonHref);
    // buttonContents.empty();
    // buttonContents.attr({
    //     id: id,
    //     'aria-controls': ariaControls,
    //     href: buttonHref,
    // });
    // // Select the first tab pane
    // // let paneContent = $('#license-tabs-0');
    // // let node = $('#tab-content').children().last();
    // // paneContent.insertAfter(node);
    // let contentClone = $('#tab-content').children().first().next().clone();
    // console.log(contentClone);
    // let node = $('#tab-content').children().last();
    // console.log(node);
    // contentClone.insertAfter(node);
    // let contentID = contentClone.attr('id').slice(0, -1);
    // contentID += newSuffix;
    // contentClone.attr('id', contentID);
    // console.log(contentClone.find($('button')));
    // contentClone.find($('button'))[0].id = 'saveButton1';
    // contentClone.find($('button'))[1].id = 'editButton1';
    // contentClone.find($('button'))[2].id = 'deleteButton1';
    // // $('#saveButton1').style.display = 'block !important;';
    // // $('#editButton1').style.display = 'none !important;';
    // // $('#deleteButton1').style.display = 'none !important;';
    // // Hide the add license button
    // // $('#addLicense').remove();
    // Open the New License Modal
}

/**
 * It deletes the license of the mariner whose ID is stored in the variable
 * marinerID
 */
function deleteLicense() {
    if (
        confirm(
            'WARNING: ' +
                'Are you sure you want to delete this license? This action cannot be undone!'
        )
    ) {
        axios
            .delete('/deleteLicense?marinerID=' + marinerID)
            .then((response) => {
                console.log(JSON.parse(JSON.stringify(response)));
                location.reload();
            })
            .catch((error) => console.loge(error));
    }
}

/**
 * It takes the value of the textarea in the GCActivity box and sends it to the
 * server
 */
function saveGCActivity() {
    // Collect information from the GCActivity box and submit it to the server
    let formNumber = $('.active form').data('form-number');
    let activityBox = $('#gcActivityBox' + formNumber);
    let gcActivity = activityBox.val();
    let licenseID = $('#licenseID' + formNumber).val();
    console.log('AGG');
    console.log(gcActivity);
    console.log(licenseID);

    axios
        .post('/licenses/gcactivities/' + licenseID, {
            activityNote: gcActivity,
            marinerID: marinerID,
        })
        .then((response) => {
            console.log(response);
            alert('Global Compliance Activity Uploaded!');
            location.reload();
        })
        .catch((error) => {
            console.log(error.message);
        });
}

/**
 * It takes the text from the textarea, and sends it to the server
 */
function saveGovtActivity() {
    // Collect information from the GCActivity box and submit it to the server
    let formNumber = $('.active form').data('form-number');
    let activityBox = $('#govtActivityBox' + formNumber);
    let govtActivity = activityBox.val();
    let licenseID = $('#licenseID' + formNumber).val();
    console.log('AGG');
    console.log(govtActivity);
    console.log(licenseID);

    axios
        .post('/licenses/govtactivities/' + licenseID, {
            activityNote: govtActivity,
            marinerID: marinerID,
        })
        .then((response) => {
            console.log(response);
            alert('Government Activity Uploaded!');
            location.reload();
        })
        .catch((error) => {
            console.log(error.message);
        });
}

/**
 * When the user selects a country, send a request to the server to retrieve the
 * license types for that country, then populate the license type dropdown with the
 * results
 * @param value - The value of the selected option
 * @param text - The text of the selected option
 * @param typeDropdown - The dropdown element that will be populated with the
 * license types
 */
function filterTypes(value, text, typeDropdown) {
    console.log(value, text);
    // Send request to retrieve matching license types
    axios.get('/licenseTypes/' + text).then((response) => {
        // Clear out any previous data
        typeDropdown.empty();
        let blankElement = document.createElement('option');
        blankElement.textContent = '';
        blankElement.value = 0;
        typeDropdown.append(blankElement);

        // Loop through the response from the serve, attaching the license type options for the selected country
        for (let type of response.data) {
            let element = document.createElement('option');
            element.value = type.LicenseTypeID;
            element.textContent = type.Type;
            typeDropdown.append(element);
        }
    });
}

function uploadLicenseAttachment() {
    axios.post('//');
}

/**
 * It gets the activities for the currently selected license and displays them in
 * the UI
 */
function changeForm() {
    // Get the form number
    formNumber = document
        .querySelector('div.active form')
        .getAttribute('data-form-number');

    let licenseID = $('#licenseID' + formNumber).val();

    // Get the activity TextField for the selected form
    let gcActivityTextField = document.getElementById(
        'gcActivityBox' + formNumber
    );

    // Total characters in the TextField
    let gcTotalCharacters = gcActivityTextField.value.length;

    // Get the message span
    let gcCharacterCountMessage = document.getElementById(
        'gcCharacterCountMessage' + formNumber
    );

    // Listen for key presses on the GCActivity TextField
    gcActivityTextField.addEventListener('keyup', function () {
        gcTotalCharacters = gcActivityTextField.value.length;
        if (gcTotalCharacters < 225) {
            gcCharacterCountMessage.style = 'color: white;';
        } else if (gcTotalCharacters > 225) {
            gcCharacterCountMessage.style = 'color: var(--red-color);';
        } else if (gcTotalCharacters === 255) {
            gcCharacterCountMessage.style = 'color: red;';
        }
        let gcCharactersRemaining = 255 - gcTotalCharacters;
        gcCharacterCountMessage.textContent =
            'Characters remaining: ' + gcCharactersRemaining;
    });

    // Get the government activity TextField
    let govtActivityTextField = document.getElementById(
        'govtActivityBox' + formNumber
    );

    // The total characters in the government activity TextField
    let govtTotalCharacters = govtActivityTextField.value.length;

    // Get the government character count message span
    let govtCharacterCountMessage = document.getElementById(
        'govtCharacterCountMessage' + formNumber
    );

    // Listen for key presses on the notes text field
    govtActivityTextField.addEventListener('keyup', function () {
        govtTotalCharacters = govtActivityTextField.value.length;
        if (govtTotalCharacters < 225) {
            govtCharacterCountMessage.style = 'color: white;';
        }
        if (govtTotalCharacters > 225) {
            govtCharacterCountMessage.style = 'color: var(--red-color);';
        }
        if (govtTotalCharacters === 255) {
            govtCharacterCountMessage.style = 'color: red;';
        }
        let govtCharactersRemaining = 255 - govtTotalCharacters;
        govtCharacterCountMessage.textContent =
            'Characters remaining: ' + govtCharactersRemaining;
    });

    // Clear out the tables
    let gcActivityTableBody = document.getElementById(
        'gcActivityTableBody' + formNumber
    );

    let govtActivityTableBody = document.getElementById(
        'govtActivityTableBody' + formNumber
    );

    gcActivityTableBody.innerHTML = '';
    govtActivityTableBody.innerHTML = '';

    // Get the currently selected license's gc activities to be displayed in the UI
    axios
        .get('/licenses/gcactivities/' + licenseID)
        .then((response) => {
            console.log(response);
            console.log(response.data.licenseActivitiesJSON);

            // Display the activities in the GC activities table

            // Loop through the licenseActivitiesJSON array
            for (activity of response.data.licenseActivitiesJSON) {
                console.log(activity);
                // Get the date and time from the database
                let datetime = activity['GCActivityTimestamp'];

                // Format the date
                let datetimeString = new Date(datetime).toLocaleString();
                console.log(datetimeString);
                // Create a table row
                let tableRow = document.createElement('tr');
                tableRow.style = 'text-align: center;';

                // Set the ID of the tableRow to the ID of the GCActivity
                tableRow.id = activity['GCActivityID'];
                tableRow.classList = 'notHeader';

                // Add the cells to the row
                tableRow.innerHTML =
                    '<td>' +
                    datetimeString +
                    '</td><td>' +
                    activity['GCActivityNote'] +
                    '</td>';

                // Add the row to the table
                console.log(tableRow);
                gcActivityTableBody.appendChild(tableRow);

                let tableRowString =
                    '#gcActivityTableBody' + formNumber + ' tr';
                console.log(tableRowString);
                // Make table rows selectable
                $('tr.notHeader').on('click', function (e) {
                    // Show buttons
                    // Remove active class from anything previously selected
                    $('#gcActivityTableBody' + formNumber + ' tr').removeClass(
                        'table-active'
                    );

                    // Add active class to the newly selected row
                    $(this).addClass('table-active');

                    selectedRow = $(this);

                    console.log(selectedRow);
                });
            }
        })
        .catch((error) => console.log(error.message));

    // Get the currently selected license's govt activities to be displayed in the UI
    // Get the currently selected license's gc and govt activities to be displayed in the UI
    axios
        .get('/licenses/govtactivities/' + licenseID)
        .then((response) => {
            console.log(response);
            console.log(response.data.licenseActivitiesJSON);

            // Display the activities in the Govt activities table

            // Loop through the licenseActivitiesJSON array
            for (activity of response.data.licenseActivitiesJSON) {
                console.log(activity);
                // Get the date and time from the database
                let datetime = activity['GovtActivityTimestamp'];

                // Format the date
                let datetimeString = new Date(datetime).toLocaleString();
                console.log(datetimeString);
                // Create a table row
                let tableRow = document.createElement('tr');
                tableRow.style = 'text-align: center;';

                // Set the ID of the tableRow to the ID of the GovtActivity
                tableRow.id = activity['GovtActivityID'];
                tableRow.classList = 'notHeader';

                // Add the cells to the row
                tableRow.innerHTML =
                    '<td>' +
                    datetimeString +
                    '</td><td>' +
                    activity['GovtActivityNote'] +
                    '</td>';

                // Add the row to the table
                console.log(tableRow);
                govtActivityTableBody.appendChild(tableRow);

                let tableRowString =
                    '#govtActivityTableBody' + formNumber + ' tr.notHeader';
                console.log(tableRowString);
                // Make table rows selectable
                $(tableRowString).on('click', function (e) {
                    // Show buttons
                    // Remove active class from anything previously selected
                    $(
                        '#govtActivityTableBody' + formNumber + ' tr'
                    ).removeClass('table-active');

                    // Add active class to the newly selected row
                    $(this).addClass('table-active');

                    selectedRow = $(this);

                    console.log(selectedRow);
                });
            }
        })
        .catch((error) => console.log(error.message));
}

$(document).ready(function () {
    // Open the new license modal when the add new license button is clicked
    $('#addLicense').on('click', function (e) {
        licenseModal.show();
    });

    // Prevent the form from being submitted, instead run the saveNewLicense function
    $('#newLicenseForm')
        .parsley()
        .on('form:submit', function (e) {
            return false;
        })
        .on('form:success', function (e) {
            saveNewLicense();
        });

    // When a .nav-link is clicked, and becomes active, get the active form number
    $('#licensesTabList .nav-item').on('click', '.nav-link', function (e) {
        // Added a setTimeout function to allow enough time for the form number to be changed
        setTimeout(changeForm, 100);
    });
});
