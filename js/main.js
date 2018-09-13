$(document).ready(function() {

  // Global variables
  const limit = 10;
  let offset = 10;
  let order = '';
 
  let url = 'https://finances.worldbank.org/resource/45tv-a6qy.json?$limit=' + limit;

  // array of the desired columns in the table
  const tableColumns = ['project_name', 
                        'major_sector',
                        'procurement_category',
                        'supplier_country',
                        'borrower_country',
                        'supplier_contract_amount_usd',
                        'wb_contract_number',
                        'contract_signing_date'
                       ];

  // AJAX call to populate table
  $.ajax({
    type: 'GET',
    url: url,
    beforeSend: function(xhr) {xhr.setRequestHeader('X-App-Token', 'oI0EZnx5rD82yqWmwIIO5BkpB')},
    error: function(err) {console.log(err)}
  }).done(function(data) {
    // Loop through each contract object and create html for table rows
    data.forEach(contract => {
      let tableRow = "";
      tableColumns.forEach(columnHeader => {
        if(columnHeader === 'supplier_contract_amount_usd') {
          // Credit to http://jsfiddle.net/hAfMM/9571/ for the RegEx statement below
          tableRow = tableRow + ("<td>$" + Number(contract[columnHeader]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>");
        } else {
          tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
        }
      });
      $('.table-body').append("<tr>" + tableRow + "</tr>");
    });
  });

  // AJAX call triggered by click on next for pagination
  $('.next').on('click', function() {

    let url = 'https://finances.worldbank.org/resource/45tv-a6qy.json?$order=' + order + '&$limit=' + limit + '&$offset=' + offset;
    
    $.ajax({
      type: 'GET',
      url: url,
      beforeSend: function(xhr) {xhr.setRequestHeader('X-App-Token', 'oI0EZnx5rD82yqWmwIIO5BkpB')},
      error: function(err) {console.log(err)}
    }).done(function(data) {
      $('.table-body').children().remove();
      // Loop through each contract object and create html for table rows
      data.forEach(contract => {
        let tableRow = "";
        tableColumns.forEach(columnHeader => {
          if(columnHeader === 'supplier_contract_amount_usd') {
            // Credit to http://jsfiddle.net/hAfMM/9571/ for the RegEx statement below
            tableRow = tableRow + ("<td>$" + Number(contract[columnHeader]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>");
          } else {
            tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
          }
        });
        $('.table-body').append("<tr>" + tableRow + "</tr>");
      });
      offset+= limit;
    });
  });

  // AJAX call for sorting by column header (toggles btw ascending and desc)
  $('.header').on('click', 'th', function() {

    // if first time clicked, add the data attribute
    if(!$(this).attr('sort')) {
      $(this).attr('sort', 'ASC');
    }

    // convert headings into object keys to use in query string
    if($(this).attr('sort') === 'ASC') {
      order = $(this).text().toLowerCase().split(" ").join("_");
      $(this).attr('sort', 'DESC');
    } else {
      // add descending keyword to query string
      order = $(this).text().toLowerCase().split(" ").join("_") + ' ' + $(this).attr('sort');
      $(this).attr('sort', 'ASC');
    }
    
    console.log('order is:', order);

    let url = 'https://finances.worldbank.org/resource/45tv-a6qy.json?$order=' + order + '&$limit=' + limit;
    
    $.ajax({
      type: 'GET',
      url: url,
      beforeSend: function(xhr) {xhr.setRequestHeader('X-App-Token', 'oI0EZnx5rD82yqWmwIIO5BkpB')},
      error: function(err) {console.log(err)}
    }).done(function(data) {
      $('.table-body').children().remove();
      // Loop through each contract object and create html for table rows
      data.forEach(contract => {
        let tableRow = "";
        tableColumns.forEach(columnHeader => {
          if(columnHeader === 'supplier_contract_amount_usd') {
            // Credit to http://jsfiddle.net/hAfMM/9571/ for the RegEx statement below
            tableRow = tableRow + ("<td>$" + Number(contract[columnHeader]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>");
          } else {
            tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
          }
        });
        $('.table-body').append("<tr>" + tableRow + "</tr>");
      });
    });
  });
    

// end of document ready function
});