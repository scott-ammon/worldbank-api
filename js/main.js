$(document).ready(function() {

  
  // array of the desired columns in the table
  const tableColumns = ['project_name', 
                        'project_id',
                        'major_sector',
                        'procurement_category',
                        'supplier',
                        'supplier_country',
                        'borrower_country',
                        'supplier_contract_amount_usd',
                        'wb_contract_number',
                        'contract_signing_date'
                       ];

  let limit = 5;
  let url = 'https://finances.worldbank.org/resource/45tv-a6qy.json?$limit=' + limit;

  // AJAX call to populate initial table
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
        tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
      });
      $('.table-body').append("<tr>" + tableRow + "</tr>");
    });
  });

  let offset = 5;
  // AJAX call triggered by click on next for pagination
  $('.next').on('click', function() {

    let url = 'https://finances.worldbank.org/resource/45tv-a6qy.json?$limit=' + limit + '&$offset=' + offset;
    
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
          tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
        });
        $('.table-body').append("<tr>" + tableRow + "</tr>");
      });
      offset+= 5;
    });
  });


  let ascending = true;

  // Event delegation to handle column header clicks to sort data
  $('.header').on('click', 'th', function() {
    
    let order = '';

    if(ascending) {
      // convert headings into object keys to use in query string
      order = $(this).text().toLowerCase().split(" ").join("_");
      ascending = false;
    } else {
      order = $(this).text().toLowerCase().split(" ").join("_") + ' DESC';
      ascending = true;
    }
    
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
          tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
        });
        $('.table-body').append("<tr>" + tableRow + "</tr>");
      });
    });
  });
    

// end of document ready function
});