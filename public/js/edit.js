// Open a window to edit the mariner activity
function editMarinerActivity() {}

// Delete the mariner activity
function confirmAndDeleteActivity() {
    // Get the activityID of the selected activity
    console.log($('.table-active'));
    let selectedRow = $('.table-active');
    selectedRow = selectedRow[0];
    let selectedActivityID = selectedRow.dataset.activityid;
    console.log(selectedActivityID);
    axios
        .post('/activity/delete?activityid=' + selectedActivityID)
        .then((response) => {
            console.log(response);
            location.reload();
        })
        .catch((error) => console.log(error));
}

$(document).ready(() => {
    let selectedRow;

    // Make table rows selectable
    $('tbody tr').on('click', function () {
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
        // Get the Delete Button
    });
});
