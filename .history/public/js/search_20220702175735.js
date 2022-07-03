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
      }
    });
  });
}

// Hide the label
$('#search-label').hide();

$(document).ready(function () {
  // Make table rows selectable
  $('tbody tr').click(function () {
    // $('.selected').removeClass('selected');
    // $(this).addClass('selected');
    $('.table-active').removeClass('table-active');
    $(this).addClass('table-active');
  });

  
});
