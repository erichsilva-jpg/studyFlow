const Store = {
    init() {
        const perfil = this.get('perfil');
        const materiasArmazenadas = this.get('materias');

        // Se não tiver perfil ou se as matérias estiverem desatualizadas (menos de 7 matérias), re-sincroniza com MOCK_MATERIAS
        if (!perfil) {
            this.clearAll();
            localStorage.setItem('studyflow_perfil', JSON.stringify({
                objetivo: null,
                dataProva: null,
                horasPorDia: 0,
                xp: 0,
                streak: 0,
                nivel: 1,
                lastLogin: new Date().toISOString().split('T')[0]
            }));
            
            const materiasComStatus = MOCK_MATERIAS.map(m => ({
                ...m,
                topicos: m.topicos.map(t => ({ ...t, status: 'pendente' }))
            }));
            localStorage.setItem('studyflow_materias', JSON.stringify(materiasComStatus));
            localStorage.setItem('studyflow_tarefas', JSON.stringify([]));
            localStorage.setItem('studyflow_simulados', JSON.stringify([]));
            localStorage.setItem('studyflow_testes_finais', JSON.stringify([]));
        } else if (!materiasArmazenadas || materiasArmazenadas.length < MOCK_MATERIAS.length) {
            // Migração suave: atualiza lista de matérias preservando tópicos já estudados
            const statusMap = {};
            if (materiasArmazenadas) {
                materiasArmazenadas.forEach(m => {
                    m.topicos.forEach(t => {
                        statusMap[t.id] = t.status;
                    });
                });
            }

            const novasMaterias = MOCK_MATERIAS.map(m => ({
                ...m,
                topicos: m.topicos.map(t => ({
                    ...t,
                    status: statusMap[t.id] || 'pendente'
                }))
            }));
            localStorage.setItem('studyflow_materias', JSON.stringify(novasMaterias));
            if (!this.get('testes_finais')) {
                localStorage.setItem('studyflow_testes_finais', JSON.stringify([]));
            }
        }

        this.checkStreak();
    },

    get(key) { 
        try {
            return JSON.parse(localStorage.getItem(`studyflow_${key}`)); 
        } catch(e) {
            return null;
        }
    },

    set(key, data) { 
        localStorage.setItem(`studyflow_${key}`, JSON.stringify(data)); 
    },

    clearAll() {
        localStorage.removeItem('studyflow_perfil');
        localStorage.removeItem('studyflow_materias');
        localStorage.removeItem('studyflow_tarefas');
        localStorage.removeItem('studyflow_simulados');
        localStorage.removeItem('studyflow_testes_finais');
        localStorage.removeItem('studyflow_rascunho');
    },

    // Reset 1: Recomeçar Apenas o Progresso dos Estudos (mantém objetivo/horas)
    resetProgressOnly() {
        const perfil = this.get('perfil') || {};
        // Zera tópicos
        const materiasComStatus = MOCK_MATERIAS.map(m => ({
            ...m,
            topicos: m.topicos.map(t => ({ ...t, status: 'pendente' }))
        }));
        this.set('materias', materiasComStatus);
        this.set('tarefas', []);
        this.set('simulados', []);
        
        // Zera streak e reinicia XP com bônus de recomeço
        perfil.streak = 0;
        perfil.xp = 0;
        perfil.nivel = 1;
        this.set('perfil', perfil);

        // Re-gera cronograma limpo
        Algorithms.generateSchedule();
    },

    // Reinicia apenas todos os conteúdos que já foram estudados
    resetAllConteudosEstudados() {
        const materias = this.get('materias') || [];
        materias.forEach(m => {
            m.topicos.forEach(t => {
                t.status = 'pendente';
            });
        });
        this.set('materias', materias);
        this.set('tarefas', []);
        Algorithms.generateSchedule();
    },

    // Reinicia estudos e toda a rotina de testes (simulados e testes finais)
    resetEstudosERotinaTestes() {
        const materias = this.get('materias') || [];
        materias.forEach(m => {
            m.topicos.forEach(t => {
                t.status = 'pendente';
            });
        });
        this.set('materias', materias);
        this.set('tarefas', []);
        this.set('simulados', []);
        this.set('testes_finais', []);
        Algorithms.generateSchedule();
    },

    // Reinicia os conteúdos estudados de uma disciplina específica
    resetMateriaConteudos(materiaId) {
        const materias = this.get('materias') || [];
        let alterou = false;
        materias.forEach(m => {
            if (m.id === materiaId) {
                m.topicos.forEach(t => {
                    t.status = 'pendente';
                });
                alterou = true;
            }
        });
        if (alterou) {
            this.set('materias', materias);
            Algorithms.generateSchedule();
        }
    },

    // Reinicia um tópico individual específico
    resetTopicoIndividual(topicoId) {
        const materias = this.get('materias') || [];
        let alterou = false;
        materias.forEach(m => {
            m.topicos.forEach(t => {
                if (t.id === topicoId) {
                    t.status = 'pendente';
                    alterou = true;
                }
            });
        });
        if (alterou) {
            this.set('materias', materias);
            Algorithms.generateSchedule();
        }
    },

    // Reset 2: Reset Completo de Fábrica (Zerar Tudo e ir ao Onboarding)
    resetAllFactory() {
        this.clearAll();
        this.init();
    },

    updatePerfil(dados) {
        const perfil = this.get('perfil') || {};
        this.set('perfil', { ...perfil, ...dados });
    },

    addXP(amount) {
        const perfil = this.get('perfil') || { xp: 0, nivel: 1 };
        perfil.xp = (perfil.xp || 0) + amount;
        perfil.nivel = Math.floor(perfil.xp / 100) + 1;
        this.set('perfil', perfil);
    },

    incrementStreak() {
        const perfil = this.get('perfil');
        if (!perfil) return;
        perfil.streak = (perfil.streak || 0) + 1;
        this.set('perfil', perfil);
    },

    checkStreak() {
        const perfil = this.get('perfil');
        if (!perfil || !perfil.lastLogin) return;
        const today = new Date().toISOString().split('T')[0];
        if (perfil.lastLogin !== today) {
            const lastDate = new Date(perfil.lastLogin);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays > 1) {
                perfil.streak = 0;
            }
            perfil.lastLogin = today;
            this.set('perfil', perfil);
        }
    },

    saveFinalTest(resultado) {
        const testes = this.get('testes_finais') || [];
        testes.push(resultado);
        this.set('testes_finais', testes);
        this.addXP(250); // Bônus especial de XP por finalizar o Teste Final
    },

    saveRascunho(texto) {
        localStorage.setItem('studyflow_rascunho', texto);
    },

    getRascunho() {
        return localStorage.getItem('studyflow_rascunho') || '';
    }
};
