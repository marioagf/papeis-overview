const puppeteer = require('puppeteer');
const HtmlTableToJson = require('html-table-to-json');
const moment = require('moment');
const util = require('util');

(async () => {
    const fundamentus = await puppeteer.launch();
    var page = await fundamentus.newPage();
    await page.goto('http://www.fundamentus.com.br/resultado.php', {waitUntil: 'load'});
    const fundamentus_html = await page.evaluate(() => {
        return  document.getElementById("resultado").outerHTML;
    });

    var arrorg = [];

    var jsontables = HtmlTableToJson.parse(fundamentus_html);
    var cont = 0;
    for (const item of jsontables._results[0]){
        cont++;
        if(cont > 2) break;
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
    }
    fundamentus.close();
    arrorg.sort(function (a, b) {
        if (a.patrim_liq > b.patrim_liq) return 1;
        if (a.patrim_liq < b.patrim_liq) return -1;
        return 0;
    });

    for (var i = 0; i < arrorg.length; i++) {
        console.log('Carregando detalhe: '+arrorg[i].papel)
        var papel_detalhe = await detalhe(arrorg[i].papel);
        arrorg[i].detalhes_temp = papel_detalhe;
        arrorg[i].detalhes = {};

        arrorg[i].detalhes.nome_papel = arrorg[i].detalhes_temp['Detalhes: Papel'];
        arrorg[i].detalhes.cotacao = parseFloat(arrorg[i].detalhes_temp['Detalhes: Cotação'].split('.').join('').replace(',','.'));
        arrorg[i].detalhes.tipo = arrorg[i].detalhes_temp['Detalhes: Tipo'];
        arrorg[i].detalhes.data_ult_cotacao = arrorg[i].detalhes_temp['Detalhes: Data últ cot'];
        arrorg[i].detalhes.nome_empresa = arrorg[i].detalhes_temp['Detalhes: Empresa'];
        arrorg[i].detalhes.setor = arrorg[i].detalhes_temp['Detalhes: Setor'];
        arrorg[i].detalhes.subsetor = arrorg[i].detalhes_temp['Detalhes: Subsetor'];

        arrorg[i].detalhes.min_52_semanas = arrorg[i].detalhes_temp['Detalhes: Min 52 sem'];
        arrorg[i].detalhes.max_52_semanas = arrorg[i].detalhes_temp['Detalhes: Max 52 sem'];
    }

    console.log(util.inspect(arrorg, {showHidden: false, depth: null, maxArrayLength: null}))
})();


async function detalhe(papel){
    const fundamentusdet = await puppeteer.launch();
    var page = await fundamentusdet.newPage();
    await page.goto('http://www.fundamentus.com.br/detalhes.php?papel='+papel, {waitUntil: 'load'});
    const fundamentusdet_html = await page.evaluate(() => {
        var tabelas =  document.getElementsByClassName("w728");
        var array_tabelas_html = []
        for (var i = 0; i < tabelas.length; i++) {
            array_tabelas_html.push(tabelas[i].outerHTML);
        }
        return array_tabelas_html;
    });

    var obj_indicador = {};
    for (var i = 0; i < fundamentusdet_html.length; i++) {
        var tabela_html = fundamentusdet_html[i];

        if(i == 0 || i == 1){
            tabela_html = tabela_html.replace('<table class="w728">', '<table class="w728"><thead><th>Chave1</th><th>Valor1</th><th>Chave2</th><th>Valor2</th></thead>')
            var jsontables = HtmlTableToJson.parse(tabela_html);
            for (const indicador of jsontables._results[0]) {
                obj_indicador["Detalhes: "+indicador.Chave1.replace("?", "")] = indicador.Valor1;
                obj_indicador["Detalhes: "+indicador.Chave2.replace("?", "")] = indicador.Valor2;
            }            
        }

        if(i == 2){
            tabela_html = tabela_html.replace('<td class="nivel1" colspan="2"><span class="txt">Oscilações</span></td>', '');
            tabela_html = tabela_html.replace('<td class="nivel1" colspan="4"><span class="txt">Indicadores fundamentalistas</span></td>', '');
            tabela_html = tabela_html.replace(/(\r\n|\n|\r)/gm, "");
            tabela_html = tabela_html.replace("<tr></tr>", "");
            tabela_html = tabela_html.replace('<table class="w728">', '<table class="w728"><thead><th>Chave1</th><th>Valor1</th><th>Chave2</th><th>Valor2</th><th>Chave3</th><th>Valor3</th></thead>')
            var jsontables = HtmlTableToJson.parse(tabela_html);
            for (const indicador of jsontables._results[0]) {
                obj_indicador["Oscilações: "+indicador.Chave1.replace("?", "")] = indicador.Valor1;
                obj_indicador["Indicadores fundamentalistas: "+indicador.Chave2.replace("?", "")] = indicador.Valor2;
                obj_indicador["Indicadores fundamentalistas: "+indicador.Chave3.replace("?", "")] = indicador.Valor3;
            }  
        }

        if(i == 3){
            tabela_html = tabela_html.replace('<td class="nivel1" colspan="4"><span class="txt">Dados Balanço Patrimonial</span></td>', '');
            tabela_html = tabela_html.replace(/(\r\n|\n|\r)/gm, "");
            tabela_html = tabela_html.replace("<tr></tr>", "");
            tabela_html = tabela_html.replace('<table class="w728">', '<table class="w728"><thead><th>Chave1</th><th>Valor1</th><th>Chave2</th><th>Valor2</th></thead>')
            var jsontables = HtmlTableToJson.parse(tabela_html);
            for (const indicador of jsontables._results[0]) {
                obj_indicador["Balanço Patr.: "+indicador.Chave1.replace("?", "")] = indicador.Valor1;
                obj_indicador["Balanço Patr.: "+indicador.Chave2.replace("?", "")] = indicador.Valor2;
            }
        }

        if(i == 4){
            tabela_html = tabela_html.replace('<td class="nivel1" colspan="4"><span class="txt">Dados demonstrativos de resultados</span></td>', '');
            tabela_html = tabela_html.replace('<td class="nivel2 w5" colspan="2"><span class="txt">Últimos 12 meses</span></td>', '');
            tabela_html = tabela_html.replace('<td class="nivel2 w5" colspan="2"><span class="txt">Últimos 3 meses</span></td>', '');
            tabela_html = tabela_html.replace(/(\r\n|\n|\r)/gm, "");
            tabela_html = tabela_html.replace("<tr></tr>", "");
            tabela_html = tabela_html.replace('<table class="w728">', '<table class="w728"><thead><th>Chave1</th><th>Valor1</th><th>Chave2</th><th>Valor2</th></thead>')
            var jsontables = HtmlTableToJson.parse(tabela_html);
            for (const indicador of jsontables._results[0]) {
                obj_indicador["Demonst Result. 12 MESES: "+indicador.Chave1.replace("?", "")] = indicador.Valor1;
                obj_indicador["Demonst Result. 03 MESES: "+indicador.Chave2.replace("?", "")] = indicador.Valor2;
            }
        }
    }
    fundamentusdet.close();
    return obj_indicador;
}