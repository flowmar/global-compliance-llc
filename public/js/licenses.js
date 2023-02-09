/*
 * @Author: flowmar
 * @Date: 2022-07-10 01:55:38
 * @Last Modified by: flowmar
 * @Last Modified time: 2023-01-19 07:04:11
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
    formNumber,
    gcActivityNumber,
    govtActivityNumber,
    selectedFormNumber;

const licenseModal = new mdb.Modal(newLicenseModal);
const attachmentModal = new mdb.Modal(licenseAttachmentModal);
const editGCActivityModal = new mdb.Modal(editGCLicenseActivityModal);
const editGovtActivityModal = new mdb.Modal(editGovtLicenseActivityModal);
const batchModal = new mdb.Modal(batchAddActivitiesModal);

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
    selectedFormNumber = selectedForm[0].dataset.formNumber;
    console.log('selectedFormNumber: ', selectedFormNumber);
    console.log(selectedForm[0].dataset.formNumber);

    // Use the selected form and number to select the fields
    marinerID = $(
        selectedFormID + ' #marinerIDhidden' + selectedFormNumber
    ).val();
    console.log(marinerID);

    licenseID = $(selectedFormID + ' #licenseID' + selectedFormNumber).val();
    console.log('LicenseID: ' + licenseID);

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
    if (typeof licenseID == 'undefined' || licenseID == '') {
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
                console.log(response.data);
                console.log(response.data.insertJSON.insertId);
                alert('License Created!');
                let licenseIDTextField = $('#licenseID' + selectedFormNumber);
                console.log(selectedFormNumber);
                console.log(licenseIDTextField);
                licenseIDTextField.prop('disabled', false);
                console.log('undisabled');
                licenseIDTextField.val(response.data.insertJSON.insertId);
                licenseIDTextField.prop('readonly', true);
                $('#saveButton' + selectedFormNumber).prop('disabled', 'true');
                counter += 1;
                if (counter == numberOfLicenses) location.reload();
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
    let selectedForm = $('.active form');
    let selectedFormID = selectedForm.data('form-number');
    console.log(selectedFormID);
    let licenseID = $('#licenseID' + selectedFormID).val();
    if (
        confirm(
            'WARNING: ' +
                'You are about to completely erase this license and all associated data.\n This includes all license activities and license attachments!\n THIS ACTION CANNOT BE UNDONE!\n Are you sure you wish to delete this license?'
        )
    ) {
        axios
            .delete(
                '/deleteLicense?licenseID=' +
                    licenseID +
                    '&marinerID=' +
                    marinerID
            )
            .then((response) => {
                console.log(JSON.parse(JSON.stringify(response)));
                location.reload();
            })
            .catch((error) => console.log(error.message));
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
    if (gcActivity != '') {
        axios
            .post('/licenses/gcactivities/' + licenseID, {
                activityNote: gcActivity,
                marinerID: marinerID,
            })
            .then((response) => {
                console.log(response);
                alert('Global Compliance Activity Uploaded!');
                // Clear out the text field
                activityBox.val('');
                // Create a new table row on the GCActivity Table
                let gcActivityTable = $('#gcActivityTableBody' + formNumber);
                let newRow = document.createElement('tr');
                newRow.classList = 'notHeader';
                newRow.style.textAlign = 'center';
                newRow.id = response.data.licenseActivitiesJSON.insertId;
                // Create the cells and add them to the table row
                let dateCell = document.createElement('td');
                let date = new Date().toLocaleString();
                dateCell.textContent = date;
                newRow.appendChild(dateCell);
                let noteCell = document.createElement('td');
                noteCell.textContent = gcActivity;
                newRow.appendChild(noteCell);
                // Add the table row to the table
                gcActivityTable.append(newRow);
                changeForm();
            })
            .catch((error) => {
                console.log(error.message);
            });
    } else {
        alert('Please enter a GC Activity');
    }
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
    if (govtActivity != '') {
        axios
            .post('/licenses/govtactivities/' + licenseID, {
                activityNote: govtActivity,
                marinerID: marinerID,
            })
            .then((response) => {
                console.log(response);
                alert('Government Activity Uploaded!');
                // Clear out the text field
                activityBox.val('');
                // Create a new table row on the GCActivity Table
                let govtActivityTable = $(
                    '#govtActivityTableBody' + formNumber
                );
                let newRow = document.createElement('tr');
                newRow.classList = 'notHeader';
                newRow.style.textAlign = 'center';
                newRow.id = response.data.licenseActivitiesJSON.insertId;
                // Create the cells and add them to the table row
                let dateCell = document.createElement('td');
                let date = new Date().toLocaleString();
                dateCell.textContent = date;
                newRow.appendChild(dateCell);
                let noteCell = document.createElement('td');
                noteCell.textContent = govtActivity;
                newRow.appendChild(noteCell);
                // Add the table row to the table
                govtActivityTable.append(newRow);
                changeForm();
            })
            .catch((error) => {
                console.log(error.message);
            });
    } else {
        alert('Please enter a Government Activity');
    }
}

/**
 * It takes the form data, and sends it to the server
 * @param formData - the file that is being uploaded
 */
