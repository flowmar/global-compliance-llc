
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
      type: "POST",
      url: "/search",
      data: formData,
      success: (result) => {
        console.log("Result: " + result);
      },
      error: (error) => {
        console.log('Error: ' + error[0])
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


  // Change the Search Input based on the category that is chosen
  $('#search-by').on('change', function (e) {
    
    let searchInput = $('#search-input');
    let selectedValue = this.value;
    let element;
    let agents = ['Arlene Martin', 'Margaret Landry', 'Austin Martin' ];

    // Show the label
    $('#search-label').show();

    // Clear searchInput if it has any children
    if (searchInput.children().length > 0) searchInput.empty();

    switch (selectedValue) {
      case 'Mariner ID':
        // Create an number input element
        element = document.createElement('input');
        element.classList = 'form-control bg-white';
        element.type = 'number';
        element.name = 'searchText';
        element.min = '10001';
        element.value = '10001';
        searchInput.append(element);
        break;

      case 'Processing Agent':
        // Create a select element
        element = document.createElement('select');
        element.classList = 'form-select bg-white';
        element.id = 'agentSelect';
        element.name = 'searchText';
        searchInput.append(element);

        // Add the agents to the dropdown
        for (let agent of agents) {
          let option = document.createElement('option');
          option.value = parseInt(agents.indexOf(agent)) + 1;
          option.text = agent;
          let agentSelect = $('#agentSelect');
          agentSelect.append(option);
        }
        break;

      case 'Name':
        break;

      case 'Birth Date':
        // Create a date input element
        element = document.createElement('div');
        element.classList = 'form-control';
        element.type = 'date';
        element.id = 'datepicker';
        element.name = 'searchText';
        searchInput.append(element);
        $('#datepicker').name = 'searchText';
        $('#datepicker').datepicker();
        break;

      case 'Employer':
        break;

      default:
        break;
    }
  });
});