// StudyFlow - Base de Dados Curricular e Banco de Questões Expandido
const MOCK_MATERIAS = [
    {
        id: 'mat',
        nome: 'Matemática e Suas Tecnologias',
        cor: '#4F46E5',
        icone: 'fa-calculator',
        topicos: [
            { id: 'mat_1', nome: 'Aritmética Básica, Razão e Porcentagem' },
            { id: 'mat_2', nome: 'Funções de 1º e 2º Grau' },
            { id: 'mat_3', nome: 'Geometria Plana (Áreas e Teorema de Pitágoras)' },
            { id: 'mat_4', nome: 'Geometria Espacial (Volumes de Prismas e Cilindros)' },
            { id: 'mat_5', nome: 'Estatística e Probabilidade' },
            { id: 'mat_6', nome: 'Trigonometria e Triângulo Retângulo' },
            { id: 'mat_7', nome: 'Análise Combinatória' }
        ]
    },
    {
        id: 'bio',
        nome: 'Ciências da Natureza - Biologia',
        cor: '#10B981',
        icone: 'fa-dna',
        topicos: [
            { id: 'bio_1', nome: 'Ecologia: Cadeias Alimentares e Biomas' },
            { id: 'bio_2', nome: 'Citologia: Organelas e Respiração Celular' },
            { id: 'bio_3', nome: 'Genética: Leis de Mendel e Hereditariedade' },
            { id: 'bio_4', nome: 'Fisiologia Humana: Circulatório e Imune' },
            { id: 'bio_5', nome: 'Evolução e Seleção Natural de Darwin' }
        ]
    },
    {
        id: 'fis',
        nome: 'Ciências da Natureza - Física',
        cor: '#0ea5e9',
        icone: 'fa-atom',
        topicos: [
            { id: 'fis_1', nome: 'Cinemática: Velocidade Média e MU/MUV' },
            { id: 'fis_2', nome: 'Dinâmica: Leis de Newton e Força Peso' },
            { id: 'fis_3', nome: 'Termologia: Calorimetria e Mudança de Estado' },
            { id: 'fis_4', nome: 'Óptica Geométrica e Ondulatória' },
            { id: 'fis_5', nome: 'Eletrodinâmica: Circuitos e Lei de Ohm' }
        ]
    },
    {
        id: 'qui',
        nome: 'Ciências da Natureza - Química',
        cor: '#f59e0b',
        icone: 'fa-flask-vial',
        topicos: [
            { id: 'qui_1', nome: 'Modelos Atômicos e Tabela Periódica' },
            { id: 'qui_2', nome: 'Funções Inorgânicas: Ácidos, Bases e Sais' },
            { id: 'qui_3', nome: 'Estequiometria e Relações de Massa' },
            { id: 'qui_4', nome: 'Termoquímica: Reações Endo e Exotérmicas' },
            { id: 'qui_5', nome: 'Química Orgânica: Funções Oxigenadas' }
        ]
    },
    {
        id: 'his',
        nome: 'Ciências Humanas - História',
        cor: '#ec4899',
        icone: 'fa-landmark',
        topicos: [
            { id: 'his_1', nome: 'Brasil Colônia: Ciclo do Ouro e Cana' },
            { id: 'his_2', nome: 'Brasil República: Era Vargas e Ditadura Militar' },
            { id: 'his_3', nome: 'Idade Contemporânea: Guerras Mundiais' },
            { id: 'his_4', nome: 'Guerra Fria e Nova Ordem Mundial' }
        ]
    },
    {
        id: 'geo',
        nome: 'Ciências Humanas - Geografia',
        cor: '#8b5cf6',
        icone: 'fa-earth-americas',
        topicos: [
            { id: 'geo_1', nome: 'Climatologia e Biomas Brasileiros' },
            { id: 'geo_2', nome: 'Urbanização, Demografia e Migrações' },
            { id: 'geo_3', nome: 'Globalização e Blocos Econômicos' },
            { id: 'geo_4', nome: 'Agropecuária Brasileira e Meio Ambiente' }
        ]
    },
    {
        id: 'lin',
        nome: 'Linguagens, Códigos e Literatura',
        cor: '#14b8a6',
        icone: 'fa-book-open-reader',
        topicos: [
            { id: 'lin_1', nome: 'Interpretação e Coesão Textual' },
            { id: 'lin_2', nome: 'Figuras de Linguagem (Metáfora, Ironia)' },
            { id: 'lin_3', nome: 'Modernismo Brasileiro e Vanguardas' },
            { id: 'lin_4', nome: 'Variação Linguística e Norma Culta' }
        ]
    }
];

