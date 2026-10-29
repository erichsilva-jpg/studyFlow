const Algorithms = {
    // Algoritmo 1: Gerador de Cronograma Inteligente
    generateSchedule() {
        const perfil = Store.get('perfil');
        if (!perfil || !perfil.objetivo) return;

        const materias = Store.get('materias') || [];
        let tarefas = Store.get('tarefas') || [];
        
        const today = new Date().toISOString().split('T')[0];
        
        // Mantém apenas tarefas passadas que já foram concluídas
        tarefas = tarefas.filter(t => t.dataStr < today && t.status === 'concluida');

        let topicosPendentes = [];
        materias.forEach(m => {
            m.topicos.forEach(t => {
                if (t.status === 'pendente' || t.status === 'revisao_agendada') {
                    topicosPendentes.push({ 
                        materiaId: m.id, 
                        materiaNome: m.nome, 
                        topicoId: t.id, 
                        topicoNome: t.nome, 
                        prioridade: t.status === 'revisao_agendada' ? 2 : 1 
                    });
                }
            });
        });

        // Ordenar: revisões urgentes primeiro
        topicosPendentes.sort((a, b) => b.prioridade - a.prioridade);

        if (topicosPendentes.length === 0) {
            Store.set('tarefas', tarefas);
            return;
        }

        const startDate = new Date();
        let endDate = perfil.dataProva ? new Date(perfil.dataProva) : null;
        
        // Se a data da prova for inválida ou anterior a hoje, projeta 45 dias
        if (!endDate || isNaN(endDate.getTime()) || endDate <= startDate) {
            endDate = new Date();
            endDate.setDate(startDate.getDate() + 45);
        }
        
        let currentDate = new Date();
        let topicoIndex = 0;
        
        const tempoPorTopico = 50; // 50 min por tópico
        const horasConfiguradas = perfil.horasPorDia || 3;
        const topicosPorDia = Math.max(1, Math.floor((horasConfiguradas * 60) / tempoPorTopico));

        while (topicoIndex < topicosPendentes.length && currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            
            for (let i = 0; i < topicosPorDia && topicoIndex < topicosPendentes.length; i++) {
                const topico = topicosPendentes[topicoIndex];
                tarefas.push({
                    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
                    topico_id: topico.topicoId,
                    materia_nome: topico.materiaNome,
                    topico_nome: topico.topicoNome,
                    tipo: topico.prioridade === 2 ? 'REVISÃO URGENTE (Reforço)' : 'Teoria + Exercícios',
                    duracaoMinutos: tempoPorTopico,
                    dataStr: dateStr,
                    status: 'pendente'
                });
                topicoIndex++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        Store.set('tarefas', tarefas);
    },

    // Algoritmo 2: Filtro de Simulado Adaptativo (apenas tópicos concluídos)
    generateSimulado(qtdQuestoes = 10) {
        const materias = Store.get('materias') || [];
        const topicosEstudados = new Set();
        
        materias.forEach(m => {
            m.topicos.forEach(t => {
                if (t.status === 'estudado') {
                    topicosEstudados.add(t.id);
                }
            });
        });

        // Seleciona questões APENAS de tópicos estudados
        let questoesElegiveis = MOCK_QUESTOES.filter(q => topicosEstudados.has(q.topico_id));
        
        // Embaralha e seleciona a quantidade solicitada
        questoesElegiveis = questoesElegiveis.sort(() => 0.5 - Math.random()).slice(0, qtdQuestoes);
        return questoesElegiveis;
    },

    // Algoritmo 3: Processador de Resultados e Ciclo de Feedback (Simulado Adaptativo)
    processSimuladoResult(respostas, questoesSimulado) {
        let acertos = 0;
        const estatisticasPorTopico = {};

        questoesSimulado.forEach((q, index) => {
            const acertou = respostas[index] === q.correta;
            if (acertou) acertos++;
            
            if (!estatisticasPorTopico[q.topico_id]) {
                estatisticasPorTopico[q.topico_id] = { total: 0, acertos: 0 };
            }
            estatisticasPorTopico[q.topico_id].total++;
            if (acertou) estatisticasPorTopico[q.topico_id].acertos++;
        });

        const nota = questoesSimulado.length > 0 ? Math.round((acertos / questoesSimulado.length) * 100) : 0;
        
        const novoSimulado = {
            id: 'sim_' + Date.now(),
            data: new Date().toISOString().split('T')[0],
            nota: nota,
            questoes_total: questoesSimulado.length,
            acertos: acertos
        };

        const simulados = Store.get('simulados') || [];
        simulados.push(novoSimulado);
        Store.set('simulados', simulados);

        // Feedback loop: atualiza status para revisão onde acerto < 70%
        const materias = Store.get('materias') || [];
        let gerouRevisao = false;

        Object.keys(estatisticasPorTopico).forEach(topicoId => {
            const stats = estatisticasPorTopico[topicoId];
            const taxaAcerto = (stats.acertos / stats.total) * 100;
            
            if (taxaAcerto < 70) {
                materias.forEach(m => {
                    m.topicos.forEach(t => {
                        if (t.id === topicoId) {
                            t.status = 'revisao_agendada';
                            gerouRevisao = true;
                        }
                    });
                });
            }
        });

        Store.set('materias', materias);
        
        if (gerouRevisao) {
            this.generateSchedule();
        }

        Store.addXP(Math.max(15, nota));
        return novoSimulado;
    },

    // Algoritmo 4: Gerador de Teste Final Geral (Cobre todas as grandes áreas curriculares)
    generateFinalTest(qtdQuestoes = 20) {
        // Agrupa questões por matéria para garantir equilíbrio entre áreas
        const porMateria = {};
        MOCK_QUESTOES.forEach(q => {
            if (!porMateria[q.materia_id]) porMateria[q.materia_id] = [];
            porMateria[q.materia_id].push(q);
        });

        const chaves = Object.keys(porMateria);
        let selecionadas = [];
        let index = 0;

        // Distribui equitativamente entre as matérias
        while (selecionadas.length < qtdQuestoes && selecionadas.length < MOCK_QUESTOES.length) {
            const matKey = chaves[index % chaves.length];
            const pool = porMateria[matKey];
            
            if (pool && pool.length > 0) {
                const randomIdx = Math.floor(Math.random() * pool.length);
                const questaoEscolhida = pool.splice(randomIdx, 1)[0];
                selecionadas.push(questaoEscolhida);
            }
            index++;
        }

        // Embaralha as questões finais
        return selecionadas.sort(() => 0.5 - Math.random());
    },

    // Algoritmo 5: Diagnóstico Aprofundado do Teste Final
    processFinalTestResult(respostas, questoes, tempoSegundos, temposPorQuestao = []) {
        let acertos = 0;
        const desempenhoPorMateria = {};
        const questoesDetalhadas = [];
        const topicosParaReforco = new Set();

        questoes.forEach((q, index) => {
            const respDada = respostas[index];
            const acertou = respDada === q.correta;
            if (acertou) acertos++;
            else {
                topicosParaReforco.add({ id: q.topico_id, nome: q.topico_nome, materia: q.materia_nome });
            }

            // Estatísticas por matéria
            if (!desempenhoPorMateria[q.materia_nome]) {
                desempenhoPorMateria[q.materia_nome] = { total: 0, acertos: 0 };
            }
            desempenhoPorMateria[q.materia_nome].total++;
            if (acertou) desempenhoPorMateria[q.materia_nome].acertos++;

            questoesDetalhadas.push({
                questao: q,
                respostaDada: respDada,
                acertou: acertou,
                tempoGasto: temposPorQuestao[index] || 0
            });
        });

        const percentualAcerto = questoes.length > 0 ? Math.round((acertos / questoes.length) * 100) : 0;
        const tempoMedioSegundos = questoes.length > 0 ? Math.round(tempoSegundos / questoes.length) : 0;

        // Cálculo Estimado de Nota TRI (300 a 980 pontos)
        let notaTRI = 350;
        if (percentualAcerto > 0) {
            notaTRI = Math.round(380 + (percentualAcerto / 100) * 580);
        }

        // Veredito pedagógico
        let veredito = '';
        let badge = '';
        let corBadge = '';

        if (percentualAcerto >= 80) {
            veredito = 'Excelente! Domínio avançado do conteúdo. Alto potencial de aprovação!';
            badge = 'Nível Elite / Aprovado';
            corBadge = 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40';
        } else if (percentualAcerto >= 60) {
            veredito = 'Bom desempenho! Base sólida, mas com pontos específicos que merecem reforço.';
            badge = 'Nível Competitivo';
            corBadge = 'text-blue-500 bg-blue-100 dark:bg-blue-900/40';
        } else {
            veredito = 'Atenção! Foram identificadas lacunas conceituais importantes nas disciplinas.';
            badge = 'Reforço Urgente Recomendado';
            corBadge = 'text-amber-500 bg-amber-100 dark:bg-amber-900/40';
        }

        const resultadoFinal = {
            id: 'final_' + Date.now(),
            data: new Date().toISOString(),
            questoesTotal: questoes.length,
            acertos: acertos,
            erros: questoes.length - acertos,
            percentual: percentualAcerto,
            notaTRI: notaTRI,
            tempoSegundos: tempoSegundos,
            tempoMedioSegundos: tempoMedioSegundos,
            temposPorQuestao: temposPorQuestao,
            veredito: veredito,
            badge: badge,
            corBadge: corBadge,
            desempenhoPorMateria: desempenhoPorMateria,
            questoesDetalhadas: questoesDetalhadas,
            topicosParaReforco: Array.from(topicosParaReforco)
        };

        // Salva no Store e recompensa com XP
        Store.saveFinalTest(resultadoFinal);

        return resultadoFinal;
    },

    concluirTarefa(tarefaId) {
        const tarefas = Store.get('tarefas') || [];
        const materias = Store.get('materias') || [];
        let topicoIdConcluido = null;

        tarefas.forEach(t => {
            if (t.id === tarefaId && t.status !== 'concluida') {
                t.status = 'concluida';
                topicoIdConcluido = t.topico_id;
            }
        });

        if (topicoIdConcluido) {
            // Marca o tópico como estudado no edital
            materias.forEach(m => {
                m.topicos.forEach(t => {
                    if (t.id === topicoIdConcluido) {
                        t.status = 'estudado';
                    }
                });
            });

            Store.set('tarefas', tarefas);
            Store.set('materias', materias);
            Store.addXP(50);
            Store.incrementStreak();
            return true;
        }
        return false;
    }
};
