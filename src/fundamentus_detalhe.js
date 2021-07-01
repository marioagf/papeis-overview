const puppeteer = require('puppeteer');
const HtmlTableToJson = require('html-table-to-json');
const moment = require('moment');
const util = require('util');

(async () => {
    const browser = await puppeteer.launch();
    var page = await browser.newPage();
    await page.goto('http://www.fundamentus.com.br/detalhes.php?papel=PETR3', {waitUntil: 'load'});
    const newPage = await page.evaluate(() => {
        var tabelas =  document.getElementsByClassName("w728");
        var array_tabelas_html = []
        for (var i = 0; i < tabelas.length; i++) {
            array_tabelas_html.push(tabelas[i].outerHTML);
        }
        return array_tabelas_html;
    });

    var arrorg = [];

    var obj_indicador = {};
    for (var i = 0; i < newPage.length; i++) {
        var tabela_html = newPage[i];

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
            console.log(tabela_html);
            var jsontables = HtmlTableToJson.parse(tabela_html);
            for (const indicador of jsontables._results[0]) {
                obj_indicador["Demonst Result. 12 MESES: "+indicador.Chave1.replace("?", "")] = indicador.Valor1;
                obj_indicador["Demonst Result. 03 MESES: "+indicador.Chave2.replace("?", "")] = indicador.Valor2;
            }
            // console.log(jsontables._results[0]);
        }
    }
    console.log(obj_indicador);
    browser.close();

})();