// Banco de Questões Robusto com Explicações Pedagógicas
const MOCK_QUESTOES = [
    // MATEMÁTICA
    { 
        id: 'q1', 
        materia_id: 'mat',
        topico_id: 'mat_1', 
        materia_nome: 'Matemática',
        topico_nome: 'Aritmética Básica, Razão e Porcentagem',
        texto: 'Uma mercadoria que custava R$ 200,00 sofreu um desconto de 15% em uma promoção e, no mês seguinte, sofreu um aumento de 10% sobre o novo valor. Qual é o preço final da mercadoria?', 
        alternativas: ['R$ 180,00', 'R$ 187,00', 'R$ 190,00', 'R$ 195,50', 'R$ 200,00'], 
        correta: 1,
        explicacao: 'Com 15% de desconto: 200 * (1 - 0,15) = R$ 170,00. Em seguida, com 10% de aumento: 170 * 1,10 = R$ 187,00.'
    },
    { 
        id: 'q2', 
        materia_id: 'mat',
        topico_id: 'mat_2', 
        materia_nome: 'Matemática',
        topico_nome: 'Funções de 1º e 2º Grau',
        texto: 'O lucro L(x) de uma fábrica é dado pela função quadrática L(x) = -2x² + 80x - 300, onde x representa a quantidade de peças produzidas em centenas. A quantidade x que maximiza o lucro é:', 
        alternativas: ['15', '20', '25', '30', '40'], 
        correta: 1,
        explicacao: 'O vértice x_v da parábola maximiza a função: x_v = -b / (2a) = -80 / (2 * (-2)) = -80 / -4 = 20.'
    },
    { 
        id: 'q3', 
        materia_id: 'mat',
        topico_id: 'mat_3', 
        materia_nome: 'Matemática',
        topico_nome: 'Geometria Plana',
        texto: 'Um terreno retangular tem perímetro de 60 metros. Sabendo que o comprimento é o dobro da largura, qual é a área desse terreno?', 
        alternativas: ['150 m²', '200 m²', '225 m²', '250 m²', '300 m²'], 
        correta: 1,
        explicacao: 'Perímetro: 2(C + L) = 60 => C + L = 30. Como C = 2L, temos 2L + L = 30 => 3L = 30 => L = 10 m e C = 20 m. Área = C * L = 20 * 10 = 200 m².'
    },
    { 
        id: 'q4', 
        materia_id: 'mat',
        topico_id: 'mat_4', 
        materia_nome: 'Matemática',
        topico_nome: 'Geometria Espacial',
        texto: 'Um reservatório de água possui formato cilíndrico reto com raio da base igual a 2 metros e altura de 3 metros. Considerando π ≈ 3,14, qual é o volume aproximado do reservatório em litros? (1 m³ = 1000 L)', 
        alternativas: ['12.560 L', '25.120 L', '37.680 L', '42.000 L', '50.240 L'], 
        correta: 2,
        explicacao: 'Volume = π * r² * h = 3,14 * (2)² * 3 = 3,14 * 4 * 3 = 37,68 m³. Convertendo para litros: 37,68 * 1000 = 37.680 L.'
    },
    { 
        id: 'q5', 
        materia_id: 'mat',
        topico_id: 'mat_5', 
        materia_nome: 'Matemática',
        topico_nome: 'Estatística e Probabilidade',
        texto: 'Em uma urna com 12 bolas brancas, 8 pretas e 5 vermelhas, qual é a probabilidade de se retirar aleatoriamente uma bola que NÃO seja branca?', 
        alternativas: ['12/25 (48%)', '13/25 (52%)', '8/25 (32%)', '5/25 (20%)', '1/2 (50%)'], 
        correta: 1,
        explicacao: 'Total de bolas = 12 + 8 + 5 = 25. Bolas não brancas = 8 pretas + 5 vermelhas = 13. Probabilidade = 13/25 = 52%.'
    },
    { 
        id: 'q6', 
        materia_id: 'mat',
        topico_id: 'mat_6', 
        materia_nome: 'Matemática',
        topico_nome: 'Trigonometria e Triângulo Retângulo',
        texto: 'Um observador vê o topo de um edifício sob um ângulo de elevação de 30°. Se ele está situado a 60 metros da base do prédio, qual a altura do edifício? (Considere tg 30° ≈ 0,58 e desconsidere a altura do observador).', 
        alternativas: ['28,4 m', '34,8 m', '42,0 m', '51,9 m', '60,0 m'], 
        correta: 1,
        explicacao: 'tg(30°) = Altura / Distância => 0,58 = H / 60 => H = 60 * 0,58 = 34,8 metros.'
    },
    { 
        id: 'q7', 
        materia_id: 'mat',
        topico_id: 'mat_7', 
        materia_nome: 'Matemática',
        topico_nome: 'Análise Combinatória',
        texto: 'Uma comissão de 3 estudantes deve ser escolhida a partir de um grupo de 7 candidatos disponíveis. De quantas maneiras diferentes essa comissão pode ser formada?', 
        alternativas: ['21', '35', '42', '210', '343'], 
        correta: 1,
        explicacao: 'A ordem dos membros não importa, logo é uma Combinação simples: C(7,3) = 7! / (3! * 4!) = (7 * 6 * 5) / (3 * 2 * 1) = 35.'
    },

    // BIOLOGIA
    { 
        id: 'q8', 
        materia_id: 'bio',
        topico_id: 'bio_1', 
        materia_nome: 'Biologia',
        topico_nome: 'Ecologia: Cadeias Alimentares e Biomas',
        texto: 'Em um ecossistema aquático poluído por metais pesados, em qual nível trófico da cadeia alimentar se observa a maior concentração dessas substâncias tóxicas?', 
        alternativas: ['Produtores primários (fitoplâncton)', 'Consumidores primários (zooplâncton)', 'Consumidores secundários (peixes pequenos)', 'Consumidores de topo da cadeia (aves ou peixes carnívoros)', 'Decompositores bacterianos'], 
        correta: 3,
        explicacao: 'Trata-se do fenômeno da Bioacumulação ou Biomagnificação trófica: poluentes não biodegradáveis acumulam-se progressivamente ao longo dos níveis tróficos, atingindo sua máxima concentração no topo da cadeia.'
    },
    { 
        id: 'q9', 
        materia_id: 'bio',
        topico_id: 'bio_2', 
        materia_nome: 'Biologia',
        topico_nome: 'Citologia: Organelas e Respiração Celular',
        texto: 'Durante exercícios físicos intensos em que o suprimento de oxigênio muscular é insuficiente, as células musculares obtêm energia temporária por meio de:', 
        alternativas: ['Ciclo de Krebs acelerado', 'Fermentação lática no citosol', 'Fosforilação oxidativa mitocondrial', 'Fermentação alcoólica no retículo', 'Síntese de amido nos lisossomos'], 
        correta: 1,
        explicacao: 'Na ausência momentânea de O₂ (hipóxia muscular), a glicólise é mantida por meio da fermentação lática citoplasmática, gerando ácido lático e 2 ATPs por glicose.'
    },
    { 
        id: 'q10', 
        materia_id: 'bio',
        topico_id: 'bio_3', 
        materia_nome: 'Biologia',
        topico_nome: 'Genética: Leis de Mendel',
        texto: 'No cruzamento entre duas cobaias heterozigotas para a cor do pelo (Bb x Bb), onde o alelo B (preto) é dominante sobre b (branco), qual é a probabilidade esperada de nascer um filhote com fenótipo branco?', 
        alternativas: ['0%', '25%', '50%', '75%', '100%'], 
        correta: 1,
        explicacao: 'O cruzamento Bb x Bb gera 1 BB, 2 Bb e 1 bb. O fenótipo branco exige homozigose recessiva (bb), que corresponde a 1 em 4 (25%).'
    },
    { 
        id: 'q11', 
        materia_id: 'bio',
        topico_id: 'bio_4', 
        materia_nome: 'Biologia',
        topico_nome: 'Fisiologia Humana',
        texto: 'As vacinas e os soros terapêuticos diferem fundamentalmente quanto ao seu mecanismo de ação. As vacinas atuam fornecendo:', 
        alternativas: ['Anticorpos prontos gerando imunização passiva e temporária', 'Antígenos atenuados/inativados estimulando a produção ativa de anticorpos e memória imunológica', 'Hormônios estimuladores da medula óssea', 'Antibióticos de largo espectro contra vírus e bactérias', 'Leucócitos maduros para neutralização imediata'], 
        correta: 1,
        explicacao: 'A vacina é uma imunização ativa: contém antígenos que estimulam o próprio organismo a produzir anticorpos específicos e células de memória de longa duração.'
    },
    { 
        id: 'q12', 
        materia_id: 'bio',
        topico_id: 'bio_5', 
        materia_nome: 'Biologia',
        topico_nome: 'Evolução e Seleção Natural',
        texto: 'O aparecimento de bactérias resistentes a múltiplos antibióticos é um exemplo contemporâneo clássico de:', 
        alternativas: ['Uso e desuso proposto por Lamarck', 'Seleção natural atuando sobre a variabilidade genética pré-existente', 'Geração espontânea de novas espécies', 'Deriva genética direcionada pelo paciente', 'Mutações intencionais induzidas pelo remédio'], 
        correta: 1,
        explicacao: 'O antibiótico atua como agente seletivo ambiental: ele elimina as bactérias sensíveis, permitindo que as previamente portadoras de mutações de resistência sobrevivam e se proliferem (Seleção Natural Darwiniana).'
    },

    // FÍSICA
    { 
        id: 'q13', 
        materia_id: 'fis',
        topico_id: 'fis_1', 
        materia_nome: 'Física',
        topico_nome: 'Cinemática: Velocidade Média e MU/MUV',
        texto: 'Um veículo parte do repouso e atinge uma velocidade de 72 km/h em 10 segundos, com aceleração escalar constante. Qual foi a distância percorrida pelo veículo nesse intervalo de tempo?', 
        alternativas: ['50 m', '100 m', '150 m', '200 m', '360 m'], 
        correta: 1,
        explicacao: 'Convertendo a velocidade: 72 km/h / 3,6 = 20 m/s. Aceleração a = (20 - 0) / 10 = 2 m/s². Distância Δs = v₀*t + (a*t²)/2 = 0 + (2 * 10²)/2 = 100 metros.'
    },
    { 
        id: 'q14', 
        materia_id: 'fis',
        topico_id: 'fis_2', 
        materia_nome: 'Física',
        topico_nome: 'Dinâmica: Leis de Newton',
        texto: 'Um bloco de massa m = 5 kg repousa sobre uma superfície horizontal perfeitamente lisa. Aplica-se sobre ele uma força horizontal constante F = 15 N. A aceleração adquirida pelo bloco e a força de reação da mesa (Normal) valem (considere g = 10 m/s²):', 
        alternativas: ['a = 2 m/s² e N = 15 N', 'a = 3 m/s² e N = 50 N', 'a = 3 m/s² e N = 15 N', 'a = 5 m/s² e N = 50 N', 'a = 15 m/s² e N = 0 N'], 
        correta: 1,
        explicacao: 'Pela 2ª Lei de Newton: F = m*a => 15 = 5*a => a = 3 m/s². No eixo vertical em equilíbrio: Normal = Peso = m*g = 5 * 10 = 50 N.'
    },
    { 
        id: 'q15', 
        materia_id: 'fis',
        topico_id: 'fis_3', 
        materia_nome: 'Física',
        topico_nome: 'Termologia: Calorimetria',
        texto: 'Quantas calorias de calor sensível são necessárias para aquecer 200 g de água pura de 20 °C até 70 °C? (Dado: calor específico da água c = 1,0 cal/g·°C).', 
        alternativas: ['5.000 cal', '10.000 cal', '14.000 cal', '20.000 cal', '25.000 cal'], 
        correta: 1,
        explicacao: 'Equação fundamental da calorimetria: Q = m * c * ΔT = 200 * 1,0 * (70 - 20) = 200 * 50 = 10.000 calorias (10 kcal).'
    },
    { 
        id: 'q16', 
        materia_id: 'fis',
        topico_id: 'fis_4', 
        materia_nome: 'Física',
        topico_nome: 'Óptica Geométrica e Ondulatória',
        texto: 'Quando a luz solar atravessa uma gota de chuva e se decompõe nas cores do arco-íris, o fenômeno ondulatório primário responsável por desviar diferentemente cada frequência de onda é a:', 
        alternativas: ['Difração', 'Interferência', 'Refração com dispersão', 'Polarização', 'Ressonância'], 
        correta: 2,
        explicacao: 'A refração ocorre quando a onda luminosa muda de meio e de velocidade. Como o índice de refração depende da frequência da luz, cada cor sofre um desvio angular diferente (dispersão refrativa).'
    },
    { 
        id: 'q17', 
        materia_id: 'fis',
        topico_id: 'fis_5', 
        materia_nome: 'Física',
        topico_nome: 'Eletrodinâmica: Circuitos e Lei de Ohm',
        texto: 'Um chuveiro elétrico opera sob uma ddp de 220 V consumindo uma potência de 4400 W. A corrente elétrica que percorre a resistência e o valor da resistência do chuveiro valem, respectivamente:', 
        alternativas: ['10 A e 22 Ω', '20 A e 11 Ω', '20 A e 22 Ω', '40 A e 5,5 Ω', '15 A e 15 Ω'], 
        correta: 1,
        explicacao: 'P = U * i => 4400 = 220 * i => i = 20 A. Pela 1ª Lei de Ohm: U = R * i => 220 = R * 20 => R = 11 Ω.'
    },

    // QUÍMICA
    { 
        id: 'q18', 
        materia_id: 'qui',
        topico_id: 'qui_1', 
        materia_nome: 'Química',
        topico_nome: 'Modelos Atômicos e Tabela Periódica',
        texto: 'O modelo atômico que propôs pela primeira vez a quantização da energia dos elétrons em órbitas circulares estacionárias definidas foi formulado por:', 
        alternativas: ['John Dalton', 'J.J. Thomson', 'Ernest Rutherford', 'Niels Bohr', 'James Chadwick'], 
        correta: 3,
        explicacao: 'Niels Bohr introduziu os postulados quânticos na estrutura atômica, explicando que os elétrons giram em órbitas quantizadas sem irradiar energia enquanto estacionários.'
    },
    { 
        id: 'q19', 
        materia_id: 'qui',
        topico_id: 'qui_2', 
        materia_nome: 'Química',
        topico_nome: 'Funções Inorgânicas',
        texto: 'A queima de combustíveis fósseis contendo enxofre libera SO₂ e SO₃ na atmosfera, que em contato com o vapor de água originam a chuva ácida através da formação de:', 
        alternativas: ['Hidróxido de sódio (NaOH)', 'Ácido sulfúrico (H₂SO₄)', 'Gás metano (CH₄)', 'Bicarbonato de cálcio', 'Cloreto de hidrogênio (HCl)'], 
        correta: 1,
        explicacao: 'Os óxidos de enxofre são óxidos ácidos: SO₃ + H₂O → H₂SO₄ (ácido sulfúrico), um dos principais agentes causadores da acidificação das chuvas.'
    },
    { 
        id: 'q20', 
        materia_id: 'qui',
        topico_id: 'qui_3', 
        materia_nome: 'Química',
        topico_nome: 'Estequiometria e Relações de Massa',
        texto: 'Dada a reação balanceada de combustão completa do metano: CH₄ + 2 O₂ → CO₂ + 2 H₂O. Quantos gramas de CO₂ são formados a partir da queima completa de 32 g de metano (CH₄)? (Massas molares: C=12, H=1, O=16 g/mol).', 
        alternativas: ['44 g', '88 g', '132 g', '176 g', '220 g'], 
        correta: 1,
        explicacao: 'Massa molar do CH₄ = 12 + 4 = 16 g/mol. 32 g de CH₄ correspondem a 2 mols. Como a proporção molar CH₄ : CO₂ é 1:1, formam-se 2 mols de CO₂. Massa de 2 mols de CO₂ = 2 * 44 = 88 g.'
    },
    { 
        id: 'q21', 
        materia_id: 'qui',
        topico_id: 'qui_4', 
        materia_nome: 'Química',
        topico_nome: 'Termoquímica',
        texto: 'Em um processo químico onde a entalpia final dos produtos é menor do que a entalpia inicial dos reagentes (ΔH < 0), dizemos que o processo é:', 
        alternativas: ['Endotérmico com absorção líquida de calor', 'Exotérmico com liberação de calor para a vizinhança', 'Isotérmico sem alteração de entalpia', 'Atermal com quebra forçada de ligações', 'Adiabático irreversível'], 
        correta: 1,
        explicacao: 'Quando ΔH = H_produtos - H_reagentes < 0, o sistema perdeu energia na forma de calor para o meio ambiente, caracterizando uma reação exotérmica.'
    },
    { 
        id: 'q22', 
        materia_id: 'qui',
        topico_id: 'qui_5', 
        materia_nome: 'Química',
        topico_nome: 'Química Orgânica',
        texto: 'Compostos que contêm o grupo funcional hidroxila (-OH) ligado diretamente a um anel benzênico aromático pertencem à função orgânica denominada:', 
        alternativas: ['Álcool', 'Fenol', 'Aldeído', 'Éter', 'Éster'], 
        correta: 1,
        explicacao: 'Quando o grupo hidroxila (-OH) está ligado a carbono saturado, temos um álcool; quando ligado diretamente ao anel benzênico aromático, a função é fenol.'
    },

    // HISTÓRIA
    { 
        id: 'q23', 
        materia_id: 'his',
        topico_id: 'his_1', 
        materia_nome: 'História',
        topico_nome: 'Brasil Colônia',
        texto: 'O sistema de plantation implantado no nordeste açucareiro colonial português baseava-se no tripé socioeconômico constituído por:', 
        alternativas: ['Minifúndio, mão de obra assalariada e policultura interna', 'Latifúndio monocultor, trabalho escravo e produção voltada para exportação', 'Pequenas propriedades familiares comunitárias e livre comércio', 'Propriedades fabris urbanas e escravismo apenas doméstico', 'Feudos cooperativos subordinados aos jesuítas'], 
        correta: 1,
        explicacao: 'A economia colonial açucareira mercantilista organizava-se em latifúndios monocultores voltados à metrópole europeia, sustentados pela exploração do trabalho escravo africano e indígena.'
    },
    { 
        id: 'q24', 
        materia_id: 'his',
        topico_id: 'his_2', 
        materia_nome: 'História',
        topico_nome: 'Brasil República: Era Vargas',
        texto: 'A Consolidação das Leis do Trabalho (CLT), a fundação da Companhia Siderúrgica Nacional (CSN) e a criação da Vale do Rio Doce foram marcos modernizadores de qual período político brasileiro?', 
        alternativas: ['República Oligárquica do Café com Leite', 'Era Vargas (1930 - 1945)', 'Governo Juscelino Kubitschek (50 anos em 5)', 'Regência Trina', 'República da Espada'], 
        correta: 1,
        explicacao: 'Getúlio Vargas liderou uma intensa política nacional-desenvolvimentista de industrialização de base (CSN, Vale) e regulação das relações de trabalho (criação da CLT em 1943).'
    },
    { 
        id: 'q25', 
        materia_id: 'his',
        topico_id: 'his_3', 
        materia_nome: 'História',
        topico_nome: 'Idade Contemporânea: Guerras Mundiais',
        texto: 'O Tratado de Versalhes (1919), assinado após o término da Primeira Guerra Mundial, é historicamente apontado por cientistas políticos e historiadores como:', 
        alternativas: ['Um pacto que consolidou a paz duradoura na Europa central', 'Uma imposição humilhante que gerou ressentimento alemão e alimentou a ascensão do nazifascismo', 'Um acordo que extinguiu o colonialismo no continente africano', 'A dissolução pacífica do Império Britânico', 'Uma união militar de proteção aos trabalhadores soviéticos'], 
        correta: 1,
        explicacao: 'As cláusulas punitivas drásticas impostas à Alemanha em Versalhes (perda territorial, indenizações astronômicas e desarme) causaram colapso econômico e revanchismo explorado pelo Partido Nazista.'
    },
    { 
        id: 'q26', 
        materia_id: 'his',
        topico_id: 'his_4', 
        materia_nome: 'História',
        topico_nome: 'Guerra Fria',
        texto: 'A Guerra Fria caracterizou-se pela disputa geopolítica bipolar entre EUA e URSS. Qual evento em 1962 representou o momento mais agudo de tensão nuclear entre as duas superpotências?', 
        alternativas: ['A construção do Muro de Berlim', 'A Guerra da Crimeia', 'A Crise dos Mísseis em Cuba', 'A Queda do Muro de Berlim', 'A assinatura da Doutrina Truman'], 
        correta: 2,
        explicacao: 'Em outubro de 1962, a descoberta de mísseis balísticos nucleares soviéticos em Cuba quase deflagrou uma guerra atômica direta entre Kennedy e Kruschev.'
    },

    // GEOGRAFIA
    { 
        id: 'q27', 
        materia_id: 'geo',
        topico_id: 'geo_1', 
        materia_nome: 'Geografia',
        topico_nome: 'Climatologia e Biomas Brasileiros',
        texto: 'O bioma brasileiro considerado a "caixa d\'água do Brasil" devido à nascente de importantes bacias hidrográficas, que possui vegetação com troncos retorcidos, casca grossa e solo ácido é o:', 
        alternativas: ['Pampa', 'Mata Atlântica', 'Cerrado', 'Caatinga', 'Pantanal'], 
        correta: 2,
        explicacao: 'O Cerrado é o hotspot com papel estratégico na recarga dos aquíferos Guarani e Urucuia e nascentes das bacias do São Francisco, Paraná e Tocantins.'
    },
    { 
        id: 'q28', 
        materia_id: 'geo',
        topico_id: 'geo_2', 
        materia_nome: 'Geografia',
        topico_nome: 'Urbanização e Demografia',
        texto: 'O fenômeno urbano caracterizado pela confluência física e espacial entre duas ou mais cidades vizinhas, formando uma única mancha urbana contínua, denomina-se:', 
        alternativas: ['Gentrificação', 'Desmetropolização', 'Conurbação', 'Segregação socioespacial', 'Macrocefalia agrária'], 
        correta: 2,
        explicacao: 'Conurbação é o encontro das malhas urbanas de municípios limítrofes, decorrente do rápido crescimento horizontal das cidades.'
    },
    { 
        id: 'q29', 
        materia_id: 'geo',
        topico_id: 'geo_3', 
        materia_nome: 'Geografia',
        topico_nome: 'Globalização e Blocos Econômicos',
        texto: 'O Mercosul (Mercado Comum do Sul) classifica-se formalmente em qual estágio de integração econômica?', 
        alternativas: ['Zona de Livre Comércio apenas', 'União Aduaneira incompleta (com TEC - Tarifa Externa Comum)', 'União Econômica e Monetária com moeda única', 'Área de Preferência Tarifária simples', 'Integração Política Total'], 
        correta: 1,
        explicacao: 'O Mercosul avançou além da zona de livre comércio adotando uma Tarifa Externa Comum (TEC), caracterizando-se como união aduaneira, embora ainda com exceções comerciais.'
    },
    { 
        id: 'q30', 
        materia_id: 'geo',
        topico_id: 'geo_4', 
        materia_nome: 'Geografia',
        topico_nome: 'Agropecuária Brasileira',
        texto: 'A expansão da fronteira agrícola moderna no Brasil tem avançado historicamente sobre qual região geográfica estratégica, conhecida pela sigla MATOPIBA?', 
        alternativas: ['Maranhão, Tocantins, Piauí e Bahia', 'Mato Grosso, Paraná, Rio de Janeiro e Bahia', 'Minas Gerais, Acre, Tocantins e Paraíba', 'Maranhão, Amazonas, Rondônia e Amapá', 'Mato Grosso do Sul, Pelotas, Iguaçu e Bahia'], 
        correta: 0,
        explicacao: 'MATOPIBA é o acrônimo da fronteira agrícola de alta produtividade de grãos (soja e milho) nos estados do Maranhão, Tocantins, Piauí e Bahia.'
    },

    // LINGUAGENS E LITERATURA
    { 
        id: 'q31', 
        materia_id: 'lin',
        topico_id: 'lin_1', 
        materia_nome: 'Linguagens',
        topico_nome: 'Interpretação e Coesão Textual',
        texto: 'No trecho: "O aluno estudou com dedicação intensa; PORTANTO, obteve excelente classificação", o conectivo destacado introduz uma oração com valor semântico de:', 
        alternativas: ['Concessão', 'Condição', 'Conclusão', 'Causa', 'Oposição'], 
        correta: 2,
        explicacao: 'A conjunção coordenativa "portanto" indica consequência lógica ou conclusão de um fato anteriormente exposto.'
    },
    { 
        id: 'q32', 
        materia_id: 'lin',
        topico_id: 'lin_2', 
        materia_nome: 'Linguagens',
        topico_nome: 'Figuras de Linguagem',
        texto: 'Identifique a figura de linguagem presente na frase: "A cidade acordou assustada com o estrondo do trovão que rugia no céu escuro."', 
        alternativas: ['Hipérbole e Pleonasmo', 'Personificação (Prosopopeia)', 'Eufemismo', 'Sinestesia pura', 'Antítese sem metáfora'], 
        correta: 1,
        explicacao: 'A personificação ou prosopopeia atribui ações e sentimentos humanos a seres inanimados ("a cidade acordou", "o trovão rugia").'
    },
    { 
        id: 'q33', 
        materia_id: 'lin',
        topico_id: 'lin_3', 
        materia_nome: 'Linguagens',
        topico_nome: 'Modernismo Brasileiro',
        texto: 'A Semana de Arte Moderna de 1922, realizada no Teatro Municipal de São Paulo, teve como principal objetivo estético e ideológico:', 
        alternativas: ['Resgatar rigorosamente as formas parnasianas de rima e métrica', 'Rompimento com o academicismo e valorização de uma identidade e cultura autenticamente brasileiras', 'Imitação estrita dos modelos literários clássicos portugueses', 'Rejeição de qualquer manifestação artística moderna internacional', 'Valorização da literatura barroca sacra'], 
        correta: 1,
        explicacao: 'O Modernismo de 1922 propôs a antropofagia cultural: deglutir as vanguardas europeias e criar uma arte livre do academicismo e genuinamente nacional.'
    },
    { 
        id: 'q34', 
        materia_id: 'lin',
        topico_id: 'lin_4', 
        materia_nome: 'Linguagens',
        topico_nome: 'Variação Linguística',
        texto: 'Sob o ponto de vista da sociolinguística moderna, as variedades linguísticas regionais e coloquiais devem ser compreendidas como:', 
        alternativas: ['Erros gramaticais graves que devem ser banidos da sociedade', 'Manifestações legítimas da língua condicionadas por fatores geográficos, históricos e sociais', 'Formas inferiores e deficientes de comunicação', 'Desvios provocados unicamente pelo analfabetismo', 'Apenas gírias passageiras sem relevância cultural'], 
        correta: 1,
        explicacao: 'A linguística compreende que não há variação superior ou inferior; todas as variedades linguísticas possuem estrutura coerente e cumprem seu papel comunicativo e identitário social.'
    },
    { 
        id: 'q35', 
        materia_id: 'mat',
        topico_id: 'mat_1', 
        materia_nome: 'Matemática',
        topico_nome: 'Aritmética Básica, Razão e Porcentagem',
        texto: 'Em um mapa cartográfico desenhado na escala 1 : 250.000, a distância linear medida entre duas cidades é de 6 cm. A distância real entre essas cidades em quilômetros é:', 
        alternativas: ['15 km', '25 km', '150 km', '250 km', '1.500 km'], 
        correta: 0,
        explicacao: 'Distância real = 6 cm * 250.000 = 1.500.000 cm. Convertendo para metros: 1.500.000 / 100 = 15.000 m. Convertendo para km: 15.000 / 1.000 = 15 km.'
    }
];
