let tableRows = $('tr');

for (const el of tableRows) { 
  el.classList.add('tableRow');
}


tableRows.on('click', (e) => {
  this.addClass('table-active');
})