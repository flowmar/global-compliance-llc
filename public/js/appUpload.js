const newApplicationModal = document.getElementById('newApplicationModal');
// const newModalClose = document.getElementById('newModalClose');

// Uploads the application document to the database
function uploadApp() {
  let marinerID = document.getElementById('mariner-id').value;
  console.log("UploadApp Mar ID: " + marinerID);
    // console.log(marinerID + "\n" + processingAgent);

  // When 'Upload' is clicked
  $("#target").submit(function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    console.log("THIS:" + this);
    // formData.append('file', e.target.files[0]);
    formData.append('marinerIDNumber', marinerID);
    console.log("Form-Data" + formData)

    // Make a POST request with the selected file
    $.ajax({
      type: "POST",
      url: "/newAppUpload",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      success: function (r) {
        console.log("Result: " + r);
        $('#newModalClose').trigger("click");
      },
      error: function (err) {
        console.log("Error: " + err[0]);
      }
    });
  });
}