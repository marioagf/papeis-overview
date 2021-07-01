const puppeteer = require('puppeteer');
const HtmlTableToJson = require('html-table-to-json');
const moment = require('moment');
const util = require('util');

(async () => {
    const browser = await puppeteer.launch();
    var page = await browser.newPage();
    await page.goto('http://www.fundamentus.com.br/resultado.php', {waitUntil: 'load'});
    const newPage = await page.evaluate(() => {
        return  document.getElementById("resultado").outerHTML;
    });

    var arrorg = [];

    var jsontables = HtmlTableToJson.parse(newPage);
    for (const item of jsontables._results[0]){
        var papel_obj = {};
        papel_obj.papel             = item['Papel'];
        papel_obj.cotacao           = parseFloat(item['Cotação'].replace('.', '').split('.').join('').replace(',','.'));
        papel_obj.p_l               = parseFloat(item['P/L'].split('.').join('').replace(',','.'));
        papel_obj.p_vp              = parseFloat(item['P/VP'].split('.').join('').replace(',','.'));
        papel_obj.div_yield         = parseFloat(item['Div.Yield'].split('.').join('').replace(',','.'))/100;
        papel_obj.p_ativo           = parseFloat(item['P/Ativo'].split('.').join('').replace(',','.'));
        papel_obj.p_cap_giro        = parseFloat(item['P/Cap.Giro'].split('.').join('').replace(',','.'));
        papel_obj.p_ebit            = parseFloat(item['P/EBIT'].split('.').join('').replace(',','.'));
        papel_obj.p_ativ_circ_liq   = parseFloat(item['P/Ativ Circ.Liq'].split('.').join('').replace(',','.'));
        papel_obj.ev_ebit           = parseFloat(item['EV/EBIT'].split('.').join('').replace(',','.'));
        papel_obj.ev_ebitda         = parseFloat(item['EV/EBITDA'].split('.').join('').replace(',','.'));
        papel_obj.mrg_ebit          = parseFloat(item['Mrg Ebit'].split('.').join('').replace(',','.'))/100;
        papel_obj.mrg_liq           = parseFloat(item['Mrg. Líq.'].split('.').join('').replace(',','.'))/100;
        papel_obj.liq_corr          = parseFloat(item['Liq. Corr.'].split('.').join('').replace(',','.'));
        papel_obj.roic              = parseFloat(item['ROIC'].split('.').join('').replace(',','.'))/100;
        papel_obj.roe               = parseFloat(item['ROE'].split('.').join('').replace(',','.'))/100;
        papel_obj.liq_2_meses       = parseFloat(item['Liq.2meses'].split('.').join('').replace(',','.'));
        papel_obj.patrim_liq        = parseFloat(item['Patrim. Líq'].split('.').join('').replace(',','.'));
        papel_obj.div_brut_patrim   = parseFloat(item['Dív.Brut/ Patrim.'].split('.').join('').replace(',','.'));
        papel_obj.cresc_rec_5a      = parseFloat(item['Cresc. Rec.5a'].split('.').join('').replace(',','.'))/100;
        papel_obj.periodo           = moment().format('MM-YYYY');
        arrorg.push(papel_obj);
        // console.log(papel_obj);
    }
    browser.close();
    arrorg.sort(function (a, b) {
        if (a.patrim_liq > b.patrim_liq) return 1;
        if (a.patrim_liq < b.patrim_liq) return -1;
        return 0;
      });
    console.log(util.inspect(arrorg, {showHidden: false, depth: null, maxArrayLength: null}))
})();