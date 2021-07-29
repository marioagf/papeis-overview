const puppeteer = require('puppeteer');
const HtmlTableToJson = require('html-table-to-json');
const moment = require('moment');
const util = require('util');
const { MongoClient } = require('mongodb');
const url = "mongodb+srv://integracao_papeis:papeis123mario@mariostudy.gkl4v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("papeis");

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
            // if(cont > 3) break;
            // FAZER OS IFS PRA NÃO DAR SPLIT EM UNDEFINED

            var papel_obj = {};
            if(item['Papel'])               papel_obj.papel             = item['Papel'];
            if(item['Cotação'])             papel_obj.cotacao           = parseFloat(item['Cotação'].replace('.', '').split('.').join('').replace(',','.'));
            if(item['P/L'])                 papel_obj.p_l               = parseFloat(item['P/L'].split('.').join('').replace(',','.'));
            if(item['P/VP'])                papel_obj.p_vp              = parseFloat(item['P/VP'].split('.').join('').replace(',','.'));
            if(item['Div.Yield'])           papel_obj.div_yield         = parseFloat(item['Div.Yield'].split('.').join('').replace(',','.'))/100;
            if(item['P/Ativo'])             papel_obj.p_ativo           = parseFloat(item['P/Ativo'].split('.').join('').replace(',','.'));
            if(item['P/Cap.Giro'])          papel_obj.p_cap_giro        = parseFloat(item['P/Cap.Giro'].split('.').join('').replace(',','.'));
            if(item['P/EBIT'])              papel_obj.p_ebit            = parseFloat(item['P/EBIT'].split('.').join('').replace(',','.'));
            if(item['P/Ativ Circ.Liq'])     papel_obj.p_ativ_circ_liq   = parseFloat(item['P/Ativ Circ.Liq'].split('.').join('').replace(',','.'));
            if(item['EV/EBIT'])             papel_obj.ev_ebit           = parseFloat(item['EV/EBIT'].split('.').join('').replace(',','.'));
            if(item['EV/EBITDA'])           papel_obj.ev_ebitda         = parseFloat(item['EV/EBITDA'].split('.').join('').replace(',','.'));
            if(item['Mrg Ebit'])            papel_obj.mrg_ebit          = parseFloat(item['Mrg Ebit'].split('.').join('').replace(',','.'))/100;
            if(item['Mrg. Líq.'])           papel_obj.mrg_liq           = parseFloat(item['Mrg. Líq.'].split('.').join('').replace(',','.'))/100;
            if(item['Liq. Corr.'])          papel_obj.liq_corr          = parseFloat(item['Liq. Corr.'].split('.').join('').replace(',','.'));
            if(item['ROIC'])                papel_obj.roic              = parseFloat(item['ROIC'].split('.').join('').replace(',','.'))/100;
            if(item['ROE'])                 papel_obj.roe               = parseFloat(item['ROE'].split('.').join('').replace(',','.'))/100;
            if(item['Liq.2meses'])          papel_obj.liq_2_meses       = parseFloat(item['Liq.2meses'].split('.').join('').replace(',','.'));
            if(item['Patrim. Líq'])         papel_obj.patrim_liq        = parseFloat(item['Patrim. Líq'].split('.').join('').replace(',','.'));
            if(item['Dív.Brut/ Patrim.'])   papel_obj.div_brut_patrim   = parseFloat(item['Dív.Brut/ Patrim.'].split('.').join('').replace(',','.'));
            if(item['Dív.Brut/ Patrim.'])   papel_obj.cresc_rec_5a      = parseFloat(item['Cresc. Rec.5a'].split('.').join('').replace(',','.'))/100;
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
            // console.log('Carregando detalhe: '+arrorg[i].papel)
            var papel_detalhe = await detalhe(arrorg[i].papel);
            if(papel_detalhe){
                arrorg[i].detalhes_temp = papel_detalhe;
                arrorg[i].detalhes = {info:{}, balanco:{}, demons:{}, oscilacoes: {}, fund: {}};
        
                // detalhes padrão
                if(arrorg[i].detalhes_temp['Detalhes: Papel'])                  arrorg[i].detalhes.info.nome_papel = arrorg[i].detalhes_temp['Detalhes: Papel'];
                if(arrorg[i].detalhes_temp['Detalhes: Cotação'])                arrorg[i].detalhes.info.cotacao = parseFloat(arrorg[i].detalhes_temp['Detalhes: Cotação'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Detalhes: Tipo'])                   arrorg[i].detalhes.info.tipo = arrorg[i].detalhes_temp['Detalhes: Tipo'];
                if(arrorg[i].detalhes_temp['Detalhes: Data últ cot'])           arrorg[i].detalhes.info.data_ult_cotacao = arrorg[i].detalhes_temp['Detalhes: Data últ cot'];
                if(arrorg[i].detalhes_temp['Detalhes: Últ balanço processado']) arrorg[i].detalhes.info.data_ult_balanco = arrorg[i].detalhes_temp['Detalhes: Últ balanço processado'];
                if(arrorg[i].detalhes_temp['Detalhes: Empresa'])                arrorg[i].detalhes.info.nome_empresa = arrorg[i].detalhes_temp['Detalhes: Empresa'];
                if(arrorg[i].detalhes_temp['Detalhes: Setor'])                  arrorg[i].detalhes.info.setor = arrorg[i].detalhes_temp['Detalhes: Setor'];
                if(arrorg[i].detalhes_temp['Detalhes: Subsetor'])               arrorg[i].detalhes.info.subsetor = arrorg[i].detalhes_temp['Detalhes: Subsetor'];
                if(arrorg[i].detalhes_temp['Detalhes: Min 52 sem'])             arrorg[i].detalhes.info.min_52_semanas = parseFloat(arrorg[i].detalhes_temp['Detalhes: Min 52 sem'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Detalhes: Max 52 sem'])             arrorg[i].detalhes.info.max_52_semanas = parseFloat(arrorg[i].detalhes_temp['Detalhes: Max 52 sem'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Detalhes: Vol $ méd (2m)'])         arrorg[i].detalhes.info.vol_medio_2_meses = parseFloat(arrorg[i].detalhes_temp['Detalhes: Vol $ méd (2m)'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Detalhes: Valor de mercado'])       arrorg[i].detalhes.info.valor_mercado = parseFloat(arrorg[i].detalhes_temp['Detalhes: Valor de mercado'].split('.').join('').replace(',','.'));        
                if(arrorg[i].detalhes_temp['Detalhes: Valor da firma'])         arrorg[i].detalhes.info.valor_firma = parseFloat(arrorg[i].detalhes_temp['Detalhes: Valor da firma'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Detalhes: Nro. Ações'])             arrorg[i].detalhes.info.nro_acoes = parseFloat(arrorg[i].detalhes_temp['Detalhes: Nro. Ações'].split('.').join('').replace(',','.'));
        
                // balanço patrimonial
                if(arrorg[i].detalhes_temp['Balanço Patr.: Ativo Circulante'])  arrorg[i].detalhes.balanco.ativo_circ = parseFloat(arrorg[i].detalhes_temp['Balanço Patr.: Ativo Circulante'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Balanço Patr.: Ativo'])             arrorg[i].detalhes.balanco.ativo = parseFloat(arrorg[i].detalhes_temp['Balanço Patr.: Ativo'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Balanço Patr.: Disponibilidades'])  arrorg[i].detalhes.balanco.disponibilidades = parseFloat(arrorg[i].detalhes_temp['Balanço Patr.: Disponibilidades'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Balanço Patr.: Dív. Bruta'])        arrorg[i].detalhes.balanco.div_bruta = parseFloat(arrorg[i].detalhes_temp['Balanço Patr.: Dív. Bruta'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Balanço Patr.: Dív. Líquida'])      arrorg[i].detalhes.balanco.div_liq = parseFloat(arrorg[i].detalhes_temp['Balanço Patr.: Dív. Líquida'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Balanço Patr.: Patrim. Líq'])       arrorg[i].detalhes.balanco.patrimonio_liq = parseFloat(arrorg[i].detalhes_temp['Balanço Patr.: Patrim. Líq'].split('.').join('').replace(',','.'));
        
                // demonstrativo 
                if(arrorg[i].detalhes_temp['Demonst Result. 03 MESES: EBIT'])               arrorg[i].detalhes.demons.ebit_03_meses = parseFloat(arrorg[i].detalhes_temp['Demonst Result. 03 MESES: EBIT'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Demonst Result. 03 MESES: Lucro Líquido'])      arrorg[i].detalhes.demons.ebit_03_lucro_liq = parseFloat(arrorg[i].detalhes_temp['Demonst Result. 03 MESES: Lucro Líquido'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Demonst Result. 03 MESES: Receita Líquida'])    arrorg[i].detalhes.demons.ebit_03_receita_liq = parseFloat(arrorg[i].detalhes_temp['Demonst Result. 03 MESES: Receita Líquida'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Demonst Result. 12 MESES: EBIT'])               arrorg[i].detalhes.demons.ebit_12_meses = parseFloat(arrorg[i].detalhes_temp['Demonst Result. 12 MESES: EBIT'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Demonst Result. 12 MESES: Lucro Líquido'])      arrorg[i].detalhes.demons.ebit_12_lucro_liq = parseFloat(arrorg[i].detalhes_temp['Demonst Result. 12 MESES: Lucro Líquido'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Demonst Result. 12 MESES: Receita Líquida'])    arrorg[i].detalhes.demons.ebit_12_receita_liq = parseFloat(arrorg[i].detalhes_temp['Demonst Result. 12 MESES: Receita Líquida'].split('.').join('').replace(',','.'));
        
                // oscilações
                if(arrorg[i].detalhes_temp['Oscilações: Dia'])      arrorg[i].detalhes.oscilacoes.dia = parseFloat(arrorg[i].detalhes_temp['Oscilações: Dia'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: Mês'])      arrorg[i].detalhes.oscilacoes.mes = parseFloat(arrorg[i].detalhes_temp['Oscilações: Mês'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 30 dias'])  arrorg[i].detalhes.oscilacoes.ult_30_dias = parseFloat(arrorg[i].detalhes_temp['Oscilações: 30 dias'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 12 meses']) arrorg[i].detalhes.oscilacoes.ult_12_meses = parseFloat(arrorg[i].detalhes_temp['Oscilações: 12 meses'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2021'])     arrorg[i].detalhes.oscilacoes.ano_2021 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2021'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2020'])     arrorg[i].detalhes.oscilacoes.ano_2020 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2020'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2019'])     arrorg[i].detalhes.oscilacoes.ano_2019 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2018'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2018'])     arrorg[i].detalhes.oscilacoes.ano_2018 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2017'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2017'])     arrorg[i].detalhes.oscilacoes.ano_2017 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2017'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2016'])     arrorg[i].detalhes.oscilacoes.ano_2016 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2016'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2015'])     arrorg[i].detalhes.oscilacoes.ano_2015 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2015'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Oscilações: 2014'])     arrorg[i].detalhes.oscilacoes.ano_2014 = parseFloat(arrorg[i].detalhes_temp['Oscilações: 2014'].split('.').join('').replace(',','.'))/100;
        
                // indicadores fundamentalistas
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Cres. Rec (5a)'])     arrorg[i].detalhes.fund.cresc_5_anos = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Cres. Rec (5a)'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Div Br/ Patrim'])     arrorg[i].detalhes.fund.div_bruta_por_patrim_liq = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Div Br/ Patrim'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Div. Yield'])         arrorg[i].detalhes.fund.dividend_yield = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Div. Yield'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: EBIT / Ativo'])       arrorg[i].detalhes.fund.ebit_por_ativo = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: EBIT / Ativo'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: EV / EBIT'])          arrorg[i].detalhes.fund.enter_value_por_ebit = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: EV / EBIT'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: EV / EBITDA'])        arrorg[i].detalhes.fund.enter_value_por_ebitda = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: EV / EBITDA'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Giro Ativos'])        arrorg[i].detalhes.fund.giro_ativos = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Giro Ativos'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Liquidez Corr'])      arrorg[i].detalhes.fund.liq_corrente = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Liquidez Corr'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: LPA'])                arrorg[i].detalhes.fund.lucro_por_acao = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: LPA'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Marg. Bruta'])        arrorg[i].detalhes.fund.margem_bruta = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Marg. Bruta'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Marg. EBIT'])         arrorg[i].detalhes.fund.margem_ebit = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Marg. EBIT'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Marg. Líquida'])      arrorg[i].detalhes.fund.margem_liq = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: Marg. Líquida'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: ROE'])                arrorg[i].detalhes.fund.roe = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: ROE'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: ROIC'])               arrorg[i].detalhes.fund.roic = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: ROIC'].split('.').join('').replace(',','.'))/100;
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: VPA'])                arrorg[i].detalhes.fund.vpa = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: VPA'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/L'])                arrorg[i].detalhes.fund.preco_acao_por_lucro = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/L'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/VP'])               arrorg[i].detalhes.fund.preco_acao_por_valor_patrim = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/VP'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/EBIT'])             arrorg[i].detalhes.fund.preco_acao_por_ebit = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/EBIT'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: PSR'])                arrorg[i].detalhes.fund.price_sales_ratio = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: PSR'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/Ativos'])           arrorg[i].detalhes.fund.preco_acao_por_ativos_totais = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/Ativos'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/Ativ Circ Liq'])    arrorg[i].detalhes.fund.preco_acao_por_ativos_circ = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/Ativ Circ Liq'].split('.').join('').replace(',','.'));
                if(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/Cap. Giro'])        arrorg[i].detalhes.fund.preco_acao_por_capital_giro = parseFloat(arrorg[i].detalhes_temp['Indicadores fundamentalistas: P/Cap. Giro'].split('.').join('').replace(',','.'));
                
                delete arrorg[i].detalhes_temp;
                // console.log(arrorg[i]);
                dbo.collection("fundamentus").insertOne(arrorg[i], function(err, res) {
                    if (err) throw err;
                    // console.log('Gravando registro: '+arrorg[i].papel)
                });
            }
        }
    
        // console.log(util.inspect(arrorg, {showHidden: false, depth: null, maxArrayLength: null}))
        db.close();
    })();
       

});

async function detalhe(papel){
    try{
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
    }catch(err){
        console.log("Erro Detalhe: "+err);
        return false;
    }    
}