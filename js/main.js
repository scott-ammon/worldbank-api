$(document).ready(function() {

  // Global variables used in API query strings
  const limit = 10;
  let offset = 0;
  let order = '';

  // AJAX call on page load to get data and plot chart with major sectors
  $.ajax({
    type: 'GET',
    url: 'https://finances.worldbank.org/resource/45tv-a6qy.json?$limit=1000',
    beforeSend: function(xhr) {xhr.setRequestHeader('X-App-Token', 'oI0EZnx5rD82yqWmwIIO5BkpB')},
    error: function(err) {console.log(err)}
  }).done(function(data) {
    // Object to hold the counts of each major sector
    let counts = {};
    data.forEach(contract => {
      counts[contract['major_sector']] = 1 + (counts[contract['major_sector']] || 0);
    });
    
    let sectorData = [];
    let colors = [];
    // Make array of sector counts to graph
    Object.keys(counts).forEach(function(key, i) {
      sectorData.push(counts[key]);
      colors.push('rgba(0, ' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ', .7');
      // borders.push("rgba(255, 255, 255, 1)");
    });

    // define Canvas context by selecting the div with id = myChart
    var ctx = document.getElementById("sector-chart").getContext('2d');
    
    // Create chart and initialize with tag names and colors
    var myChart = new Chart(ctx, {
    type: 'doughnut',
      data: {
        datasets: [{
          data: sectorData,
          backgroundColor: colors,
        }],
        labels: Object.keys(counts)
      },
      options: {
        legend: null,
        cutoutPercentage: 60,
        animation: {
          duration: 2000
        }
      }
    });
  });
 
  // array of the desired columns in the table
  const tableColumns = ['wb_contract_number',
                        'project_name', 
                        'major_sector',
                        'procurement_category',
                        'supplier_country',
                        'borrower_country',
                        'supplier_contract_amount_usd',
                        'contract_signing_date'
                       ];

  // function wrapper to reuse AJAX code in event handlers
  const getWorldBankData = function(url) {
    // AJAX Get request to World Bank API for major contracts data
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
          } else if (columnHeader === 'contract_signing_date') {
            // format date to exclude everything after T marker
            tableRow = tableRow + ("<td>" + (contract[columnHeader] !== undefined ? contract[columnHeader].split('T')[0] : "N/A") + "</td>");
          } else {
            tableRow = tableRow + ("<td>" + contract[columnHeader] + "</td>");
          }
        });
        $('.table-body').append("<tr>" + tableRow + "</tr>");
      });
    });
  }
  
  // initial call to populate the table
  getWorldBankData('https://finances.worldbank.org/resource/45tv-a6qy.json?$limit=' + limit);

  // Click event handler on next button to retrieve next page of data from API
  $('.next').on('click', function() {
    // increment offset for next page
    offset+= limit;
    getWorldBankData('https://finances.worldbank.org/resource/45tv-a6qy.json?$order=' + order + '&$limit=' + limit + '&$offset=' + offset);
    let page = (offset / limit) + 1;
    $('.page').text(`Page: ${page}`);
  });

  // Click event handler on previous button
  $('.previous').on('click', function() {
    // decrement offset for previous page
    if(offset > 0) {
      offset-= limit;
    }
    getWorldBankData('https://finances.worldbank.org/resource/45tv-a6qy.json?$order=' + order + '&$limit=' + limit + '&$offset=' + offset);
    let page = offset === 0 ? 1 : (offset / limit) + 1;
    $('.page').text(`Page: ${page}`);
  });

  // Click event handler on each column header to sort table (toggles btw ascending and desc)
  $('.header').on('click', 'th', function() {

    // remove the last sort arrow
    $('.header th').children().remove();

    // first time clicked, sort in ascending order
    if(!$(this).attr('sort')) {
      // modify headings to match object keys for use in query string
      order = $(this).text().toLowerCase().split(" ").join("_");
      // After sorting ascending, set the attr to descending for next click
      $(this).attr('sort', 'ASC');
      $(this).append('<i class="material-icons">arrow_upward</i>');
    } else if ($(this).attr('sort') === 'ASC') {
      // add descending keyword to query string
      order = $(this).text().toLowerCase().split(" ").join("_") + ' DESC';
      $(this).attr('sort', 'DESC');
      $(this).append('<i class="material-icons">arrow_downward</i>');
    } else {
      order = '';
      $(this).removeAttr('sort');
    }
    // reset offset because data is sorted
    offset = 0;
    // sorting resets the page #
    let page = 1;
    $('.page').text(`Page: ${page}`);
    getWorldBankData('https://finances.worldbank.org/resource/45tv-a6qy.json?$order=' + order + '&$limit=' + limit);
  });
});