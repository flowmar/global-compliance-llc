/*
 * @Author: flowmar
 * @Date: 2022-07-10 01:55:38
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-12 03:29:41
 */

let licenseID,
    licenseName,
    licenseType,
    licenseCountry,
    issueDate,
    expirationDate,
    gcPending,
    govtPending;

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
        })
        .then((response) => {
            console.log(response);
            alert('License Created!');
        })
        .catch((error) => console.log(error));
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
        })
        .then((response) => {
            console.log(response);
            alert('License Updated!');
            location.reload();
        })
        .catch((error) => console.log(error));
}

function addNewLicenseForm() {
    // Select the license form
    let licenseForm = $('#licenseForm');

    // Create a clone
    let formClone = licenseForm.clone(true, true);

    // Add a new entry to the tab list by cloning the last one
    let tabButtonClone = $('#licensesTabList li:last').prev().clone(false);

    // Insert it into the UI
    tabButtonClone.insertBefore($('#licensesTabList li:last'));

    // Change the attributes of the new button
    let newSuffix = $('#licensesTabList li').length - 2;

    let buttonContents = tabButtonClone.contents();
    let id = buttonContents.attr('id').slice(0, -1);
    id += newSuffix;
    // console.log(id);
    let ariaControls = buttonContents.attr('aria-controls').slice(0, -1);
    ariaControls += newSuffix;
    let buttonHref = buttonContents.attr('href').slice(0, -1);
    buttonHref += newSuffix;
    // console.log(ariaControls);
    // console.log(buttonHref);
    buttonContents.empty();
    buttonContents.attr({
        id: id,
        'aria-controls': ariaControls,
        href: buttonHref,
    });

    // Select the first tab pane
    // let paneContent = $('#license-tabs-0');
    // let node = $('#tab-content').children().last();
    // paneContent.insertAfter(node);

    let contentClone = $('#tab-content').children().first().next().clone();
    console.log(contentClone);
    let node = $('#tab-content').children().last();
    console.log(node);
    contentClone.insertAfter(node);

    let contentID = contentClone.attr('id').slice(0, -1);

    contentID += newSuffix;

    contentClone.attr('id', contentID);

    console.log(contentClone.find($('button')));
    contentClone.find($('button'))[0].id = 'saveButton1';
    contentClone.find($('button'))[1].id = 'editButton1';
    contentClone.find($('button'))[2].id = 'deleteButton1';

    $('#saveButton1').style.display = 'block !important;';
    $('#editButton1').style.display = 'none !important;';
    $('#deleteButton1').style.display = 'none !important;';
}

// function saveGCActivity() {}

// function saveGovtActivity() {}
