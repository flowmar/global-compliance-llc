/*
 * @Author: flowmar
 * @Date: 2022-07-02 23:03:55
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-08 02:38:25
 */

/**
 * It takes the selected category and search text, and sends a POST request to the
 * server with the data
 */
// Uses the selected category and search text to send a request to the backend
function search() {
    let searchCategory = $('#search-by').value;
    let searchText = $('#search-text').value;

    console.log(searchCategory);
    console.log(searchText);

    $('#search-button').submit((e) => {
        e.preventDefault();
        let formData = new FormData(this);

        // Make a POST request to the server
        $.ajax({
            type: 'POST',
            url: '/search',
            data: formData,
            success: (result) => {
                console.log('Result: ' + result);
            },
            error: (error) => {
                console.log('Error: ' + error[0]);
            },
        });
    });
}

/**
 * When the user clicks the delete button, a confirmation dialog appears. If the
 * user clicks "OK", the selected mariner's ID is sent to the server, which deletes
 * the mariner from the database
 */
// Confirm and delete Mariner
function confirmDelete() {
    let confirmed = confirm(
        'Are you sure you want to delete this Mariner? This cannot be undone!'
    );
    if (confirmed) {
        let selectedMarinerButton = $('#delete-mariner-button');
        let selectedMarinerID = selectedMarinerButton.val();
        console.log(selectedMarinerID);
        let url = '/delete/' + selectedMarinerID;
        axios
            .post(url, {
                id: selectedMarinerID,
            })
            .then(function (response) {
                console.log(response);
                alert('Mariner Deleted');
                location.reload();
            })
            .catch(function (error) {
                console.log(error);
                alert('Unable to Delete Mariner');
            });
    }
}

// Hide the label
$('#search-label').hide();
$('#search-button').hide();

$(document).ready(function () {
    // Variables for the items we need to create the View URL
    let selectedRow;
    let marinerIDCell;
    let selectedMarinerID;
    if (!selectedRow) {
        $('.buttons').hide();
    }

    // Make table rows selectable
    $('tbody tr').click(function () {
        $('.buttons').show();
        // Remove the active class from anything previously selected
        $('.table-active').removeClass('table-active');

        // Add the active class to the newly selected row
        $(this).addClass('table-active');

        // Get the selected row
        selectedRow = $(this);

        // Get the first child of the selected Row
        marinerIDCell = selectedRow.children().first();
        // console.log(marinerIDCell[0]);

        // Get the ID of the cell
        selectedMarinerID = marinerIDCell[0].id;
        // console.log(selectedMarinerID);

        // Get the View Button
        let viewMarinerButton = $('#view-mariner-button');
        // Create a new URL Based on the selected Row
        let newViewURL = '/view/' + selectedMarinerID;
        // Change the href attribute of the Button to the new URL
        viewMarinerButton.attr({
            href: newViewURL,
            target: '_blank',
        });

        // Get the Edit Button
        let editMarinerButton = $('#edit-mariner-button');
        // Create a new URL Based on the selected Row
        let newEditURL = '/edit/' + selectedMarinerID;
        // Change the href attribute of the Button to the new URL
        editMarinerButton.attr({
            href: newEditURL,
            target: '_blank',
        });

        // Get the Delete Button
        let deleteMarinerButton = $('#delete-mariner-button');
        // Create a new URL Based on the selected Row
        let newDeleteURL = '/delete/' + selectedMarinerID;
        // Change the href attribute of the Button to the new URL
        deleteMarinerButton.attr({
            href: newDeleteURL,
            target: '_blank',
            value: selectedMarinerID,
        });
    });
});
