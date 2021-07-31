const { Pool } = require('pg')

module.exports = class FundamentusDB {

    constructor() {
        const pool = new Pool({
            host: 'localhost',
            user: 'postgres',
            password: 'postgres',
            db: 'papeis'
        });

        pool.connect((err, db, release) => {
            if (err) {
              return console.error('DB-CONN ERROR: ', err.stack);
            }else{
                console.log("DB-CONN OK");
                this.dbconn = db;
            }
        });
    }

    gravaPapel(obj){
        var sql_ins = 'INSERT INTO papeis.papeis_fundamentus(' +
            'papel, cotacao, p_l, p_vp, div_yield, p_ativo, p_cap_giro, p_ebit, p_ativ_circ_liq, ev_ebit, ev_ebitda, mrg_ebit, mrg_liq, liq_corr, roic, roe, liq_2_meses, patrim_liq, div_brut_patrim, cresc_rec_5a, periodo, info_nome_papel, info_cotacao, info_tipo, info_data_ult_cotacao, info_data_ult_balanco, info_nome_empresa, info_setor, info_subsetor, info_min_52_semanas, info_max_52_semanas, info_vol_medio_2_meses, info_valor_mercado, info_valor_firma, info_nro_acoes, balanco_ativo_circ, balanco_ativo, balanco_disponibilidades, balanco_div_bruta, balanco_div_liq, balanco_patrimonio_liq, demons_ebit_03_meses, demons_ebit_03_lucro_liq, demons_ebit_03_receita_liq, demons_ebit_12_meses, demons_ebit_12_lucro_liq, demons_ebit_12_receita_liq, oscilacoes_dia, oscilacoes_mes, oscilacoes_ult_30_dias, oscilacoes_ult_12_meses, oscilacoes_ano_2021, oscilacoes_ano_2020, oscilacoes_ano_2019, oscilacoes_ano_2018, oscilacoes_ano_2017, oscilacoes_ano_2016, oscilacoes_ano_2015, oscilacoes_ano_2014, fund_cresc_5_anos, fund_div_bruta_por_patrim_liq, fund_dividend_yield, fund_ebit_por_ativo, fund_enter_value_por_ebit, fund_enter_value_por_ebitda, fund_giro_ativos, fund_liq_corrente, fund_lucro_por_acao, fund_margem_bruta, fund_margem_ebit, fund_margem_liq, fund_roe, fund_roic, fund_vpa, fund_preco_acao_por_lucro, fund_preco_acao_por_valor_patrim, fund_preco_acao_por_ebit, fund_price_sales_ratio, fund_preco_acao_por_ativos_totais, fund_preco_acao_por_ativos_circ, fund_preco_acao_por_capital_giro, data_referencia, created_at)' +
            'VALUES ('+obj.papel + ',  ' + 
            obj.cotacao + ',  ' + 
            obj.p_l + ',  ' + 
            obj.p_vp + ',  ' + 
            obj.div_yield + ',  ' + 
            obj.p_ativo + ',  ' + 
            obj.p_cap_giro + ',  ' + 
            obj.p_ebit + ',  ' + 
            obj.p_ativ_circ_liq + ',  ' + 
            obj.ev_ebit + ',  ' + 
            obj.ev_ebitda + ',  ' + 
            obj.mrg_ebit + ',  ' + 
            obj.mrg_liq + ',  ' + 
            obj.liq_corr + ',  ' + 
            obj.roic + ',  ' + 
            obj.roe + ',  ' + 
            obj.liq_2_meses + ',  ' + 
            obj.patrim_liq + ',  ' + 
            obj.div_brut_patrim + ',  ' + 
            obj.cresc_rec_5a + ',  ' + 
            obj.periodo + ',  ' + 
            obj.detalhes_info_nome_papel + ',  ' + 
            obj.detalhes_info_cotacao + ',  ' + 
            obj.detalhes_info_tipo + ',  ' + 
            obj.detalhes_info_data_ult_cotacao + ',  ' + 
            obj.detalhes_info_data_ult_balanco + ',  ' + 
            obj.detalhes_info_nome_empresa + ',  ' + 
            obj.detalhes_info_setor + ',  ' + 
            obj.detalhes_info_subsetor + ',  ' + 
            obj.detalhes_info_min_52_semanas + ',  ' + 
            obj.detalhes_info_max_52_semanas + ',  ' + 
            obj.detalhes_info_vol_medio_2_meses + ',  ' + 
            obj.detalhes_info_valor_mercado + ',  ' + 
            obj.detalhes_info_valor_firma + ',  ' + 
            obj.detalhes_info_nro_acoes + ',  ' + 
            obj.detalhes_balanco_ativo_circ + ',  ' + 
            obj.detalhes_balanco_ativo + ',  ' + 
            obj.detalhes_balanco_disponibilidades + ',  ' + 
            obj.detalhes_balanco_div_bruta + ',  ' + 
            obj.detalhes_balanco_div_liq + ',  ' + 
            obj.detalhes_balanco_patrimonio_liq + ',  ' + 
            obj.detalhes_demons_ebit_03_meses + ',  ' + 
            obj.detalhes_demons_ebit_03_lucro_liq + ',  ' + 
            obj.detalhes_demons_ebit_03_receita_liq + ',  ' + 
            obj.detalhes_demons_ebit_12_meses + ',  ' + 
            obj.detalhes_demons_ebit_12_lucro_liq + ',  ' + 
            obj.detalhes_demons_ebit_12_receita_liq + ',  ' + 
            obj.detalhes_oscilacoes_dia + ',  ' + 
            obj.detalhes_oscilacoes_mes + ',  ' + 
            obj.detalhes_oscilacoes_ult_30_dias + ',  ' + 
            obj.detalhes_oscilacoes_ult_12_meses + ',  ' + 
            obj.detalhes_oscilacoes_ano_2021 + ',  ' + 
            obj.detalhes_oscilacoes_ano_2020 + ',  ' + 
            obj.detalhes_oscilacoes_ano_2019 + ',  ' + 
            obj.detalhes_oscilacoes_ano_2018 + ',  ' + 
            obj.detalhes_oscilacoes_ano_2017 + ',  ' + 
            obj.detalhes_oscilacoes_ano_2016 + ',  ' + 
            obj.detalhes_oscilacoes_ano_2017 + ',  ' + 
            obj.detalhes_oscilacoes_ano_2017 + ',  ' + 
            obj.detalhes_fund_cresc_5_anos + ',  ' + 
            obj.detalhes_fund_div_bruta_por_patrim_liq + ',  ' + 
            obj.detalhes_fund_dividend_yield + ',  ' + 
            obj.detalhes_fund_ebit_por_ativo + ',  ' + 
            obj.detalhes_fund_enter_value_por_ebit + ',  ' + 
            obj.detalhes_fund_enter_value_por_ebitda + ',  ' + 
            obj.detalhes_fund_giro_ativos + ',  ' + 
            obj.detalhes_fund_liq_corrente + ',  ' + 
            obj.detalhes_fund_lucro_por_acao + ',  ' + 
            obj.detalhes_fund_margem_bruta + ',  ' + 
            obj.detalhes_fund_margem_ebit + ',  ' + 
            obj.detalhes_fund_margem_liq + ',  ' + 
            obj.detalhes_fund_roe + ',  ' + 
            obj.detalhes_fund_roic + ',  ' + 
            obj.detalhes_fund_vpa + ',  ' + 
            obj.detalhes_fund_preco_acao_por_lucro + ',  ' + 
            obj.detalhes_fund_preco_acao_por_valor_patrim + ',  ' + 
            obj.detalhes_fund_preco_acao_por_ebit + ',  ' + 
            obj.detalhes_fund_price_sales_ratio + ',  ' + 
            obj.detalhes_fund_preco_acao_por_ativos_totais + ',  ' + 
            obj.detalhes_fund_preco_acao_por_ativos_circ + ',  ' + 
            obj.detalhes_fund_preco_acao_por_capital_giro + ");"
        sql_ins = sql_ins.replace(/undefined/g, 'null');
        // ARRUMAR FORMATOS AQUI E NO BANCO
            

        console.log(sql_ins);

        // this.dbconn.query(sql_ins, (err, result) => {
        //     if(err){
        //         console.log(err);
        //     }
        // })
        
    }
}