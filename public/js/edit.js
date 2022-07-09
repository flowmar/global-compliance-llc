/*
 * @Author: flowmar
 * @Date: 2022-07-08 07:05:56
 * @Last Modified by: flowmar
 * @Last Modified time: 2022-07-08 20:41:13
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
            .delete('/activity?activityid=' + selectedActivityID)
            .then((response) => {
                console.log(response);
                location.reload();
            })
            .catch((error) => console.log(error));
    } else console.log('Delete activity cancelled!');
}

/**
 * `uploadAttachment` takes a `FormData` object and makes a POST request to the
 * `/attachment` endpoint
 * @param data - The data to be sent to the server.
 */
function uploadAttachment(data) {
    // Make a POST request with the selected file
    $.ajax({
        type: 'POST',
        url: '/attachment',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (r) {
            let rJSON = JSON.parse(JSON.stringify(r));
            console.log(rJSON);
            alert('Attachement Uploaded!');
            location.reload();
        },
        error: function (err) {
            console.log('Error: ' + err.message);
        },
    });
}

/**
 * It opens a new window and navigates to the URL of the download attachment
 * endpoint
 * @param marinerID - The ID of the mariner
 * @param attachmentID - The ID of the attachment you want to download.
 */
function downloadMarinerAttachment(marinerID, attachmentID, fullName) {
    window.open(
        '/attachment/download?marinerID=' +
            marinerID +
            '&attachmentID=' +
            attachmentID +
            '&fullName=' +
            fullName
    );
}

/**
 * It sends a DELETE request to the server, and then reloads the page
 * @param attachmentID - The ID of the attachment you want to delete.
 */
function confirmAndDeleteAttachment(attachmentID) {
    // Confirmation for deletion
    if (
        confirm(
            'Are you sure you want to delete this attachment? This operation cannot be undone.'
        )
    ) {
        // Send a DELETE request to the server for the selected attachment
        axios
            .delete('/attachment?attachmentID=' + attachmentID)
            .then((response) => {
                console.log(response);
                location.reload();
            })
            .catch((error) => console.log(error));
    } else {
        console.log('Delete attachment cancelled!');
    }
}

$(document).ready(() => {
    let marinerFirstName = $('#first-name').val();
    let marinerMiddleName = $('#middle-name').val();
    let marinerLastName = $('#last-name').val();
    let marinerFullName =
        marinerFirstName + ' ' + marinerMiddleName + ' ' + marinerLastName;
    // Create a FormData object for uploading the attachment
    $('#attachmentForm').on('submit', function (e) {
        e.preventDefault();
        let formData = new FormData(this);
        console.log(formData);
        formData.append('marinerID', marinerID);
        formData.append(
            'processingAgent',
            window.localStorage.getItem('processingAgentID')
        );
        uploadAttachment(formData);
    });

    let selectedRow;
    if (!selectedRow) {
        $('.buttons').hide();
    }

    // Make table rows selectable
    $('#activityTableBody tr').on('click', function () {
        $('.buttons').show();
        // Remove active class from anything previously selected
        $('#activityTableBody tr').removeClass('table-active');

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

    let selectedAttachmentRow;
    // Hide attachment buttons if nothing is selected
    if (!selectedAttachmentRow) {
        $('.attachment-buttons').hide();
    }
    // Make attachment table rows selectable
    $('#attachmentsTableBody tr').on('click', function () {
        // Show attachment buttons when something is selected
        $('.attachment-buttons').show();
        // Remove active class from anything previously selected
        $('#attachmentsTableBody tr').removeClass('table-active');

        // Add active class to newly selected row
        $(this).addClass('table-active');

        // Get the selected attachment row
        selectedAttachmentRow = $(this);
        let selectedAttachmentID =
            selectedAttachmentRow[0].dataset.attachmentId;

        console.log(selectedAttachmentID);

        // Change the onlick event for the download button to include the marinerID and selectedAttachmentID as parameters
        $('#download-mariner-attachment-button').attr(
            'onclick',
            'downloadMarinerAttachment(' +
                marinerID +
                ', ' +
                selectedAttachmentID +
                ', "' +
                marinerFullName +
                '")'
        );

        // Change the onclick event for the delete button to include the selectedAttachmentID as a parameter
        $('#delete-mariner-attachment-button').attr(
            'onclick',
            'confirmAndDeleteAttachment(' + selectedAttachmentID + ')'
        );
    });

    // Character counter for notes text field
    let notesTextField = document.getElementById('notes');

    let totalCharacters = notesTextField.value.length;
    let characterCountMessage = document.getElementById(
        'characterCountMessage'
    );
    // Listen for key presses on the notes text field
    notesTextField.addEventListener('keyup', function (e) {
        totalCharacters = notesTextField.value.length;
        if (totalCharacters < 225) {
            characterCountMessage.style = 'color: white;';
        }
        if (totalCharacters > 225) {
            characterCountMessage.style = 'color: var(--red-color);';
        }
        if (totalCharacters === 255) {
            characterCountMessage.style = 'color: red;';
        }
        let charactersRemaining = 255 - totalCharacters;
        characterCountMessage.textContent =
            'Characters remaining: ' + charactersRemaining;
    });
});
