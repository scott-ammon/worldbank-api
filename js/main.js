$(document).ready(function() {

    let url = 'https://finances.worldbank.org/resource/45tv-a6qy.json?$limit=10';

    $.get(url).done(function(data) {
      console.log(data);
      
      data.forEach(contract => {
        let tableRow = "";
        for (let field in contract) {
          tableRow = tableRow + ("<td>" + contract[field] + "</td>");
        }
        $('.table').append("<tr>" + tableRow + "</tr>");
      });
    });
});