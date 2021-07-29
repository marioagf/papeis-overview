DROP TABLE IF EXISTS papeis.papeis_fundamentus;
CREATE TABLE papeis.papeis_fundamentus (
	id_papel serial PRIMARY KEY,
	papel TEXT,
	cotacao TEXT,
	p_l TEXT,
	p_vp TEXT,
	div_yield TEXT,
	p_ativo TEXT,
	p_cap_giro TEXT,
	p_ebit TEXT,
	p_ativ_circ_liq TEXT,
	ev_ebit TEXT,
	ev_ebitda TEXT,
	mrg_ebit TEXT,
	mrg_liq TEXT,
	liq_corr TEXT,
	roic TEXT,
	roe TEXT,
	liq_2_meses TEXT,
	patrim_liq TEXT,
	div_brut_patrim TEXT,
	cresc_rec_5a TEXT,
	periodo TEXT,
	info_nome_papel TEXT,
	info_cotacao TEXT,
	info_tipo TEXT,
	info_data_ult_cotacao TEXT,
	info_data_ult_balanco TEXT,
	info_nome_empresa TEXT,
	info_setor TEXT,
	info_subsetor TEXT,
	info_min_52_semanas TEXT,
	info_max_52_semanas TEXT,
	info_vol_medio_2_meses TEXT,
	info_valor_mercado TEXT,
	info_valor_firma TEXT,
	info_nro_acoes TEXT,
	balanco_ativo_circ TEXT,
	balanco_ativo TEXT,
	balanco_disponibilidades TEXT,
	balanco_div_bruta TEXT,
	balanco_div_liq TEXT,
	balanco_patrimonio_liq TEXT,
	demons_ebit_03_meses TEXT,
	demons_ebit_03_lucro_liq TEXT,
	demons_ebit_03_receita_liq TEXT,
	demons_ebit_12_meses TEXT,
	demons_ebit_12_lucro_liq TEXT,
	demons_ebit_12_receita_liq TEXT,
	oscilacoes_dia TEXT,
	oscilacoes_mes TEXT,
	oscilacoes_ult_30_dias TEXT,
	oscilacoes_ult_12_meses TEXT,
	oscilacoes_ano_2021 TEXT,
	oscilacoes_ano_2020 TEXT,
	oscilacoes_ano_2019 TEXT,
	oscilacoes_ano_2018 TEXT,
	oscilacoes_ano_2017 TEXT,
	oscilacoes_ano_2016 TEXT,
	oscilacoes_ano_2015 TEXT,
	oscilacoes_ano_2014 TEXT,
	fund_cresc_5_anos TEXT,
	fund_div_bruta_por_patrim_liq TEXT,
	fund_dividend_yield TEXT,
	fund_ebit_por_ativo TEXT,
	fund_enter_value_por_ebit TEXT,
	fund_enter_value_por_ebitda TEXT,
	fund_giro_ativos TEXT,
	fund_liq_corrente TEXT,
	fund_lucro_por_acao TEXT,
	fund_margem_bruta TEXT,
	fund_margem_ebit TEXT,
	fund_margem_liq TEXT,
	fund_roe TEXT,
	fund_roic TEXT,
	fund_vpa TEXT,
	fund_preco_acao_por_lucro TEXT,
	fund_preco_acao_por_valor_patrim TEXT,
	fund_preco_acao_por_ebit TEXT,
	fund_price_sales_ratio TEXT,
	fund_preco_acao_por_ativos_totais TEXT,
	fund_preco_acao_por_ativos_circ TEXT,
	fund_preco_acao_por_capital_giro TEXT,
	data_referencia DATE DEFAULT DATE(NOW()),
	created_at DATE DEFAULT NOW()
);