function saveLicenseAttachment(formData) {
    let formNumber = $('.active form').data('form-number');

    axios
        .post('/licenses/attachments/' + licenseID, {
            licenseAttachmentName: $('#licenseAttachmentName').val(),
            marinerID: marinerID,
            data: formData,
        })
        .then((response) => {
            console.log(response);
            changeForm();
        })
        .catch((e) => console.error(e.message));
}

/**
 * It gets the ID of the selected GC Activity, then deletes it from the database
 */
function confirmAndDeleteGCActivity() {
    // Get the currently selected GC Activity
    let activityText = $(
        '#gcActivityTableBody' + formNumber + ' tr.table-active>td:nth-child(2)'
    ).text();
    // Get the ID number of the selected gc activity
    let activityID = $(
        '#gcActivityTableBody' + formNumber + ' tr.table-active'
    ).attr('id');

    if (
        confirm(
            'Are you sure you want to delete the GC License Activity:\n "' +
                activityText +
                '"?'
        )
    ) {
        axios
            .delete('/licenses/gcactivities/' + activityID)
            .then((response) => {
                alert('Activity Deleted!');
                location.reload();
            })
            .catch((err) => console.error(err.message));
    }
}

/**
 * It gets the ID of the selected row, and then deletes the row from the database
 */
function confirmAndDeleteGovtActivity() {
    // Get the currently selected GC Activity
    let activityText = $(
        '#govtActivityTableBody' +
            formNumber +
            ' tr.table-active>td:nth-child(2)'
    ).text();
    // Get the ID number of the selected gc activity
    let activityID = $(
        '#govtActivityTableBody' + formNumber + ' tr.table-active'
    ).attr('id');

    if (
        confirm(
            'Are you sure you want to delete the Government License Activity:\n "' +
                activityText +
                '"?'
        )
    ) {
        axios
            .delete('/licenses/govtactivities/' + activityID)
            .then((response) => {
                alert('Activity Deleted!');
                location.reload();
            })
            .catch((err) => console.error(err.message));
    }
}

function downloadLicenseAttachment() {
    // Get the ID number of the selected license attachment
    let selectedLicenseAttachmentID = $(
        '#licenseAttachmentTableBody' + formNumber + ' tr.table-active'
    ).attr('id');

    // // Send a GET request to the server to download the attachment
    // axios
    //     .get('/licenses/attachments/download/' + selectedLicenseAttachmentID, {
    //         marinerID: marinerID,
    //     })
    //     .then((response) => {
    //         console.log(response);
    //         window.open();
    //     })
    //     .catch((err) => console.error(err.message));
    window.open(
        '/licenses/attachments/download/' + selectedLicenseAttachmentID
    );
}

function confirmAndDeleteLicenseAttachment() {
    // Get the currently selected License Attachment
    let attachmentName = $(
        '#licenseAttachmentTableBody' +
            formNumber +
            ' tr.table-active>td:nth-child(2)'
    ).text();

    // Get the ID number of the selected license attachment
    let selectedLicenseAttachmentID = $(
        '#licenseAttachmentTableBody' + formNumber + ' tr.table-active'
    ).attr('id');

    if (
        confirm(
            'Are you sure you would like to delete the ' +
                attachmentName +
                ' attachment?\n  This operation cannot be undone. '
        )
    ) {
        axios
            .delete('/licenses/attachments/' + selectedLicenseAttachmentID)
            .then((response) => {
                alert('Attachment ' + attachmentName + ' Deleted!');
                location.reload();
            })
            .catch((err) => console.error(err.message));
    }
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
        console.log(typeDropdown);
        typeDropdown.empty();
        console.log(typeDropdown);
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
        // After Types are filtered, select the one that the license was already assigned to.
        for (let i = 0; i < response.data.length; i++) {
            let suffix = i + 1;
            let fieldName = '#licenseTypesField' + suffix;
            console.log(fieldName);
            $(fieldName).val(selectedLicenseTypes[i]);
        }
    });
}

