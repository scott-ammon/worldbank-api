$(document).ready(function() {

    let limit = 5;
    let url = 'https://finances.worldbank.org/resource/45tv-a6qy.json?$limit=' + limit;

    $.ajax({
      type: 'GET',
      url: url,
      beforeSend: function(xhr) {xhr.setRequestHeader('X-App-Token', 'oI0EZnx5rD82yqWmwIIO5BkpB')},
      error: function(err) {console.log(err)}
    }).done(function(data) {
      console.log(data);

      // array of the desired columns in the table
      let tableColumns = ['project_name', 
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
      
      data.forEach(contract => {
        let tableRow = "";
        tableColumns.forEach(columnHeader => {
          tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
        });
        $('.table').append("<tr>" + tableRow + "</tr>");
      });
    });
});