/*
 * @Author: flowmar
 * @Date: 2022-07-10 01:55:38
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-10 23:52:26
 */

function saveLicenseInformation() {
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
    let marinerID = $(
        selectedFormID + ' #marinerIDhidden' + selectedFormNumber
    ).val();
    console.log(marinerID);

    let licenseID = $(
        selectedFormID + ' #licenseIDhidden' + selectedFormNumber
    ).val();
    console.log(licenseID);

    let licenseType = $(
        selectedFormID + ' #licenseTypesField' + selectedFormNumber
    ).val();
    console.log(licenseType);

    let licenseCountry = $(
        selectedFormID + ' #countriesField' + selectedFormNumber
    ).val();
    console.log(licenseCountry);

    let issueDate = $(
        selectedFormID + ' #issueDate' + selectedFormNumber
    ).val();
    console.log(issueDate);

    let expirationDate = $(
        selectedFormID + ' #expirationDate' + selectedFormNumber
    ).val();
    console.log(expirationDate);

    let gcPending = $(selectedFormID + ' #gcPending' + selectedFormNumber).is(
        ':checked'
    );
    gcPending = gcPending ? 1 : 0;
    console.log(gcPending);

    let govtPending = $(
        selectedFormID + ' #govtPending' + selectedFormNumber
    ).is(':checked');
    govtPending = govtPending ? 1 : 0;
    console.log(govtPending);

    let licenseName = $(selectedFormID + '#licenseName' + selectedFormNumber);

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
            alert('License Updated!');
        })
        .catch((error) => console.log(error));
}

// function saveGCActivity() {}

// function saveGovtActivity() {}