/**
 * It gets the activities for the currently selected license and displays them in
 * the UI
 */
function changeForm() {
    // Get the form number
    let selection = document.querySelector('div.active form');
    if (selection) {
        formNumber = selection.getAttribute('data-form-number');
        let licenseID = $('#licenseID' + formNumber).val();
        let gcActivity;
        let govtActivity;

        // Empty the licenseType dropdown
        $('#licenseTypesField' + formNumber).empty();
        // Use the form number to get the appropriate license, and country of that license from the licenses array
        let selectedLicense = licensesArray[parseInt(formNumber) - 1];
        let selectedCountry = selectedLicense['CountryID'];
        let selectedCR = selectedLicense['CRNumber'];

        // Fill in the Country dropdown with the correct country
        let countryField = $('#countriesField' + formNumber);
        countryField.val(selectedCountry);

        // Fill in the CR Number field
        let crField = $('#crNumber' + formNumber);
        crField.val(selectedCR);

        // Fill in the Issue Date field
        let issueDateField = $('#issueDate' + formNumber);
        let formattedIssueDate = selectedLicense['IssueDate'].slice(0, 10);
        issueDateField.val(formattedIssueDate);

        // Fill in the Expiry Date field
        let expirationDateField = $('expirationDate' + formNumber);
        console.log(selectedLicense['ExpirationDate']);
        expirationDateField.val(selectedLicense['ExpirationDate']);

        // Create a a new licenseTypeArray that is filtered
        let filteredTypeArray = [];
        licenseTypesArray.filter((type) => {
            if (type['CountryID'] == selectedCountry) {
                filteredTypeArray.push(type);
            }
        });
        // Populate the licenseTypesField using the filteredTypeArray
        for (let filteredType of filteredTypeArray) {
            // Create a new option element
            let option = document.createElement('option');
            option.value = filteredType['LicenseTypeID'];
            option.text = filteredType['Type'];
            $('#licenseTypesField' + formNumber).append(option);
        }
        $('#licenseTypesField' + formNumber).val(
            licensesArray[parseInt(formNumber) - 1]['LicenseTypeID']
        );

        // Open the edit gcActivity modal when the button is clicked
        $('#edit-GC-activity-button' + formNumber).on('click', function (e) {
            // Get the ID number of the selected activity
            gcActivityNumber = $(
                '#gcActivityTableBody' + formNumber + ' tr.table-active'
            ).attr('id');
            // console.log(gcActivityNumber);
            // Get the selected item in the GC activity table
            gcActivity = $(
                '#gcActivityTableBody' +
                    formNumber +
                    ' tr.table-active>td:nth-child(2)'
            ).text();

            // Fill it into the edit GC activity modal box
            $('#editGCActivityModalTextBox').val(gcActivity);
            $('#gcLicenseActivityIDhidden').val(gcActivityNumber);
            editGCActivityModal.show();
        });

        // Open the edit gcActivity modal when the button is clicked
        $('#edit-govt-activity-button' + formNumber).on('click', function (e) {
            // Get the ID number of the selected activity
            govtActivityNumber = $(
                '#govtActivityTableBody' + formNumber + ' tr.table-active'
            ).attr('id');
            // Get the selected item in the Govt Activity table
            govtActivity = $(
                '#govtActivityTableBody' +
                    formNumber +
                    ' tr.table-active>td:nth-child(2)'
            ).text();

            // Fill it into the edit Govt activity modal box
            $('#editGovtActivityModalTextBox').val(govtActivity);
            $('#govtLicenseActivityIDhidden').val(govtActivityNumber);

            editGovtActivityModal.show();
        });

        // Hide the gc, govt and attachment edit and delete buttons
        $('.gc-buttons').hide();
        $('.govt-buttons').hide();
        $('.attachment-buttons').hide();

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

        let licenseAttachmentTableBody = document.getElementById(
            'licenseAttachmentTableBody' + formNumber
        );

        gcActivityTableBody.innerHTML = '';
        govtActivityTableBody.innerHTML = '';
        licenseAttachmentTableBody.innerHTML = '';

        // Get the currently selected license's gc activities to be displayed in the UI
        axios
            .get('/licenses/gcactivities/' + licenseID)
            .then((response) => {
                console.log(response);
                // console.log(response.data.licenseActivitiesJSON);

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
                        $('.gc-buttons').show();
                        // Remove active class from anything previously selected
                        $(
                            '#gcActivityTableBody' + formNumber + ' tr'
                        ).removeClass('table-active');

                        // Add active class to the newly selected row
                        $(this).addClass('table-active');

                        selectedRow = $(this);

                        console.log(selectedRow);
                    });
                }
            })
            .catch((error) => console.log(error.message));

        // Get the currently selected license's govt activities to be displayed in the UI
        axios
            .get('/licenses/govtactivities/' + licenseID)
            .then((response) => {
                console.log(response);
                // console.log(response.data.licenseActivitiesJSON);

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
                        $('.govt-buttons').show();
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

                // When a form is changed, change the license ID in the upload license attachment modal
                $('#modalLicenseIDhidden').val(licenseID);
                $('#modalMarinerIDhidden').val(marinerID);

                // Change the action URL of the upload license attachment modal
                $('#newLicenseAttachmentForm').attr(
                    'action',
                    '/licenses/attachments/' + licenseID
                );

                // When a form is changed, add an event listener to show the license attachment upload modal
                let buttonID = '#license-attachment-button' + formNumber;
                $(buttonID).on('click', function () {
                    attachmentModal.show();
                });
            })
            .catch((error) => console.log(error.message));

        // Get the currently selected license's attachments and display in the UI
        axios
            .get('/licenses/attachments/' + licenseID)
            .then((response) => {
                console.log(response);
                // console.log(response.data);
                // console.log(response.data.licenseJSON);

                // Loop through the response from the server and display the attachments in the UI
                for (licenseAttachment of response.data.licenseJSON) {
                    console.log(licenseAttachment);
                    // Get the date of the attachment
                    let datetime = licenseAttachment['LicenseAttachmentDate'];
                    console.log(datetime);
                    // Format the datetime for display in the table
                    let datetimeString = new Date(datetime).toLocaleString();
                    console.log(datetimeString);
                    // Get the name of the License Attachment
                    let name = licenseAttachment['LicenseAttachmentName'];
                    console.log(name);
                    // Create a table row
                    let tableRow = document.createElement('tr');
                    tableRow.style = 'text-align: center;';

                    // Set the ID of the tableRow to the ID of the License Attachment
                    tableRow.id = licenseAttachment['LicenseAttachmentID'];
                    tableRow.classList = 'notHeader';

                    // Add the cells to the row
                    tableRow.innerHTML =
                        '<td>' + datetimeString + '</td><td>' + name + '</td>';

                    // Add the row to the table
                    console.log(tableRow);
                    licenseAttachmentTableBody.appendChild(tableRow);

                    let tableRowString =
                        '#licenseAttachmentTableBody' +
                        formNumber +
                        ' tr.notHeader';
                    console.log(tableRowString);
                    // Make table rows selectable
                    $(tableRowString).on('click', function (e) {
                        // Show buttons
                        $('.attachment-buttons').show();
                        // Remove active class from anything previously selected
                        $(
                            '#licenseAttachmentTableBody' + formNumber + ' tr'
                        ).removeClass('table-active');

                        // Add active class to the newly selected row
                        $(this).addClass('table-active');

                        selectedRow = $(this);

                        console.log(selectedRow);
                    });
                }
            })
            .catch((err) => console.error(err.message));
    }
}

