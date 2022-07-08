/*
 * @Author: flowmar
 * @Date: 2022-07-08 07:05:56
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-08 08:28:26
 */

/**
 * It gets the information of the edited activity, then sends a POST request to the
 * server to save the edited activity
 */
function confirmAndSaveEditedActivity() {
    // Confirm the save action
    if (confirm('Save edited activity?')) {
        // Get the information of the edited activity
        let selectedRow = $('.table-active');
        selectedRow = selectedRow[0];
        let selectedActivityID = selectedRow.dataset.activityid;
        let marinerHidden = $('#marinerIDHidden');
        let marinerID = marinerHidden.val();
        let processingAgent = $('#activityProcessingAgent').val();
        let editedActivity = $('#editModalTextBox').val();

        // Sent a post request to the server with the edited activity
        axios
            .post('/activity/edit?activityid=' + selectedActivityID, {
                marinerID: marinerID,
                processingAgent: processingAgent,
                activity: editedActivity,
            })
            .then((response) => {
                console.log(response);
                $('#closeEditModal').trigger('click');
                location.reload();
            })
            .catch((error) => console.log(error));
    } else {
        console.log('Save activity cancelled!');
    }
}

// Delete the mariner activity
/**
 * If the user confirms that they want to delete the activity, then get the
 * activityID of the selected activity and send a POST request to the server to
 * delete the activity
 */
function confirmAndDeleteActivity() {
    // Confirm the deletion of the activity
    if (
        confirm(
            'Are you sure you want to delete this activity? This action cannot be undone.'
        )
    ) {
        // Get the activityID of the selected activity
        console.log($('.table-active'));
        let selectedRow = $('.table-active');
        selectedRow = selectedRow[0];
        let selectedActivityID = selectedRow.dataset.activityid;
        console.log(selectedActivityID);
        // Make a post request to the server to delete the activity from the database
        axios
            .post('/activity/delete?activityid=' + selectedActivityID)
            .then((response) => {
                console.log(response);
                location.reload();
            })
            .catch((error) => console.log(error));
    } else console.log('Delete activity cancelled!');
}

$(document).ready(() => {
    let selectedRow;
    if (!selectedRow) {
        $('.buttons').hide();
    }

    // Make table rows selectable
    $('tbody tr').on('click', function () {
        $('.buttons').show();
        // Remove active class from anything previously selected
        $('.table-active').removeClass('table-active');

        // Add active class to newly selected row
        $(this).addClass('table-active');

        // Get the selected row
        selectedRow = $(this);

        // Get the ActivityID of the selected row
        let selectedActivityID = selectedRow[0].dataset.activityid;

        console.log(selectedActivityID);

        // Get the Edit Button
        let editModalTextBox = $('#editModalTextBox');
        editModalTextBox.val(selectedRow[0].dataset.activity);
    });
});
