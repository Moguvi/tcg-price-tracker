--
-- PostgreSQL database dump
--

\restrict Ped2JeAbM9XWJ0Jh4PoW9jAWQnyb5wbs6MhvUX9xqhqhdWPLJlPcTvvX0yR9Qoo

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: his_precos_ligamagic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.his_precos_ligamagic (
    data date,
    carta text,
    edicao text,
    ano integer,
    raridade text,
    tipo_carta text,
    preco_min numeric,
    preco_medio numeric
);


ALTER TABLE public.his_precos_ligamagic OWNER TO postgres;

--
-- Name: lista_cartas_dia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_cartas_dia (
    dia text,
    carta text,
    preco_min numeric,
    variacao numeric
);


ALTER TABLE public.lista_cartas_dia OWNER TO postgres;

--
-- Data for Name: his_precos_ligamagic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.his_precos_ligamagic (data, carta, edicao, ano, raridade, tipo_carta, preco_min, preco_medio) FROM stdin;
2026-03-16	Badgermole Cub	TLA	2025	Mítica	Normal	295	354
2026-03-16	Badgermole Cub	TLA	2025	Mítica	Foil	319.75	421.3
2026-03-16	Avatar: The Last Airbender	fntla	2025	Rara	Normal	295	354
2026-03-16	Edge of Eternities	Borderless Triumphant	2025	Rara	Foil	13	29.99
2026-03-16	Edge of Eternities	EOE	2025	Rara	Normal	10.9	19.8
2026-03-16	Edge of Eternities	EOE	2025	Rara	Foil	11.7	24.27
2026-03-16	Autoridade dos Cônsules	Kaladesh Remastered	2020	Rara	Normal	24.9	25.5
2026-03-16	Autoridade dos Cônsules	Kaladesh Remastered	2020	Rara	Foil	50	25
2026-03-16	Autoridade dos Cônsules	Mystery Booster 2	2024	Rara	Normal	24.99	25.9
2026-03-16	Autoridade dos Cônsules	Mystery Booster 2	2024	Rara	Foil	25	27.5
2026-03-16	Frisson das Possibilidades	Dominária Unida	2022	Comum	Normal	0.1	0.25
2026-03-16	Frisson das Possibilidades	Dominária Unida	2022	Comum	Foil	0.25	1.25
2026-03-16	The Masamune	FINAL FANTASY (Borderless Woodblock)	2025	Rara (FIN)	Normal	2.8	9.15
2026-03-16	Charco da Procriação	Edge of Eternities	2025	Rara	Normal	31.89	51.83
2026-03-16	Charco da Procriação	Lealdade em Ravnica	2019	Rara	Normal	36	36
2026-03-16	Charco da Procriação	Portões Violados	2013	Rara	Normal	34.8	34.8
2026-03-16	Charco da Procriação	Ravnica Remasterizada	2024	Rara	Foil	34	34
2026-03-16	Charco da Procriação	Lealdade em Ravnica	2019	Rara	Foil	36	36
2026-03-16	Charco da Procriação	Portões Violados	2013	Rara	Foil	34	34
2026-03-16	Fonte Santificada	BRECL	2026	Rara	Normal	73.9	104.14
2026-03-16	Fonte Santificada	ECL	2026	Rara	Foil	139.39	179.9
2026-03-16	Fonte Santificada	RNA	2019	Rara	Normal	30	30
2026-03-16	Fonte Santificada	RTR	2012	Rara	Normal	33	29.7
2026-03-16	Fonte Santificada	RTR	2012	Rara	Foil	35	31.5
2026-03-16	Quantum Riddler	EOE	2025	Mítica	Normal	274.9	317.69
2026-03-16	Quantum Riddler	EOE	2025	Mítica	Foil	329.99	358.64
2026-03-16	Edge of Eternities	SCEOE	2025	Mítica	Normal	270	290
2026-03-16	Edge of Eternities	SCEOE	2025	Mítica	Foil	285	295.96
2026-03-16	Demonic Counsel	dsk	2024	Rara	Normal	9.49	17.88
2026-03-16	Demonic Counsel	dsk	2024	Rara	Foil	12.99	24.2
2026-03-16	Demonic Counsel	pfdsk	2024	Rara	Normal	15.49	12.39
2026-03-16	Demonic Counsel	pfdsk	2024	Rara	Foil	12.47	12.47
2026-03-16	Edge of Eternities (Borderless Triumphant)	bteoe	2025	Rara	Normal	16.25	28.89
2026-03-16	Edge of Eternities	eoe	2025	Rara	Normal	16.25	28.89
2026-03-16	Edge of Eternities	eoe	2025	Rara	Foil	19	18.05
2026-03-16	Pântano (#281)	Edição de 2024	2024	Rara	Normal	0	0
2026-03-16	Mightform Harmonizer	eoe	2025	Rara	Foil	19.9	22
2026-03-16	Pântano (#312)	Edição de 2024	2024	Rara	Normal	13.99	339.9
2026-03-16	Pântano (#307)	Edição de 2024	2024	Rara	Normal	9.99	20
2026-03-16	Pântano (#276)	Edição de 2024	2024	Rara	Normal	0.49	8.29
2026-03-16	Pântano (#271)	Edição de 2024	2024	Rara	Normal	0.94	0.94
2026-03-16	Haliya, Guided by Light	Edge of Eternities	2025	Rara	Normal	10.9	19.8
2026-03-16	Haliya, Guided by Light	Edge of Eternities	2025	Rara	Foil	11.7	24.27
2026-03-16	Edge of Eternities	Borderless Triumphant	2025	Rara	Normal	29.99	39.5
2026-03-16	Autoridade dos Cônsules	FINAL FANTASY Commander	2025	Rara	Normal	21.89	31.45
2026-03-16	Autoridade dos Cônsules	FINAL FANTASY Commander	2025	Rara	Foil	59.9	62.92
2026-03-16	Autoridade dos Cônsules	Foundations	2024	Rara	Normal	22	23.95
2026-03-16	Autoridade dos Cônsules	Foundations	2024	Rara	Foil	25	25.29
2026-03-16	Autoridade dos Cônsules	Kaladesh	2016	Rara	Normal	22	24.75
2026-03-16	Autoridade dos Cônsules	Kaladesh	2016	Rara	Foil	50	25
2026-03-16	Frisson das Possibilidades	Foundations	2024	Comum	Normal	0.13	0.55
2026-03-16	Frisson das Possibilidades	Foundations	2024	Comum	Foil	0.25	1.32
2026-03-16	Frisson das Possibilidades	Phyrexia: Tudo será um	2023	Comum	Normal	0.1	0.1
2026-03-16	Frisson das Possibilidades	Phyrexia: Tudo será um	2023	Comum	Foil	0.1	0.1
2026-03-16	Frisson das Possibilidades	Core Set 2021	2020	Comum	Normal	0.25	0.13
2026-03-16	Frisson das Possibilidades	Core Set 2021	2020	Comum	Foil	0.1	0.1
2026-03-16	Caso do Laboratório Saqueado	Assassinato na Mansão Karlov	2024	Rara	Normal	1.49	4.15
2026-03-16	The Masamune	FINAL FANTASY (Borderless Woodblock)	2025	Rara (FIN)	Foil	9	18.02
2026-03-16	The Masamune	FINAL FANTASY	2025	Rara (FIN)	Normal	2.8	9.15
2026-03-16	The Masamune	FINAL FANTASY	2025	Rara (FIN)	Foil	9	18.02
2026-03-16	Matoya, Archon Elder	FINAL FANTASY (Extended Art)	2025	Rara	Normal	5	10.49
2026-03-16	Matoya, Archon Elder	FINAL FANTASY (Extended Art)	2025	Rara	Foil	8	18.44
2026-03-16	Matoya, Archon Elder	FINAL FANTASY	2025	Rara	Foil	6.94	6.94
2026-03-16	Charco da Procriação	Edge of Eternities (Viewport Lands)	2025	Rara	Normal	31.89	51.83
2026-03-16	Matoya, Archon Elder	FINAL FANTASY	2025	Rara	Normal	6.5	6.5
2026-03-16	Charco da Procriação	Edge of Eternities (Viewport Lands Galaxy Foil)	2025	Rara	Foil	32.54	59.7
2026-03-16	Charco da Procriação	Ravnica Remasterizada	2024	Rara	Normal	34.8	41.05
2026-03-16	Charco da Procriação	Insurreição	2006	Rara	Normal	36.31	36.5
2026-03-16	Charco da Procriação	Insurreição	2006	Rara	Foil	34	34.5
2026-03-16	Kitsa, Otterball Elite	blb	2024	Mítica	Normal	17.72	31.23
2026-03-16	Kitsa, Otterball Elite	blb	2024	Mítica	Foil	25.65	37.88
2026-03-16	Bloomburrow	swblb	2024	Rara	Normal	44.99	31.23
2026-03-16	Bloomburrow	blb	2024	Rara	Foil	26.9	25.9
2026-03-16	Eterificar	Foundations	2024	Incomum	Normal	3.79	6.57
2026-03-16	Eterificar	Portões Violados	2013	Incomum	Normal	3.05	3.9
2026-03-16	Eterificar	Foundations	2024	Incomum	Foil	12.59	7
2026-03-16	Eterificar	Duel Decks: Kiora vs. Elspeth	2015	Incomum	Normal	4.49	4.13
2026-03-16	Avatar: The Last Airbender	tla	2025	Rara	Normal	76	76
2026-03-16	Pântano (#294)	Edição de 2024	2024	Rara	Normal	0.83	9
2026-03-16	Pântano (#214)	Edição de 2024	2024	Rara	Normal	8.4	37.99
2026-03-16	Pântano (#284)	Edição de 2024	2024	Rara	Normal	0.22	1.25
2026-03-16	Pântano (#0033)	Edição de 2024	2024	Rara	Normal	69.89	100
2026-03-16	Pântano (#59)	Edição de 2024	2024	Rara	Normal	2	2
2026-03-16	Pântano (#302)	Edição de 2024	2024	Rara	Normal	0.63	4.99
2026-03-16	Pântano (#301)	Edição de 2024	2024	Rara	Normal	0.54	4.99
2026-03-16	Pântano (#300)	Edição de 2024	2024	Rara	Normal	0.75	5
2026-03-16	Pântano (#397)	Edição de 2024	2024	Rara	Normal	0	0
2026-03-16	Pântano (#398)	Edição de 2024	2024	Rara	Normal	0.94	0.94
2026-03-16	Pântano (#282)	Edição de 2024	2024	Rara	Normal	3.8	3.8
2026-03-16	Pântano (#272)	Edição de 2024	2024	Rara	Normal	0	0
2026-03-16	Pântano (#289)	Edição de 2024	2024	Rara	Normal	27.99	40
2026-03-16	Noctis, Prince of Lucis	FINAL FANTASY (Borderless Pose Surge Foil)	2025	Rara	Foil	9.5	15.53
2026-03-16	Noctis, Prince of Lucis	FINAL FANTASY (Borderless Pose)	2025	Rara	Foil	9.5	15.53
2026-03-16	Noctis, Prince of Lucis	FINAL FANTASY (Extended Art)	2025	Rara	Foil	9.5	15.53
2026-03-16	Noctis, Prince of Lucis	FINAL FANTASY	2025	Rara	Foil	9.5	15.53
2026-03-16	Noctis, Prince of Lucis	FINAL FANTASY	2025	Rara	Normal	3.69	7.98
2026-03-16	Raise the Past	FDN	2024	Rara	Normal	12.9	18.24
2026-03-16	Raise the Past	FDN	2024	Rara	Foil	15	22.33
2026-03-16	Foundations	mffdn	2024	Rara	Normal	12.9	18.24
2026-03-16	Foundations	mffdn	2024	Rara	Foil	15	22.33
2026-03-16	Foundations	blfdn	2024	Rara	Normal	12.94	18.24
2026-03-16	Foundations	blfdn	2024	Rara	Foil	15.53	22.33
2026-03-16	Foundations	eafdn	2024	Rara	Normal	14.75	24
2026-03-16	Foundations	eafdn	2024	Rara	Foil	15.89	24
2026-03-16	Recife Inquieto	BLCI	2023	Rara	Normal	14.99	24.21
2026-03-16	Recife Inquieto	BLCI	2023	Rara	Foil	19.97	25.04
2026-03-16	Restless Reef	LCI	2023	Rara	Normal	14.9	29.99
2026-03-16	Restless Reef	LCI	2023	Rara	Foil	19.16	33.67
2026-03-16	Restless Reef	BLCI	2023	Rara	Normal	15	25
2026-03-16	Restless Reef	BLCI	2023	Rara	Foil	20.9	27
2026-03-16	A Sorte Grande	rfbig	2024	Rara	Normal	63.9	84.04
2026-03-16	Caso do Laboratório Saqueado	Assassinato na Mansão Karlov	2024	Rara	Foil	2.49	2.9
2026-03-16	Desencavar	Innistrad: Voto Carmesim	2021	Rara	Normal	4.54	4.9
2026-03-16	Controle de Peste	big	2024	Mítica	Normal	54.99	94.18
2026-03-16	Controle de Peste	big	2024	Mítica	Foil	147.99	181.23
2026-03-16	A Sorte Grande	eabig	2024	Rara	Normal	199.9	94.18
2026-03-16	Banner of Kinship	Foundations	2024	Rara	Normal	24.8	38.66
2026-03-16	A Sorte Grande	vfbig	2024	Rara	Normal	60.49	64.75
2026-03-16	Controle de Peste	BIG	2024	Mítica	Normal	54.99	94.18
2026-03-16	Controle de Peste	BIG	2024	Mítica	Foil	147.99	181.23
2026-03-16	A Sorte Grande	big	2024	Rara	Foil	89.28	125.6
2026-03-16	A Sorte Grande	Extended Art	2024	Rara	Normal	94.18	94.18
2026-03-16	A Sorte Grande	Tratamento Cofre	2024	Rara	Normal	199.9	250
2026-03-16	Banner of Kinship	Foundations	2024	Rara	Foil	28	41.12
2026-03-16	As Cavernas Perdidas de Ixalan	lci	2023	Rara	Promo	235	239.9
2026-03-16	Banner of Kinship	Foundations (Bordeless Mana Foil)	2024	Rara	Foil	28.1	41.12
2026-03-16	As Cavernas Perdidas de Ixalan	lci	2023	Rara	Foil	399.99	399.99
2026-03-16	As Cavernas Perdidas de Ixalan (Borderless)	blci	2023	Rara	Foil	399.9	399.9
2026-03-16	Redirect Lightning	Avatar: The Last Airbender	2025	Rara	Normal	39.46	54.45
2026-03-16	Redirect Lightning	Avatar: The Last Airbender	2025	Rara	Foil	44.9	67.92
2026-03-16	Redirect Lightning	Avatar: The Last Airbender	2025	Rara	Foil Pre Release	45	45
2026-03-16	Edge of Eternities	Edge of Eternities	2025	Rara	Normal	10.9	19.8
2026-03-16	Edge of Eternities	Edge of Eternities	2025	Rara	Foil	11.7	24.27
2026-03-16	Jidoor, Aristocratic Capital // Overture	FINAL FANTASY	2025	Rara	Normal	7.79	13.18
2026-03-16	Jidoor, Aristocratic Capital // Overture	FINAL FANTASY	2025	Rara	Foil	9.81	19.19
2026-03-16	Jidoor, Aristocratic Capital // Overture	Borderless - FINAL FANTASY	2025	Rara	Normal	12	13.18
2026-03-16	Jidoor, Aristocratic Capital // Overture	Borderless - FINAL FANTASY	2025	Rara	Foil	14	23.5
2026-03-16	Frisson das Possibilidades	Trono de Eldraine	2019	Comum	Normal	0.1	0.1
2026-03-16	Frisson das Possibilidades	Trono de Eldraine	2019	Comum	Foil	0.1	0.1
2026-03-16	Frisson das Possibilidades	Mystery Booster	2020	Comum	Normal	0.1	0.1
2026-03-16	Frisson das Possibilidades	Mystery Booster	2020	Comum	Foil	0.1	0.1
2026-03-16	Banner of Kinship	Foundations (Extended Art)	2024	Rara	Foil	29.5	41.12
2026-03-16	Banner of Kinship	Foundations (Borderless)	2024	Rara	Foil	29.49	41.12
2026-03-16	Charco da Procriação	Ravnica Remasterizada (Serialized)	2024	Rara	Foil	36	36.56
2026-03-16	Fonte Santificada	Lorwyn Eclipsed	2026	Rara	Normal	73.9	104.14
2026-03-16	The Earth Crystal	FINAL FANTASY (Borderless Woodblock)	2025	Rara	Foil	50	50
2026-03-16	The Earth Crystal	FINAL FANTASY (Borderless Woodblock)	2025	Rara	Normal	20	24
2026-03-16	The Earth Crystal	FINAL FANTASY	2025	Rara	Foil	31.5	43.07
2026-03-16	The Earth Crystal	FINAL FANTASY	2025	Rara	Normal	22.4	32.58
2026-03-16	Recife Inquieto	LCI	2023	Rara	Normal	14.9	24.21
2026-03-16	Recife Inquieto	LCI	2023	Rara	Foil	19.16	25.04
2026-03-16	As Cavernas Perdidas de Ixalan	lci	2023	Rara	Normal	14.99	29.99
2026-03-16	As Cavernas Perdidas de Ixalan (Borderless)	blci	2023	Rara	Normal	16.9	32.67
2026-03-16	A Sorte Grande	big	2024	Rara	Normal	63.9	84.04
2026-03-16	Desencavar	Innistrad: Voto Carmesim	2021	Rara	Foil	5	5.04
2026-03-16	Desencavar	The List	2020	Rara	Normal	5.7	4.85
2026-03-16	The Legend of Roku	TLA	2025	Mítica	Normal	66.85	86.64
2026-03-16	The Legend of Roku	TLA	2025	Mítica	Foil	89.95	100.59
2026-03-16	Fonte Santificada	Lorwyn Eclipsed	2026	Rara	Foil	139.39	179.9
2026-03-16	Fonte Santificada	Insurreição	2006	Rara	Normal	33	33
2026-03-16	Fonte Santificada	Retorno a Ravnica	2012	Rara	Normal	29.7	30
2026-03-16	Fonte Santificada	Lealdade em Ravnica	2019	Rara	Normal	30	30
2026-03-16	Arquivo Meticuloso	mkm	2024	Rara	Normal	103.86	140.41
2026-03-16	Arquivo Meticuloso	mkm	2024	Rara	Foil	200	200
2026-03-16	Assassinato na Mansão Karlov	mkm	2024	Rara	Normal	109.89	109
2026-03-16	Assassinato na Mansão Karlov	Borderless	2024	Rara	Normal	119	140
2026-03-16	Tecelão da Matéria Olteca	A Sorte Grande	2024	Mítica	Normal	1.35	7.78
2026-03-16	Tecelão da Matéria Olteca	A Sorte Grande	2024	Mítica	Foil	10	14.5
2026-03-16	Tecelão da Matéria Olteca	A Sorte Grande (Extended Art)	2024	Mítica	Normal	12.99	24.95
2026-03-16	Tecelão da Matéria Olteca	A Sorte Grande (Tratamento Cofre)	2024	Mítica	Normal	1	1
2026-03-16	Tecelão da Matéria Olteca	Os Fora da Lei de Encruzilhada do Trovão (Promo)	2024	Mítica	Normal	0.84	1.25
2026-03-16	Bloomburrow	blb	2024	Rara	Normal	18.61	30
2026-03-16	Vibrance	ECL	2026	Mítica	Normal	47	68.5
2026-03-16	Vibrance	ECL	2026	Mítica	Foil	60	83.5
2026-03-16	Vibrance	Lorwyn Eclipsed	2026	Mítica	Normal	47	68.5
2026-03-16	Vibrance	Lorwyn Eclipsed	2026	Mítica	Foil	60	83.5
2026-03-16	Arena Phyrexiana	Secret Lair Drop Series: Secret Lair x Furby: The Gathering (Confetti Foil)	2025	Rara	Foil	0	0
2026-03-16	Arena Phyrexiana	Secret Lair Drop Series: Secret Lair x Furby: The Gathering	2025	Rara	Normal	0	0
2026-03-16	Arena Phyrexiana	Foundations (Bordeless Mana Foil)	2024	Rara	Foil	0	0
2026-03-16	Arena Phyrexiana	Foundations (Borderless)	2024	Rara	Normal	0	0
2026-03-16	Arena Phyrexiana	Foundations (Promos)	2024	Rara	Foil	0	0
2026-03-16	Arena Phyrexiana	Foundations	2024	Rara	Normal	22.4	29.03
2026-03-16	Arena Phyrexiana	Assassinato na Mansão Karlov Commander	2024	Rara	Normal	0	0
2026-03-16	Arena Phyrexiana	Phyrexia: Tudo será um (Promo)	2023	Rara	Foil	23.99	0
2026-03-16	Arena Phyrexiana	Phyrexia: Tudo será um (Extended Art)	2023	Rara	Normal	0	0
2026-03-16	Arena Phyrexiana	Phyrexia: Tudo será um	2023	Rara	Normal	20	23.54
2026-03-16	Arena Phyrexiana	Commander Collection: Black	2021	Rara	Normal	23.95	0
2026-03-16	Arena Phyrexiana	Mystery Booster	2020	Rara	Normal	0	0
2026-03-16	Arena Phyrexiana	Conspiracy: Take the Crown	2016	Rara	Normal	29	23.2
2026-03-16	Arena Phyrexiana	Commander 2015	2015	Rara	Normal	0	0
2026-03-16	Valgavoth, Terror Eater	dsk	2024	Mítica	Normal	73.35	89.32
2026-03-16	Valgavoth, Terror Eater	dsk	2024	Mítica	Foil	89.35	109.69
2026-03-16	Noctumbra: A Casa dos Horrores	drdsk	2024		Normal	0	0
2026-03-16	Noctumbra: A Casa dos Horrores	dedsk	2024		Normal	0	0
2026-03-16	Noctumbra: A Casa dos Horrores	dsk	2024		Normal	0	0
2026-03-16	Mightform Harmonizer	Edge of Eternities (Borderless Triumphant)	2025	Rara	Normal	16.25	28.89
2026-03-16	Mightform Harmonizer	Edge of Eternities	2025	Rara	Normal	16.25	28.89
2026-03-16	Mightform Harmonizer	Edge of Eternities	2025	Rara	Foil	17.68	35.68
2026-03-16	Mightform Harmonizer	Edge of Eternities	2025	Rara	Promo	15.48	21.5
2026-03-16	Mightform Harmonizer	Edge of Eternities (Borderless Triumphant)	2025	Rara	Foil	17.68	35.68
2026-03-16	Pântano (#312)	Edição 2024	2024	Rara	Normal	13.99	339.9
2026-03-16	Pântano (#307)	Edição 2024	2024	Rara	Normal	9.99	20
2026-03-16	Pântano (#281)	Edição 2024	2024	Rara	Normal	0.75	8.29
2026-03-16	Pântano (#276)	Edição 2024	2024	Rara	Normal	0.49	8.29
2026-03-16	Pântano (#271)	Edição 2024	2024	Rara	Normal	0.23	4.9
2026-03-16	Pântano (#294)	Edição 2024	2024	Rara	Normal	0.83	9
2026-03-16	Pântano (#214)	Edição 2024	2024	Rara	Normal	8.4	37.99
2026-03-16	Pântano (#284)	Edição 2024	2024	Rara	Normal	0.22	1.25
2026-03-16	Pântano (#289)	Edição 2024	2024	Rara	Normal	0.75	4.99
2026-03-16	Pântano (#0033)	Edição 2024	2024	Rara	Normal	69.89	100
2026-03-16	Pântano (#59)	Edição 2024	2024	Rara	Normal	2	2
2026-03-16	Pântano (#302)	Edição 2024	2024	Rara	Normal	0.63	4.99
2026-03-16	Pântano (#301)	Edição 2024	2024	Rara	Normal	0.54	4.99
2026-03-16	Pântano (#300)	Edição 2024	2024	Rara	Normal	0.75	5
2026-03-16	Pântano (#397)	Edição 2024	2024	Rara	Normal	0	0
2026-03-16	Pântano (#398)	Edição 2024	2024	Rara	Normal	0.94	0.94
2026-03-16	Pântano (#282)	Edição 2024	2024	Rara	Normal	3.8	3.8
2026-03-16	Noctis, Prince of Lucis	Borderless Pose Surge Foil	2025	Rara	Foil	9.5	15.53
2026-03-16	Noctis, Prince of Lucis	Borderless Pose	2025	Rara	Normal	3.69	7.98
2026-03-16	Noctis, Prince of Lucis	Extended Art	2025	Rara	Normal	29.9	29.9
2026-03-16	Noctis, Prince of Lucis	FIN	2025	Rara	Normal	3.69	4
2026-03-16	Caldeirão de Almas de Agatha	WOE	2023	Mítica	Normal	114	176.77
2026-03-16	Caldeirão de Almas de Agatha	WOE	2023	Mítica	Foil	124.48	198.83
2026-03-16	Terras Selvagens de Eldraine	woe	2023	Rara	Normal	107.9	114
2026-03-16	Terras Selvagens de Eldraine	exwoe	2023	Rara	Normal	114.99	119
2026-03-16	Terras Selvagens de Eldraine	woe	2023	Rara	Foil	124.49	125
2026-03-16	Terras Selvagens de Eldraine (Extended Art)	exwoe	2023	Rara	Foil	124.48	198.83
2026-03-16	Wistfulness	Lorwyn Eclipsed (Borderless)	2026	Mítica	Normal	93.75	137.2
2026-03-16	Wistfulness	Lorwyn Eclipsed (Borderless)	2026	Mítica	Foil	159.79	200
2026-03-16	Wistfulness	Lorwyn Eclipsed	2026	Mítica	Foil	200	286
2026-03-16	Wistfulness	Lorwyn Eclipsed	2026	Mítica	Normal	99	100.99
2026-03-16	A Sorte Grande (Extended Art)	eabig	2024	Rara	Normal	63.9	84.04
2026-03-16	A Sorte Grande (Tratamento Cofre)	vfbig	2024	Rara	Normal	89.28	125.6
2026-03-16	A Sorte Grande (Metalizados Elevados)	rfbig	2024	Rara	Normal	63.9	84.04
2026-03-16	A Sorte Grande (Extended Art)	eabig	2024	Rara	Foil	89.28	125.6
2026-03-16	A Sorte Grande (Tratamento Cofre)	vfbig	2024	Rara	Foil	89.28	125.6
2026-03-16	A Sorte Grande (Metalizados Elevados)	rfbig	2024	Rara	Foil	89.28	125.6
2026-03-16	Desencavar	Innistrad: Double Feature	2022	Rara	Normal	3.95	6.16
2026-03-16	Desencavar	Innistrad: Double Feature	2022	Rara	Foil	5.29	9.58
2026-03-16	Desencavar	Innistrad: Voto Carmesim (Variantes)	2021	Rara	Normal	4.99	4.99
2026-03-16	Badgermole Cub	Avatar: The Last Airbender	2025	Mítica	Normal	295	354
2026-03-16	Badgermole Cub	Avatar: The Last Airbender	2025	Mítica	Foil	319.75	421.3
2026-03-16	Badgermole Cub	Avatar: The Last Airbender (Field Notes)	2025	Mítica	Normal	295	354
2026-03-16	Badgermole Cub	Avatar: The Last Airbender (Field Notes)	2025	Mítica	Foil	319.75	421.3
2026-03-16	Phoenix Fleet Airship	TLA	2025	Mítica	Normal	16.99	24.99
2026-03-16	Phoenix Fleet Airship	TLA	2025	Mítica	Foil	19.9	33.08
2026-03-16	Phoenix Fleet Airship	FNTLA	2025	Mítica	Normal	16.99	24.99
2026-03-16	Phoenix Fleet Airship	FNTLA	2025	Mítica	Foil	19.9	33.08
2026-03-16	Floresta Karplusana	Edge of Eternities Commander	2025	Rara (FIN)	Normal	9	13.07
2026-03-16	Floresta Karplusana	Edge of Eternities Commander	2025	Rara (FIN)	Foil	18	32
2026-03-16	Floresta Karplusana	Aetherdrift Commander	2025	Rara	Normal	9.95	9.95
2026-03-16	Floresta Karplusana	Tarkir: Dragonstorm Commander	2025	Rara	Normal	9.95	9.95
2026-03-16	Floresta Karplusana	Bloomburrow Commander	2024	Rara	Normal	9.99	10
2026-03-16	Floresta Karplusana	Modern Horizons 3 Commander	2024	Rara	Normal	10	10
2026-03-16	Floresta Karplusana	Dominária Unida	2022	Rara	Normal	9.95	9.95
2026-03-16	Onisciência	Foundations (Bordeless Mana Foil)	2024	Mítica	Foil	31.99	51.97
2026-03-16	Onisciência	Foundations (Borderless)	2024	Mítica	Normal	29	42.67
2026-03-16	Onisciência	Foundations	2024	Mítica	Normal	29	42.67
2026-03-16	Onisciência	Magic 2013	2012	Mítica	Normal	32.89	36
2026-03-16	Onisciência	Core Set 2019	2018	Mítica	Normal	29.7	33.86
2026-03-16	Onisciência	Foundations	2024	Mítica	Foil	34.4	30.96
2026-03-16	Inseto 1/1	Innistrad: Voto Carmesim	2021	Token	Normal	0.23	0.54
2026-03-16	Inseto 1/1	Innistrad: Voto Carmesim	2021	Token	Foil	0.25	0.25
2026-03-16	Inseto 1/1	Modern Horizons 2	2021	Token	Normal	0.25	0.23
2026-03-16	Inseto 1/1	Noctumbra: A Casa dos Horrores	2024	Token	Normal	0.24	0.25
2026-03-16	Inseto 1/1	Dominaria Remastered	2023	Token	Normal	0.25	0.23
2026-03-16	Inseto 1/1	Foundations	2024	Token	Normal	0.1	0.2
2026-03-16	Ozai, the Phoenix King	Avatar: The Last Airbender (Scene Cards)	2025	Mítica	Normal	19.35	35.83
2026-03-16	Ozai, the Phoenix King	Avatar: The Last Airbender (Scene Cards)	2025	Mítica	Foil	31	45.46
2026-03-16	Ozai, the Phoenix King	Avatar: The Last Airbender (Battle Pose)	2025	Mítica	Normal	19.95	19.35
2026-03-16	Ozai, the Phoenix King	Avatar: The Last Airbender (Battle Pose)	2025	Mítica	Foil	31	45.46
2026-03-16	Ozai, the Phoenix King	Avatar: The Last Airbender	2025	Mítica	Normal	19.95	19.35
2026-03-16	Ozai, the Phoenix King	Avatar: The Last Airbender	2025	Mítica	Foil	31	45.46
2026-03-16	Terror dos Picos	Magic Spotlight Promos	2025	Mítica	Normal	175	187.82
2026-03-16	Terror dos Picos	Os Fora da Lei de Encruzilhada do Trovão (Extended Art)	2024	Mítica	Foil	169.9	205.05
2026-03-16	Terror dos Picos	Os Fora da Lei de Encruzilhada do Trovão	2024	Mítica	Normal	175	187.82
2026-03-16	Terror dos Picos	Core Set 2021 (Variantes)	2020	Mítica	Normal	210	210
2026-03-16	Terror dos Picos	Core Set 2021	2020	Mítica	Foil	169.9	205.05
2026-03-16	Quantum Riddler	Edge of Eternities (Surreal Space Cards)	2025	Mítica	Normal	274.9	317.69
2026-03-16	Quantum Riddler	Edge of Eternities (Surreal Space Cards)	2025	Mítica	Foil	329.99	358.64
2026-03-16	Demonic Counsel	Noctumbra: A Casa dos Horrores	2024	Rara	Normal	9.49	17.88
2026-03-16	Demonic Counsel	Noctumbra: A Casa dos Horrores	2024	Rara	Foil	12.99	24.2
2026-03-16	Demonic Counsel	Noctumbra: A Casa dos Horrores (Paranormal Frame)	2024	Rara	Normal	15.49	12.39
2026-03-16	Demonic Counsel	Noctumbra: A Casa dos Horrores (Paranormal Frame)	2024	Rara	Foil	12.47	12
2026-03-16	Foundations (Bordeless Mana Foil)	mffdn	2024	Rara	Foil	29.94	41.38
2026-03-16	Foundations (Borderless)	blfdn	2024	Rara	Normal	33.89	33.89
2026-03-16	Foundations (Extended Art)	eafdn	2024	Rara	Foil	29.95	41.38
2026-03-16	Foundations	fdn	2024	Rara	Normal	22	36.7
2026-03-16	Scrawling Crawler	fdn	2024	Rara	Normal	22	36.7
2026-03-16	Scrawling Crawler	fdn	2024	Rara	Foil	29.94	41.38
2026-03-16	Kiora, the Rising Tide	Foundations (Bordeless Mana Foil)	2024	Rara	Foil	7.74	16.9
2026-03-16	Kiora, the Rising Tide	Foundations (Borderless)	2024	Rara	Foil	7.74	16.9
2026-03-16	Kiora, the Rising Tide	Foundations (Extended Art)	2024	Rara	Foil	7.74	16.9
2026-03-16	Kiora, the Rising Tide	Foundations	2024	Rara	Normal	4.79	10.89
2026-03-16	Elspeth, Storm Slayer	Tarkir: Dragonstorm	2025	Mítica	Normal	174.99	206.42
2026-03-16	Elspeth, Storm Slayer	Tarkir: Dragonstorm	2025	Mítica	Foil	190.94	210.48
2026-03-16	Tarkir: Dragonstorm	Tarkir: Dragonstorm (Ghostfire Halo Foil)	2025	Rara	Foil	190.94	210.48
2026-03-16	Tarkir: Dragonstorm	Tarkir: Dragonstorm (Ghostfire)	2025	Rara	Normal	174.99	206.42
2026-03-16	Tarkir: Dragonstorm	Tarkir: Dragonstorm (Borderless)	2025	Rara	Normal	175	187.5
2026-03-16	Tarkir: Dragonstorm	Tarkir: Dragonstorm	2025	Rara	Normal	174.99	206.42
2026-03-16	Terror Sanguinário	Edição 1	2021	Rara	Normal	10	15
2026-03-16	Terror Sanguinário	Edição 1	2021	Rara	Foil	25	30
2026-03-16	Terror Sanguinário	Edição 2	2022	Incomum	Normal	5	7.5
2026-03-16	Terror Sanguinário	Edição 2	2022	Incomum	Foil	12	15
2026-03-16	Terror Sanguinário	Edição 3	2023	Rara	Normal	20	25
2026-03-16	Terror Sanguinário	Edição 3	2023	Rara	Foil	35	40
2026-03-16	Raise the Past	fdn	2024	Rara	Normal	12.9	18.24
2026-03-16	Raise the Past	fdn	2024	Rara	Foil	13	23.76
2026-03-16	Guardiã da Florescência	Lorwyn Eclipsed (Japan Showcase Fractured Foil)	2026	Mítica	Foil	2659.91	3000.91
2026-03-16	Guardiã da Florescência	Lorwyn Eclipsed	2026	Mítica	Normal	4500	4500
2026-03-16	Guardiã da Florescência	Double Masters 2022 (Foil Etched)	2022	Rara	Foil	2659.91	3000.91
2026-03-16	Guardiã da Florescência	Double Masters 2022	2022	Rara	Normal	4500	4500
2026-03-16	Guardiã da Florescência	Special Guests	2023	Rara	Normal	4500	4500
2026-03-16	Guardiã da Florescência	Mystery Booster	2020	Rara	Normal	4500	4500
2026-03-16	Appa, Steadfast Guardian	TLA	2025	Mítica	Normal	71.03	99.36
2026-03-16	Appa, Steadfast Guardian	TLA	2025	Mítica	Foil	90	116.92
2026-03-16	Avatar: The Last Airbender	Field Notes	2025	Rara	Normal	140	140
2026-03-16	Avatar: The Last Airbender	tla	2025	Rara	Foil	88	88.75
2026-03-17	Autoridade dos Cônsules	FINAL FANTASY Commander	2025	Rara	Normal	21.89	31.61
2026-03-17	Autoridade dos Cônsules	FINAL FANTASY Commander	2025	Rara	Foil	55.92	59.42
2026-03-17	Autoridade dos Cônsules	Foundations	2024	Rara	Normal	22	24.89
2026-03-17	Autoridade dos Cônsules	Foundations	2024	Rara	Foil	22	25.29
2026-03-17	Autoridade dos Cônsules	Kaladesh	2016	Rara	Normal	23	27.5
2026-03-17	Autoridade dos Cônsules	Kaladesh	2016	Rara	Foil	50	25
2026-03-17	Autoridade dos Cônsules	Kaladesh Remastered	2020	Rara	Normal	21.89	31.61
2026-03-17	Autoridade dos Cônsules	Kaladesh Remastered	2020	Rara	Foil	55.92	25
2026-03-17	Autoridade dos Cônsules	Mystery Booster 2	2024	Rara	Normal	39.99	50
2026-03-17	Autoridade dos Cônsules	Mystery Booster 2	2024	Rara	Foil	28	34
2026-03-17	Twinflame Tyrant	Foundations (Japan Showcase)	2024	Mítica	Normal	114.95	144.44
2026-03-17	Twinflame Tyrant	Foundations (Bordeless Mana Foil)	2024	Mítica	Foil	123	151
2026-03-17	Twinflame Tyrant	Foundations (Borderless)	2024	Mítica	Normal	114.95	144.44
2026-03-17	Twinflame Tyrant	Foundations (Extended Art)	2024	Mítica	Normal	114.95	144.44
2026-03-17	Twinflame Tyrant	Foundations (Japan Showcase Fractured Foil)	2024	Mítica	Foil	119	151.17
2026-03-17	Twinflame Tyrant	Foundations	2024	Mítica	Normal	114.95	145
2026-03-17	Twinflame Tyrant	Foundations	2024	Mítica	Foil	119	151.17
2026-03-17	Jidoor, Aristocratic Capital // Overture	FINAL FANTASY	2025	Rara	Normal	7.79	13.17
2026-03-17	Jidoor, Aristocratic Capital // Overture	FINAL FANTASY	2025	Rara	Foil	9.81	19.14
2026-03-17	Jidoor, Aristocratic Capital // Overture	Borderless - FINAL FANTASY	2025	Rara	Normal	8	12
2026-03-17	Jidoor, Aristocratic Capital // Overture	Borderless - FINAL FANTASY	2025	Rara	Foil	9.99	17
2026-03-17	Banner of Kinship	Foundations (Bordeless Mana Foil)	2024	Rara	Foil	28	31.11
2026-03-17	Banner of Kinship	Foundations (Borderless)	2024	Rara	Foil	29.49	29.49
2026-03-17	Banner of Kinship	Foundations (Extended Art)	2024	Rara	Foil	28.1	28.41
2026-03-17	Banner of Kinship	Foundations	2024	Rara	Foil	29.79	29.9
2026-03-17	Banner of Kinship	Foundations (Bordeless Mana Foil)	2024	Rara	Normal	24.8	38.66
2026-03-17	Banner of Kinship	Foundations (Borderless)	2024	Rara	Normal	24.9	29.99
2026-03-17	Banner of Kinship	Foundations (Extended Art)	2024	Rara	Normal	24.89	28.41
2026-03-17	Banner of Kinship	Foundations	2024	Rara	Normal	24.8	29.9
2026-03-17	Aetherdrift	dft	2025	Rara	Foil	29.9	32.99
2026-03-17	Matoya, Archon Elder	FINAL FANTASY (Extended Art)	2025	Rara	Normal	5.2	10.51
2026-03-17	Matoya, Archon Elder	FINAL FANTASY (Extended Art)	2025	Rara	Foil	8	18.37
2026-03-17	Matoya, Archon Elder	FINAL FANTASY	2025	Rara	Normal	29.9	29.9
2026-03-17	Matoya, Archon Elder	FINAL FANTASY	2025	Rara	Foil	40	40
2026-03-17	Fonte Santificada	Lorwyn Eclipsed	2026	Rara	Normal	73.9	104.15
2026-03-17	Fonte Santificada	Lorwyn Eclipsed	2026	Rara	Foil	139.39	177.83
2026-03-17	Fonte Santificada	Ravnica Remasterizada	2024	Rara	Normal	35	30.52
2026-03-17	Fonte Santificada	Ravnica Remasterizada	2024	Rara	Foil	42	39
2026-03-17	Fonte Santificada	Retorno a Ravnica	2012	Rara	Normal	30	35.9
2026-03-17	Fonte Santificada	Retorno a Ravnica	2012	Rara	Foil	33	31.25
2026-03-17	Fonte Santificada	Lealdade em Ravnica	2019	Rara	Normal	30	32.93
2026-03-17	Kutzil, Malamet Exemplar	As Cavernas Perdidas de Ixalan	2023	Incomum	Normal	16	22.54
2026-03-17	Kutzil, Malamet Exemplar	As Cavernas Perdidas de Ixalan	2023	Incomum	Foil	22.95	22.96
2026-03-17	Kutzil, Malamet Exemplar	As Cavernas Perdidas de Ixalan (Showcase)	2023	Incomum	Normal	14.48	16
2026-03-17	Kutzil, Malamet Exemplar	As Cavernas Perdidas de Ixalan (Showcase)	2023	Incomum	Foil	18.9	19.25
2026-03-17	Tecelão da Matéria Olteca	A Sorte Grande	2024	Mítica	Normal	1.35	7.78
2026-03-17	Tecelão da Matéria Olteca	A Sorte Grande	2024	Mítica	Foil	10	14.5
2026-03-17	Tecelão da Matéria Olteca	A Sorte Grande (Extended Art)	2024	Mítica	Normal	12.99	24.95
2026-03-17	Tecelão da Matéria Olteca	A Sorte Grande (Tratamento Cofre)	2024	Mítica	Foil	0.99	0.99
2026-03-17	Tecelão da Matéria Olteca	Os Fora da Lei de Encruzilhada do Trovão (Promo)	2024	Mítica	Foil	1	1
2026-03-17	Tecelão da Matéria Olteca	Os Fora da Lei de Encruzilhada do Trovão (Promo)	2024	Mítica	Normal	1.25	1.25
2026-03-17	Kitsa, Otterball Elite	BLB	2024	Mítica	Normal	17.72	31.22
2026-03-17	Kitsa, Otterball Elite	BLB	2024	Mítica	Foil	25.65	37.88
2026-03-17	Bloomburrow	BLB	2024	Rara	Normal	18.61	18.75
2026-03-17	Bloomburrow	SWBLB	2024	Rara	Foil	25.9	26.1
2026-03-17	Abhorrent Oculus	Noctumbra: A Casa dos Horrores	2024	Mítica	Normal	127.99	156.72
2026-03-17	Abhorrent Oculus	Noctumbra: A Casa dos Horrores	2024	Mítica	Foil	157.18	217.07
2026-03-17	The Earth Crystal	FINAL FANTASY	2025	Rara	Normal	22.4	32.61
2026-03-17	The Earth Crystal	FINAL FANTASY	2025	Rara	Foil	31.5	43.07
2026-03-17	The Earth Crystal	FINAL FANTASY (Borderless Woodblock)	2025	Rara	Normal	22	28.9
2026-03-17	The Earth Crystal	FINAL FANTASY (Borderless Woodblock)	2025	Rara	Foil	50	50
2026-03-17	Wistfulness	Lorwyn Eclipsed (Borderless)	2026	Mítica	Normal	93.75	137.2
2026-03-17	Aetherdrift	dft	2025	Rara	Normal	44.8	49
2026-03-17	Aetherdrift	bldft	2025	Rara	Normal	49.75	55
2026-03-17	Aetherdrift	fpdft	2025	Rara	Normal	48.3	50
2026-03-17	Wistfulness	Lorwyn Eclipsed (Borderless)	2026	Mítica	Foil	159.79	200
2026-03-17	Wistfulness	Lorwyn Eclipsed	2026	Mítica	Normal	100	100
2026-03-17	Wistfulness	Lorwyn Eclipsed	2026	Mítica	Foil	101.99	108.9
2026-03-17	Recife Inquieto	LCI	2023	Rara	Normal	14.9	24.52
2026-03-17	Recife Inquieto	LCI	2023	Rara	Foil	19.16	25.04
2026-03-17	As Cavernas Perdidas de Ixalan	lci	2023	Rara	Normal	15.48	29.99
2026-03-17	As Cavernas Perdidas de Ixalan	blci	2023	Rara	Foil	19	33.67
2026-03-17	A Sorte Grande (Metalizados Elevados)	rfbig	2024	Rara	Normal	63.9	84.11
2026-03-17	A Sorte Grande (Extended Art)	eabig	2024	Rara	Foil	94.35	124.64
2026-03-17	A Sorte Grande (Tratamento Cofre)	vfbig	2024	Rara	Foil	94.35	124.64
2026-03-17	A Sorte Grande (Metalizados Elevados)	rfbig	2024	Rara	Foil	94.35	124.64
2026-03-17	Desencavar	Innistrad: Double Feature	2022	Rara	Normal	3.95	6.12
2026-03-17	Desencavar	Innistrad: Voto Carmesim	2021	Rara	Normal	3.95	6.12
2026-03-17	Desencavar	Innistrad: Voto Carmesim	2021	Rara	Foil	5.29	9.58
2026-03-17	Desencavar	Innistrad: Voto Carmesim (Variantes)	2021	Rara	Normal	4.54	4.75
2026-03-17	Desencavar	The List	2020	Rara	Normal	5.7	4.85
2026-03-17	Badgermole Cub	TLA	2025	Mítica	Normal	295	356.14
2026-03-17	Badgermole Cub	TLA	2025	Mítica	Foil	319.75	420.76
2026-03-17	Avatar: The Last Airbender	FNTLA	2025	Rara	Normal	295	356.14
2026-03-17	Avatar: The Last Airbender	TLA	2025	Rara	Normal	295.9	356.14
2026-03-17	Avatar: The Last Airbender	TLA	2025	Rara	Foil	319.75	420.76
2026-03-17	Floresta Karplusana	Edge of Eternities Commander	2025	Rara	Normal	9	13.07
2026-03-17	Floresta Karplusana	Edge of Eternities Commander	2025	Rara	Foil	32	32
2026-03-17	Floresta Karplusana	Aetherdrift Commander	2025	Rara	Normal	9	9.95
2026-03-17	Floresta Karplusana	Aetherdrift Commander	2025	Rara	Foil	9	9.95
2026-03-17	Floresta Karplusana	Dominária Unida	2022	Rara	Normal	8.99	9.95
2026-03-17	Floresta Karplusana	Dominária Unida	2022	Rara	Foil	11.76	10
2026-03-17	Onisciência	Foundations (Bordeless Mana Foil)	2024	Mítica	Foil	31.99	51.97
2026-03-17	Onisciência	Foundations (Borderless)	2024	Mítica	Normal	29	42.67
2026-03-17	Onisciência	Foundations	2024	Mítica	Normal	29	42.67
2026-03-17	Onisciência	Contos Encantados (Confetti Foil)	2023	Mítica	Foil	31.99	51.97
2026-03-17	Onisciência	Core Set 2019	2018	Mítica	Normal	29.7	36
2026-03-17	Onisciência	Magic 2013	2012	Mítica	Normal	32.89	33
2026-03-17	Bleachbone Verge	Normal	2025	Rara	Normal	44.42	53.32
2026-03-17	Bleachbone Verge	Foil	2025	Rara	Foil	53.84	62.07
2026-03-17	Cid, Timeless Artificer (#419)	FINAL FANTASY (Cid Alternate Artworks)	2025	Incomum	Normal	24.95	33.04
2026-03-17	Cid, Timeless Artificer (#419)	FINAL FANTASY (Cid Alternate Artworks)	2025	Incomum	Foil	54.9	67.53
2026-03-17	Ozai, the Phoenix King	Avatar: The Last Airbender	2025	Mítica	Normal	19.35	35.83
2026-03-17	Ozai, the Phoenix King	Avatar: The Last Airbender (Battle Pose)	2025	Mítica	Normal	25.07	35.83
2026-03-17	Ozai, the Phoenix King	Avatar: The Last Airbender (Battle Pose)	2025	Mítica	Foil	31	45.46
2026-03-17	Ozai, the Phoenix King	Avatar: The Last Airbender (Scene Cards)	2025	Mítica	Foil	99.99	79.99
2026-03-17	Ozai, the Phoenix King	Avatar: The Last Airbender (Scene Cards)	2025	Mítica	Normal	79.99	99.99
2026-03-17	Os Fora da Lei de Encruzilhada do Trovão	Magic Spotlight Promos	2025	Mítica	Normal	175	187.82
2026-03-17	Os Fora da Lei de Encruzilhada do Trovão	Magic Spotlight Promos	2025	Mítica	Foil	169.9	205.05
2026-03-17	Os Fora da Lei de Encruzilhada do Trovão	Extended Art	2024	Mítica	Normal	210	210
2026-03-17	Os Fora da Lei de Encruzilhada do Trovão	Extended Art	2024	Mítica	Foil	359.99	359.99
2026-03-17	Os Fora da Lei de Encruzilhada do Trovão	Os Fora da Lei de Encruzilhada do Trovão	2024	Mítica	Normal	138	149.9
2026-03-17	Os Fora da Lei de Encruzilhada do Trovão	Os Fora da Lei de Encruzilhada do Trovão	2024	Mítica	Foil	169	170.75
2026-03-17	Terror dos Picos	Core Set 2021	2020	Mítica	Normal	169.9	169.9
2026-03-17	Terror dos Picos	Core Set 2021	2020	Mítica	Foil	170.13	170.13
2026-03-17	Quantum Riddler	Edge of Eternities	2025	Mítica	Normal	274.9	319.85
2026-03-17	Quantum Riddler	Edge of Eternities	2025	Mítica	Foil	329.99	367.71
2026-03-17	Edge of Eternities	Surreal Space Cards	2025	Mítica	Normal	270	290
2026-03-17	Edge of Eternities	Surreal Space Cards	2025	Mítica	Foil	281.9	295.96
2026-03-17	Scrawling Crawler	Foundations (Bordeless Mana Foil)	2024	Rara	Foil	29.94	41.38
2026-03-17	Scrawling Crawler	Foundations	2024	Rara	Normal	22	36.7
2026-03-17	Scrawling Crawler	Foundations (Borderless)	2024	Rara	Foil	33.89	34
2026-03-17	Scrawling Crawler	Foundations (Extended Art)	2024	Rara	Foil	30	34
2026-03-17	Scrawling Crawler	Foundations	2024	Rara	Promo	27	33.52
2026-03-17	Tarkir: Dragonstorm	Ghostfire Halo Foil	2025	Rara	Foil	190.94	210.48
2026-03-17	Tarkir: Dragonstorm	Ghostfire	2025	Rara	Normal	174.99	206.42
2026-03-17	Tarkir: Dragonstorm	Borderless	2025	Rara	Normal	175	187.5
2026-03-17	Tarkir: Dragonstorm	TDM	2025	Rara	Normal	173.9	179.9
2026-03-17	Terror Sanguinário	Aetherdrift (Rude Riders First-Place)	2025	Rara	Normal	13	17.23
2026-03-17	Terror Sanguinário	Aetherdrift (Rude Riders)	2025	Rara	Normal	13	17.23
2026-03-17	Terror Sanguinário	Aetherdrift (First-Place)	2025	Rara	Normal	13	17.23
2026-03-17	Terror Sanguinário	Aetherdrift	2025	Rara	Normal	13	17.23
2026-03-17	Terror Sanguinário	As Cavernas Perdidas de Ixalan Commander	2023	Rara	Normal	14	14
2026-03-17	Terror Sanguinário	Iconic Masters	2017	Rara	Normal	14.99	14.99
2026-03-17	A Sorte Grande	big	2024	Rara	Normal	54.99	94.13
2026-03-17	A Sorte Grande	big	2024	Rara	Foil	147.99	181.77
2026-03-17	A Sorte Grande (Extended Art)	eabig	2024	Rara	Normal	199.9	199.9
2026-03-17	A Sorte Grande (Tratamento Cofre)	vfbig	2024	Rara	Normal	250	250
2026-03-17	Terror Sanguinário	Zendikar	2009	Rara	Normal	14.99	14.99
2026-03-17	Terror Sanguinário	Aetherdrift (Foil)	2025	Rara	Foil	12.99	19.79
2026-03-17	Terror Sanguinário	Aetherdrift (Rude Riders First-Place Foil)	2025	Rara	Foil	12.99	19.79
2026-03-17	Terror Sanguinário	Aetherdrift (First-Place Foil)	2025	Rara	Foil	12.99	19.79
2026-03-17	Terror Sanguinário	Aetherdrift Foil	2025	Rara	Foil	12.99	19.79
2026-03-17	Guardiã da Florescência	Lorwyn Eclipsed (Japan Showcase Fractured Foil)	2026	Mítica	Foil	2659.91	3000.91
2026-03-17	Guardiã da Florescência	Lorwyn Eclipsed (Japan Showcase)	2026	Mítica	Normal	4500	4500
2026-03-17	Guardiã da Florescência	Lorwyn Eclipsed (Fable Frame)	2026	Mítica	Foil	3339.9	3000.91
2026-03-17	Guardiã da Florescência	Lorwyn Eclipsed	2026	Mítica	Normal	4500	4500
2026-03-17	Guardiã da Florescência	Special Guests	2023	Mítica	Normal	4500	4500
2026-03-17	Guardiã da Florescência	Double Masters 2022 (Borderless)	2022	Mítica	Normal	4500	4500
2026-03-17	Guardiã da Florescência	Double Masters 2022 (Foil Etched)	2022	Mítica	Normal	4500	4500
2026-03-17	Guardiã da Florescência	Double Masters 2022	2022	Mítica	Foil	4500	4500
2026-03-17	Guardiã da Florescência	Secret Lair Drop Series: Special Guest: Jen Bartel	2021	Mítica	Normal	4500	4500
2026-03-17	Guardiã da Florescência	Mystery Booster	2020	Mítica	Normal	4500	4500
2026-03-17	Guardiã da Florescência	Entardecer	2008	Mítica	Normal	4500	4500
2026-03-17	Ugin, Eye of the Storms	Tarkir: Dragonstorm (Reversible Dragons)	2025	Mítica	Normal	189	251.06
2026-03-17	Ugin, Eye of the Storms	Tarkir: Dragonstorm (Ghostfire Halo Foil)	2025	Mítica	Foil	266.85	324.18
2026-03-17	Ugin, Eye of the Storms	Tarkir: Dragonstorm (Ghostfire)	2025	Mítica	Normal	398.89	448.99
2026-03-17	Ugin, Eye of the Storms	Tarkir: Dragonstorm	2025	Mítica	Normal	189	251.06
2026-03-17	Appa, Steadfast Guardian	TLA	2025	Mítica	Normal	71.03	99.36
2026-03-17	Appa, Steadfast Guardian	TLA	2025	Mítica	Foil	90	116.92
2026-03-17	Avatar: The Last Airbender	fntla	2025	Mítica	Normal	71.03	99.36
2026-03-17	Avatar: The Last Airbender	tla	2025	Mítica	Normal	76	76.36
2026-03-17	Avatar: The Last Airbender	tla	2025	Mítica	Foil	88	89.95
2026-03-17	Three Tree City	Bloomburrow	2024	Rara	Normal	110.25	125.98
2026-03-17	Three Tree City	Bloomburrow	2024	Rara	Foil	160	144
2026-03-17	Controle de Peste	big	2024	Mítica	Normal	54.99	94.13
2026-03-17	Controle de Peste	big	2024	Mítica	Foil	147.99	181.77
2026-03-17	Haliya, Guided by Light	Promo	2025	Rara	Normal	11	20.14
2026-03-17	Haliya, Guided by Light	Promo	2025	Rara	Foil	11.7	24.67
2026-03-17	Edge of Eternities	eoe	2025	Rara	Normal	11	20.14
2026-03-17	Edge of Eternities	eoe	2025	Rara	Foil	11.7	24.67
2026-03-17	Edge of Eternities (Borderless Triumphant)	bteoe	2025	Rara	Normal	11	20.14
2026-03-17	Edge of Eternities (Borderless Triumphant)	bteoe	2025	Rara	Foil	11.7	24.67
2026-03-17	Três Passos à Frente	OTJ	2024	Rara	Normal	38.19	54.21
2026-03-17	Três Passos à Frente	OTJ	2024	Rara	Foil	49.89	62.4
2026-03-17	Três Passos à Frente	EAOTJ	2024	Rara	Normal	43.9	41.71
2026-03-17	Três Passos à Frente	EAOTJ	2024	Rara	Foil	45.89	43.6
2026-03-17	Frisson das Possibilidades	Foundations	2024	Comum	Normal	0.13	0.55
2026-03-17	Frisson das Possibilidades	Foundations	2024	Comum	Foil	0.25	1.34
2026-03-17	Frisson das Possibilidades	Core Set 2021	2020	Comum	Normal	0.13	0.55
2026-03-17	Frisson das Possibilidades	Core Set 2021	2020	Comum	Foil	0.25	1.34
2026-03-17	Frisson das Possibilidades	Theros Além da Morte	2020	Comum	Normal	0.1	0.1
2026-03-17	Frisson das Possibilidades	Theros Além da Morte	2020	Comum	Foil	0.25	0.1
2026-03-17	Frisson das Possibilidades	Phyrexia: Tudo será um	2023	Comum	Normal	0.1	0.1
2026-03-17	Frisson das Possibilidades	Phyrexia: Tudo será um	2023	Comum	Foil	0.25	0.1
\.


--
-- Data for Name: lista_cartas_dia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_cartas_dia (dia, carta, preco_min, variacao) FROM stdin;
2026-03-16	Wistfulness	149.9	59.9
2026-03-16	Trono Errante	279.99	49.99
2026-03-16	Valgavoth, Terror Eater	675	45.09
2026-03-16	Inseto 1/1	199.9	19.99
2026-03-16	Floresta Karplusana	29.5	15.51
2026-03-16	Kiora, the Rising Tide	149.9	14.99
2026-03-16	Terror dos Picos	175	13.71
2026-03-16	Appa, Steadfast Guardian	138.98	12.99
2026-03-16	Ozai, the Phoenix King	294.99	7.08
2026-03-16	Caldeirão de Almas de Agatha	114	5.1
2026-03-16	Arquivo Meticuloso	103.86	4.95
2026-03-16	Arena Phyrexiana	27.36	4.56
2026-03-16	Guardiã da Florescência	44	4.2
2026-03-16	Onisciência	45.49	4.14
2026-03-16	Elspeth, Storm Slayer	174.99	4.08
2026-03-16	Redirect Lightning	39.46	3.59
2026-03-16	Tecelão da Matéria Olteca	34.98	3.49
2026-03-16	Phoenix Fleet Airship	47.89	2.98
2026-03-16	Terror Sanguinário	16.7	2.78
2026-03-16	Banner of Kinship	24.8	2.39
2026-03-16	Vibrance	64.99	2.09
2026-03-16	Scrawling Crawler	22	2
2026-03-17	Ceifador de Miséria	128.74	34.35
2026-03-17	Ugin, Eye of the Storms	189	20
2026-03-17	Riverpyre Verge	105	10.1
2026-03-17	Arquivo Meticuloso	137.66	8.14
2026-03-17	Voice of Victory	139.95	7.6
2026-03-17	Três Passos à Frente	38.19	6.82
2026-03-17	Bleachbone Verge	44.42	5.79
2026-03-17	Exemplar of Light	29	5.5
2026-03-17	Three Tree City	110.25	5.25
2026-03-17	Scrawling Crawler	38.97	5.08
2026-03-17	Twinflame Tyrant	114.95	4.96
2026-03-17	High Fae Trickster	124.9	4.9
2026-03-17	Abhorrent Oculus	174.9	4.9
2026-03-17	Willowrush Verge	39.9	4.17
2026-03-17	O Nexo Cranispóreo	28.5	3.5
2026-03-17	Ral, Crackling Wit	79.9	3.4
2026-03-17	Abandoned Air Temple	13.86	2.97
2026-03-17	Ba Sing Se	27.21	2.21
2026-03-17	Summon: Knights of Round	69.99	2.01
2026-03-17	Talento do Estalajadeiro	67	2
2026-03-17	Cid, Timeless Artificer (#419)	24.95	1.95
2026-03-17	Teatro Barulhento	75.99	1.9
2026-03-17	Fire Nation Palace	19.47	1.47
2026-03-17	Kutzil, Malamet Exemplar	16	1.4
2026-03-16	The Masamune	33.5	28.75
2026-03-16	Espada da Riqueza e do Poder	286	26
2026-03-16	Quantum Riddler	274.9	4.9
2026-03-16	Badgermole Cub	299.75	4.75
2026-03-16	Raise the Past	18	4.17
2026-03-16	Noctis, Prince of Lucis	16.78	2.62
2026-03-16	Mightform Harmonizer	14.9	2.4
2026-03-16	Autoridade dos Cônsules	23.95	2.05
2026-03-16	Recife Inquieto	14.99	2
2026-03-16	Charco da Procriação	42	2
2026-03-16	Fonte Santificada	73.9	1.7
2026-03-16	Demonic Counsel	9.49	1.5
2026-03-16	Haliya, Guided by Light	10.9	1.42
2026-03-16	Desencavar	4.85	1.37
2026-03-16	The Legend of Roku	74.99	0.88
2026-03-16	Controle de Peste	54.99	0.49
2026-03-16	The Earth Crystal	22.4	0.41
2026-03-16	Eterificar	3.79	0.39
2026-03-16	Caso do Laboratório Saqueado	1.49	0.35
2026-03-16	Matoya, Archon Elder	5	0.3
2026-03-16	Frisson das Possibilidades	0.55	0.3
2026-03-16	Jidoor, Aristocratic Capital // Overture	7.79	0.29
2026-03-16	Pântano (#274)	1.3	0.25
2026-03-16	Kitsa, Otterball Elite	17.72	0.23
\.


--
-- Name: his_precos_ligamagic his_precos_ligamagic_unique_data_carta_edicao_tipo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.his_precos_ligamagic
    ADD CONSTRAINT his_precos_ligamagic_unique_data_carta_edicao_tipo UNIQUE (data, carta, edicao, tipo_carta);


--
-- Name: lista_cartas_dia lista_cartas_dia_unique_dia_carta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_cartas_dia
    ADD CONSTRAINT lista_cartas_dia_unique_dia_carta UNIQUE (dia, carta);


--
-- Name: TABLE his_precos_ligamagic; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.his_precos_ligamagic TO service_account;


--
-- Name: TABLE lista_cartas_dia; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lista_cartas_dia TO service_account;


--
-- PostgreSQL database dump complete
--

\unrestrict Ped2JeAbM9XWJ0Jh4PoW9jAWQnyb5wbs6MhvUX9xqhqhdWPLJlPcTvvX0yR9Qoo