/**
 * The function confirms the edit of the activity, gets the activity number and
 * edited activity, sends a put request that updates the activity, and then reloads
 * the page.
 */
function confirmAndSaveEditedGCLicenseActivity() {
    // Confirm the edit of the activity
    if (confirm('Save edited Global Compliance License Activity?')) {
        // Get the activity number
        let activityNumber = $('#gcLicenseActivityIDhidden').val();
        // Get the edited activity
        let editedActivity = $('#editGCActivityModalTextBox').val();

        console.log(activityNumber);
        console.log(editedActivity);

        // Send a put request that updates the activity
        axios
            .put('/licenses/gcactivities/' + activityNumber, {
                gcActivityNote: editedActivity,
            })
            .then((response) => {
                console.log(response);
                alert('Activity Updated!');
                $('#closeEditGCModal').trigger('click');
                changeForm();
            })
            .catch((err) => console.error(err.message));
    }
}

/**
 * The function confirms the edit of the activity, gets the activity number and the
 * edited activity, sends a put request that updates the activity, and then reloads
 * the page.
 */
function confirmAndSaveEditedGovtLicenseActivity() {
    // Confirm edit of activity
    if (confirm('Save edited Government License Activity?')) {
        // Get the activity number
        let activityNumber = $('#govtLicenseActivityIDhidden').val();
        // Get the edited activity
        let editedActivity = $('#editGovtActivityModalTextBox').val();

        console.log(activityNumber);
        console.log(editedActivity);
        // Send a put request that updates the activity
        axios
            .put('/licenses/govtactivities/' + activityNumber, {
                govtActivityNote: editedActivity,
            })
            .then((response) => {
                console.log(response);
                alert('Activity Updated!');
                $('#closeEditGovtModal').trigger('click');
                changeForm();
            })
            .catch((err) => console.error(err.message));
    }
}

