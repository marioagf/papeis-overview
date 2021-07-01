'use strict';
var request = require('request');

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
var url_time_series_daily = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=[papel].SA&apikey=P5DGFERWGW7DEKSN';
var url_overview = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=[papel]&apikey=P5DGFERWGW7DEKSN'

var acoes = ['PETR4']

for (const item of acoes) {
    request.get({
        url: url_time_series_daily.replace('[papel]', item),
        json: true,
        headers: {'User-Agent': 'request'}
      }, (err, res, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode);
        } else {
          // data is successfully parsed as a JSON object:
          console.log(data);
        }
    });   
}