function batchAddActivities() {
    // Confirm saving of activities
    if (confirm('Add activity to each of the checked licenses?')) {
        // Get all information from form
        let activity = $('#batchActivityTextBox').val();
        let activityType = $('#batchActivityType').val();
        // let marinerID = $('#marinerIDNumber').val();
        let licenseBoxValues = [];
        let selections = $('fieldset input:checked');
        console.log(selections);
        for (let i = 0; i < selections.length; i++) {
            let boxVal = selections[i].value;
            console.log('boxval: ' + boxVal);
            licenseBoxValues.push(boxVal);
        }
        console.log(licenseBoxValues);
        // Add activity to licenses
        axios
            .post('/licenses/batch/add', {
                batchActivity: activity,
                batchActivityType: activityType,
                marinerID: marinerID,
                batchAddBoxes: licenseBoxValues,
            })
            .then((response) => {
                console.log(response);
                $('#closeBatchModal').trigger('click');
                location.reload();
            })
            .catch((err) => console.error(err.message));
    }
}

// function getGCActivities( licenseID, formNumber )
// {
//     // Get the currently selected license's gc activities to be displayed in the UI
//     axios
//         .get('/licenses/gcactivities/' + licenseID)
//         .then((response) => {
//             console.log(response);
//             console.log(response.data.licenseActivitiesJSON);

//             // Display the activities in the GC activities table

//             // Loop through the licenseActivitiesJSON array
//             for (activity of response.data.licenseActivitiesJSON) {
//                 console.log(activity);
//                 // Get the date and time from the database
//                 let datetime = activity['GCActivityTimestamp'];

//                 // Format the date
//                 let datetimeString = new Date(datetime).toLocaleString();
//                 console.log(datetimeString);
//                 // Create a table row
//                 let tableRow = document.createElement('tr');
//                 tableRow.style = 'text-align: center;';

//                 // Set the ID of the tableRow to the ID of the GCActivity
//                 tableRow.id = activity['GCActivityID'];
//                 tableRow.classList = 'notHeader';

//                 // Add the cells to the row
//                 tableRow.innerHTML =
//                     '<td>' +
//                     datetimeString +
//                     '</td><td>' +
//                     activity['GCActivityNote'] +
//                     '</td>';

//                 // Add the row to the table
//                 console.log(tableRow);
//                 gcActivityTableBody.appendChild(tableRow);

//                 let tableRowString =
//                     '#gcActivityTableBody' + formNumber + ' tr';
//                 console.log(tableRowString);
//                 // Make table rows selectable
//                 $('tr.notHeader').on('click', function (e) {
//                     // Show buttons
//                     // Remove active class from anything previously selected
//                     $('#gcActivityTableBody' + formNumber + ' tr').removeClass(
//                         'table-active'
//                     );

//                     // Add active class to the newly selected row
//                     $(this).addClass('table-active');

//                     selectedRow = $(this);

//                     console.log(selectedRow);
//                 });
//             }
//         })
//         .catch((error) => console.log(error.message));
// }
