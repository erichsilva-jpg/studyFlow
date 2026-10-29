const App = {
    currentSimulado: null,
    
    // Estado do Teste Final
    currentFinalTest: null,
    finalTimerInterval: null,
    finalTimeRemaining: 0,
    finalSelectedMode: 20,
    
    // Pomodoro
    pomodoroInterval: null,
    pomodoroTime: 25 * 60,
    pomodoroInitialDuration: 25 * 60,
    isRunning: false,

    init() {
        Store.init();
        this.bindEvents();
        
        const perfil = Store.get('perfil');
        if (!perfil || !perfil.objetivo) {
            this.navigate('onboarding');
        } else {
            Algorithms.generateSchedule();
            this.updateSidebar();
            this.navigate('dashboard');
        }
    },

    bindEvents() {
        const form = document.getElementById('onboarding-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const objetivo = document.getElementById('obj-exame').value;
                const dataProva = document.getElementById('obj-data').value;
                const horasPorDia = parseInt(document.getElementById('obj-horas').value);
                
                Store.updatePerfil({ objetivo, dataProva, horasPorDia });
                Algorithms.generateSchedule();
                
                this.updateSidebar();
                this.navigate('dashboard');
                
                const sidebar = document.getElementById('main-sidebar');
                if (sidebar) {
                    sidebar.classList.remove('hidden');
                    sidebar.classList.add('flex');
                }
            });
        }

        // Rascunho auto-save
        const rascunhoArea = document.getElementById('rascunho-textarea');
        if (rascunhoArea) {
            rascunhoArea.value = Store.getRascunho();
            rascunhoArea.addEventListener('input', (e) => {
                Store.saveRascunho(e.target.value);
            });
        }
    },

    navigate(viewId) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('fade-in');
        }
        
        // Atualiza status ativo dos botões da sidebar
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.dataset.target === viewId) {
                btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-primary');
            } else {
                btn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-primary');
            }
        });

        // Dispara renderizadores específicos
        if (viewId === 'dashboard') this.renderDashboard();
        if (viewId === 'trilha') this.renderTrilha();
        if (viewId === 'simulados') this.renderSimulados();
        if (viewId === 'teste-final') this.renderTesteFinalHome();
        if (viewId === 'stats') this.renderStats();

        // Se estiver em tela móvel, fecha a sidebar após navegar
        const sidebar = document.getElementById('main-sidebar');
        if (window.innerWidth < 768 && sidebar && !sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
        }
    },

    toggleMobileMenu() {
        const sidebar = document.getElementById('main-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('hidden');
        }
    },

    updateSidebar() {
        const perfil = Store.get('perfil') || {};
        if (!perfil.objetivo) return;

        const sidebarMeta = document.getElementById('sidebar-meta');
        if (sidebarMeta) sidebarMeta.textContent = `Foco: ${perfil.objetivo}`;

        const level = perfil.nivel || 1;
        const xp = perfil.xp || 0;
        const streak = perfil.streak || 0;

        document.getElementById('user-level').textContent = level;
        document.getElementById('user-xp').textContent = `${xp} XP`;
        document.getElementById('user-streak').textContent = streak;
        
        const mobStreak = document.getElementById('mobile-streak');
        if (mobStreak) mobStreak.textContent = streak;
        
        const currentLevelXp = xp % 100;
        const progress = Math.min(100, (currentLevelXp / 100) * 100);
        document.getElementById('user-xp-bar').style.width = `${progress}%`;
    },

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
    },

    // --- DASHBOARD ---
    renderDashboard() {
        const todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('today-date').textContent = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);

        const todayISO = new Date().toISOString().split('T')[0];
        const todasTarefas = Store.get('tarefas') || [];
        
        const tarefasHoje = todasTarefas.filter(t => t.dataStr === todayISO);
        const container = document.getElementById('tarefas-hoje-container');
        const contadorLabel = document.getElementById('tarefas-contador-label');
        
        if (contadorLabel) {
            contadorLabel.textContent = `${tarefasHoje.length} tarefas`;
        }

        if (tarefasHoje.length === 0) {
            container.innerHTML = `
                <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
                    <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-secondary rounded-2xl flex items-center justify-center text-xl mx-auto mb-3">
                        <i class="fa-solid fa-champagne-glasses"></i>
                    </div>
                    <h4 class="font-bold text-base mb-1">Tudo em dia por hoje!</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Você concluiu suas metas de hoje ou não possui tarefas agendadas para esta data. Aproveite para fazer o Teste Final ou descansar.</p>
                    <button onclick="App.navigate('teste-final')" class="mt-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow">
                        Testar Conhecimentos no Teste Final
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = tarefasHoje.map(t => {
                const isConcluida = t.status === 'concluida';
                const isUrgente = t.tipo.includes('URGENTE');
                const bordaClass = isUrgente ? 'border-l-4 border-rose-500 bg-rose-50/20 dark:bg-rose-950/10' : 'border-l-4 border-primary';
                
                return `
                <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${bordaClass} flex items-center justify-between transition hover:shadow-md ${isConcluida ? 'opacity-60' : ''}">
                    <div class="flex items-center gap-4">
                        <input type="checkbox" class="w-6 h-6 rounded-lg text-primary focus:ring-primary cursor-pointer accent-indigo-600" ${isConcluida ? 'checked disabled' : ''} onchange="App.concluirTarefa('${t.id}')">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">${t.materia_nome}</span>
                                <span class="text-xs text-gray-400">• ${t.duracaoMinutos} min</span>
                            </div>
                            <h4 class="font-bold text-base ${isConcluida ? 'line-through text-gray-400' : ''}">${t.topico_nome}</h4>
                            <span class="text-[11px] font-semibold ${isUrgente ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-0.5 rounded-md mt-1 inline-block">
                                ${t.tipo}
                            </span>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        this.updateEditalProgress();

        // --- LÓGICA DO BOTÃO: PRÓXIMO CONTEÚDO A ESTUDAR ---
        const proximoWrapper = document.getElementById('proximo-conteudo-wrapper');
        if (proximoWrapper) {
            const materias = Store.get('materias') || [];
            let temProximoNoEdital = false;
            materias.forEach(m => {
                if (m.topicos.some(t => t.status === 'pendente' || t.status === 'revisao_agendada')) {
                    temProximoNoEdital = true;
                }
            });

            const pendentesHoje = tarefasHoje.filter(t => t.status !== 'concluida').length;
            const todasConcluidasHoje = tarefasHoje.length > 0 && pendentesHoje === 0;

            if (!temProximoNoEdital) {
                proximoWrapper.innerHTML = `
                    <div class="bg-gradient-to-r from-amber-500/10 via-primary/10 to-emerald-500/10 p-5 rounded-2xl border border-amber-300 dark:border-amber-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">🏆</span>
                            <div>
                                <h4 class="font-bold text-sm text-gray-900 dark:text-gray-100">Parabéns! Edital 100% Concluído</h4>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Você já cobriu todos os conteúdos programáticos do edital. Faça o Teste Final para consolidar sua aprovação.</p>
                            </div>
                        </div>
                        <button onclick="App.navigate('teste-final')" class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition whitespace-nowrap">
                            Fazer Teste Final
                        </button>
                    </div>
                `;
            } else if (tarefasHoje.length === 0 || todasConcluidasHoje) {
                // DESBLOQUEADO: Todos os conteúdos de hoje estão concluídos!
                proximoWrapper.innerHTML = `
                    <div class="bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-indigo-500/15 dark:from-emerald-950/40 dark:to-teal-950/40 p-5 rounded-2xl border-2 border-secondary/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-pulse">
                        <div class="flex items-center gap-3.5">
                            <div class="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-lg shadow">
                                <i class="fa-solid fa-unlock-keyhole"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h4 class="font-bold text-sm text-emerald-800 dark:text-emerald-300">Conteúdos Concluídos com Sucesso!</h4>
                                    <span class="bg-secondary/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Desbloqueado</span>
                                </div>
                                <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Excelente disciplina! Clique ao lado para avançar e carregar o próximo conteúdo a ser estudado.</p>
                            </div>
                        </div>
                        <button onclick="App.avancarProximoConteudo()" class="w-full sm:w-auto bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2.5 transform hover:scale-105 whitespace-nowrap">
                            <span>Próximo Conteúdo</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                `;
            } else {
                // BLOQUEADO: Ainda há conteúdos pendentes a serem marcados como concluídos
                proximoWrapper.innerHTML = `
                    <div class="bg-gray-100 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-base">
                                <i class="fa-solid fa-lock"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h4 class="font-bold text-sm text-gray-700 dark:text-gray-300">Próximo Conteúdo Bloqueado</h4>
                                    <span class="bg-gray-200 dark:bg-gray-700 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Bloqueado</span>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Marque como concluído os <strong>${pendentesHoje} conteúdo(s)</strong> pendente(s) de hoje para desbloquear o próximo tópico.</p>
                            </div>
                        </div>
                        <button onclick="App.tentarAvancarProximoBloqueado(${pendentesHoje})" class="w-full sm:w-auto bg-gray-200 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition opacity-75 whitespace-nowrap" title="Conclua os conteúdos acima para desbloquear">
                            <i class="fa-solid fa-lock"></i> Próximo Conteúdo
                        </button>
                    </div>
                `;
            }
        }
    },

    concluirTarefa(tarefaId) {
        if (Algorithms.concluirTarefa(tarefaId)) {
            this.renderDashboard();
            this.updateSidebar();
        }
    },

    tentarAvancarProximoBloqueado(pendentes) {
        alert(`Ação Bloqueada! 🔒\n\nVocê só pode ir para o próximo conteúdo após marcar como CONCLUÍDO todos os ${pendentes} conteúdo(s) programado(s) de hoje.`);
    },

    avancarProximoConteudo() {
        const todayISO = new Date().toISOString().split('T')[0];
        const todasTarefas = Store.get('tarefas') || [];
        const tarefasHoje = todasTarefas.filter(t => t.dataStr === todayISO);
        const pendentes = tarefasHoje.filter(t => t.status !== 'concluida');

        // Validação estrita: se ainda houver tarefas pendentes hoje, bloqueia
        if (pendentes.length > 0) {
            alert(`Atenção: Você ainda precisa marcar como concluído os ${pendentes.length} conteúdo(s) pendente(s) de hoje antes de avançar!`);
            return;
        }

        // Procura o próximo tópico não estudado na trilha
        const materias = Store.get('materias') || [];
        let proximoTopico = null;
        let proximaMateria = null;

        // Prioridade 1: Revisões urgentes agendadas
        for (const m of materias) {
            const topicoRev = m.topicos.find(t => t.status === 'revisao_agendada');
            if (topicoRev) {
                proximoTopico = topicoRev;
                proximaMateria = m;
                break;
            }
        }

        // Prioridade 2: Tópicos regulares pendentes
        if (!proximoTopico) {
            for (const m of materias) {
                const topicoPend = m.topicos.find(t => t.status === 'pendente');
                if (topicoPend) {
                    proximoTopico = topicoPend;
                    proximaMateria = m;
                    break;
                }
            }
        }

        if (!proximoTopico) {
            alert("Parabéns! Todos os conteúdos programáticos do edital já foram estudados.");
            return;
        }

        // Cria a nova tarefa ativa para hoje
        const novaTarefa = {
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
            topico_id: proximoTopico.id,
            materia_nome: proximaMateria.nome,
            topico_nome: proximoTopico.nome,
            tipo: proximoTopico.status === 'revisao_agendada' ? 'REVISÃO URGENTE (Reforço)' : 'Teoria + Exercícios',
            duracaoMinutos: 50,
            dataStr: todayISO,
            status: 'pendente'
        };

        // Remove tarefas futuras duplicadas deste mesmo tópico para manter o cronograma uniforme
        const tarefasAtualizadas = todasTarefas.filter(t => !(t.topico_id === proximoTopico.id && t.status === 'pendente' && t.dataStr > todayISO));
        tarefasAtualizadas.push(novaTarefa);
        Store.set('tarefas', tarefasAtualizadas);

        this.renderDashboard();
        this.updateSidebar();

        alert(`✨ Próximo Conteúdo Desbloqueado com Sucesso!\n\n📚 Disciplina: ${proximaMateria.nome}\n📖 Tópico: ${proximoTopico.nome}\n\nO conteúdo foi adicionado às suas tarefas ativas de hoje. Bons estudos!`);
    },

    updateEditalProgress() {
        const materias = Store.get('materias') || [];
        let total = 0;
        let concluidos = 0;

        materias.forEach(m => {
            m.topicos.forEach(t => {
                total++;
                if (t.status === 'estudado') concluidos++;
            });
        });

        const pct = total === 0 ? 0 : Math.round((concluidos / total) * 100);
        document.getElementById('edital-progress-text').textContent = `${pct}%`;
        document.getElementById('edital-progress-label').textContent = `${concluidos} de ${total} tópicos dominados`;
        
        const circle = document.getElementById('edital-progress-circle');
        if (circle) {
            circle.style.strokeDasharray = `${pct}, 100`;
        }
    },

    // --- TRILHA / EDITAL EXPANDIDO ---
    renderTrilha(filtro = '') {
        const materias = Store.get('materias') || [];
        const container = document.getElementById('materias-container');
        
        const filtradas = materias.map(m => {
            if (!filtro) return m;
            const termo = filtro.toLowerCase();
            const bateMateria = m.nome.toLowerCase().includes(termo);
            const topicosFiltrados = m.topicos.filter(t => t.nome.toLowerCase().includes(termo));
            if (bateMateria) return m;
            if (topicosFiltrados.length > 0) {
                return { ...m, topicos: topicosFiltrados };
            }
            return null;
        }).filter(Boolean);

        if (filtradas.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500 py-10">Nenhum tópico encontrado para "${filtro}".</p>`;
            return;
        }

        container.innerHTML = filtradas.map(m => {
            const concluidos = m.topicos.filter(t => t.status === 'estudado').length;
            const pct = m.topicos.length === 0 ? 0 : Math.round((concluidos / m.topicos.length) * 100);
            
            return `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm" style="background-color: ${m.cor || '#4F46E5'}">
                            <i class="fa-solid ${m.icone || 'fa-book'}"></i>
                        </span>
                        <div>
                            <h3 class="font-bold text-lg md:text-xl">${m.nome}</h3>
                            <p class="text-xs text-gray-400">${m.topicos.length} tópicos cadastrados</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        ${concluidos > 0 ? `
                        <button onclick="App.reiniciarMateria('${m.id}')" title="Reiniciar conteúdos estudados desta disciplina" class="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
                            <i class="fa-solid fa-rotate-left text-[10px]"></i> Zerar Matéria
                        </button>` : ''}
                        <span class="text-sm font-black text-secondary">${pct}% Concluído</span>
                    </div>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-5">
                    <div class="bg-secondary h-2 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${m.topicos.map(t => {
                        let icon = 'fa-circle text-gray-300 dark:text-gray-600';
                        let statusText = 'Pendente';
                        let statusBadge = 'bg-gray-100 dark:bg-gray-700 text-gray-500';
                        let canResetTopic = false;
                        
                        if (t.status === 'estudado') {
                            icon = 'fa-check-circle text-secondary';
                            statusText = 'Dominado';
                            statusBadge = 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold';
                            canResetTopic = true;
                        } else if (t.status === 'revisao_agendada') {
                            icon = 'fa-triangle-exclamation text-rose-500';
                            statusText = 'Revisão Urgente';
                            statusBadge = 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold';
                            canResetTopic = true;
                        }

                        return `
                        <div class="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/30 text-xs">
                            <div class="flex items-center gap-2.5">
                                <i class="fa-solid ${icon} text-sm"></i>
                                <span class="${t.status === 'estudado' ? 'text-gray-400 line-through' : 'font-medium'}">${t.nome}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] px-2 py-0.5 rounded-full ${statusBadge}">${statusText}</span>
                                ${canResetTopic ? `
                                <button onclick="App.reiniciarTopicoIndividual('${t.id}')" title="Reiniciar este conteúdo (voltar para pendente)" class="text-gray-400 hover:text-amber-500 p-1 transition rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <i class="fa-solid fa-rotate-left text-xs"></i>
                                </button>` : ''}
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
        }).join('');
    },

    filtrarTrilha(termo) {
        this.renderTrilha(termo);
    },

    // --- SIMULADOS ADAPTATIVOS ---
    renderSimulados() {
        const simulados = Store.get('simulados') || [];
        const container = document.getElementById('simulados-historico');
        
        if (simulados.length === 0) {
            container.innerHTML = `<p class="text-gray-500 text-xs py-4">Nenhum simulado adaptativo realizado ainda. Gere o primeiro acima!</p>`;
            return;
        }

        container.innerHTML = simulados.slice().reverse().map(s => `
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center shadow-sm">
            <div>
                <p class="text-xs text-gray-400">Data: ${new Date(s.data).toLocaleDateString('pt-BR')}</p>
                <p class="font-bold text-base">Simulado Adaptativo (${s.questoes_total} questões)</p>
                <p class="text-xs text-gray-500 mt-0.5">${s.acertos} acertos de ${s.questoes_total}</p>
            </div>
            <div class="text-right">
                <p class="text-2xl font-black ${s.nota >= 70 ? 'text-secondary' : 'text-rose-500'}">${s.nota}%</p>
                <p class="text-[11px] text-gray-400 font-bold uppercase">Nota</p>
            </div>
        </div>`).join('');
    },

    iniciarSimulado() {
        const qtd = parseInt(document.getElementById('sim-qtd').value);
        const questoes = Algorithms.generateSimulado(qtd);
        
        const errorMsg = document.getElementById('sim-error-msg');
        if (questoes.length === 0) {
            errorMsg.classList.remove('hidden');
            return;
        }
        errorMsg.classList.add('hidden');

        this.currentSimulado = {
            questoes,
            respostas: new Array(questoes.length).fill(null),
            startTime: Date.now()
        };

        this.renderSimuladoExec();
        document.getElementById('view-simulados').classList.add('hidden');
        document.getElementById('view-simulado-exec').classList.remove('hidden');
        
        let secs = 0;
        this.simTimer = setInterval(() => {
            secs++;
            const m = Math.floor(secs / 60).toString().padStart(2, '0');
            const s = (secs % 60).toString().padStart(2, '0');
            document.getElementById('sim-timer').textContent = `${m}:${s}`;
        }, 1000);
    },

    renderSimuladoExec() {
        const container = document.getElementById('sim-questoes-container');
        const qs = this.currentSimulado.questoes;
        
        container.innerHTML = qs.map((q, i) => `
            <div class="mb-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-primary uppercase">${q.materia_nome || 'Disciplina'}</span>
                    <span class="text-xs text-gray-400">Questão ${i+1} de ${qs.length}</span>
                </div>
                <h4 class="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">${q.texto}</h4>
                <div class="space-y-3">
                    ${q.alternativas.map((alt, j) => `
                        <label class="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer transition">
                            <input type="radio" name="adapt_q_${i}" value="${j}" onchange="App.responderSimuladoAdaptativo(${i}, ${j})" class="mt-1 w-4 h-4 text-primary">
                            <span class="text-sm">${alt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    responderSimuladoAdaptativo(qIndex, altIndex) {
        if (this.currentSimulado) {
            this.currentSimulado.respostas[qIndex] = altIndex;
        }
    },

    finalizarSimulado() {
        if (!confirm("Deseja realmente entregar o simulado adaptativo agora?")) return;
        
        clearInterval(this.simTimer);
        const res = Algorithms.processSimuladoResult(this.currentSimulado.respostas, this.currentSimulado.questoes);
        
        alert(`Simulado finalizado com sucesso!\nSua nota: ${res.nota}%\nAcertos: ${res.acertos} de ${res.questoes_total}`);
        
        this.updateSidebar();
        document.getElementById('view-simulado-exec').classList.add('hidden');
        this.navigate('simulados');
    },

    // --- NOVO: TESTE FINAL DE CONHECIMENTOS ---
    renderTesteFinalHome() {
        const historico = Store.get('testes_finais') || [];
        const container = document.getElementById('testes-finais-historico');
        
        if (historico.length === 0) {
            container.innerHTML = `
                <div class="p-6 bg-white dark:bg-gray-800 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                    <p class="text-xs text-gray-400">Você ainda não realizou nenhum Teste Final. Inicie seu primeiro exame acima para receber o diagnóstico geral de prontidão!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <h3 class="font-bold text-lg border-b pb-2 dark:border-gray-700 mb-4">Exames Finais Anteriores</h3>
            <div class="space-y-3">
                ${historico.slice().reverse().map(h => `
                    <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                        <div>
                            <span class="text-xs text-gray-400">${new Date(h.data).toLocaleDateString('pt-BR')}</span>
                            <h4 class="font-bold text-base">Teste Final (${h.questoesTotal} questões)</h4>
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-md inline-block mt-1 ${h.corBadge}">${h.badge}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-black text-amber-500">${h.notaTRI}</span>
                            <span class="text-[10px] text-gray-400 block font-bold uppercase">TRI ENEM</span>
                            <span class="text-xs text-gray-500 font-semibold">${h.percentual}% de acerto</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    selecionarModoTesteFinal(qtd) {
        this.finalSelectedMode = qtd;
        [10, 20, 35].forEach(m => {
            const el = document.getElementById(`label-mode-${m}`);
            if (el) {
                if (m === qtd) {
                    el.className = "border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl cursor-pointer transition flex flex-col justify-between";
                } else {
                    el.className = "border dark:border-gray-700 p-4 rounded-2xl cursor-pointer hover:border-amber-500 transition flex flex-col justify-between";
                }
            }
        });
    },

    iniciarTesteFinal() {
        const qtd = this.finalSelectedMode || 20;
        const questoes = Algorithms.generateFinalTest(qtd);

        if (questoes.length === 0) {
            alert('Erro ao carregar o banco de questões.');
            return;
        }

        // Tempo limite: 2 minutos por questão
        const tempoTotalSegundos = qtd * 120;

        this.currentFinalTest = {
            questoes: questoes,
            respostas: new Array(questoes.length).fill(null),
            marcadasParaRevisao: new Set(),
            temposPorQuestao: new Array(questoes.length).fill(0),
            currentIndex: 0,
            startTime: Date.now(),
            tempoTotalSegundos: tempoTotalSegundos
        };

        this.finalTimeRemaining = tempoTotalSegundos;

        // Inicia o cronômetro regressivo
        if (this.finalTimerInterval) clearInterval(this.finalTimerInterval);
        this.finalTimerInterval = setInterval(() => {
            if (this.finalTimeRemaining > 0) {
                this.finalTimeRemaining--;
                // Incrementa tempo gasto na questão ativa
                if (this.currentFinalTest) {
                    this.currentFinalTest.temposPorQuestao[this.currentFinalTest.currentIndex]++;
                    this.updateFinalQuestionTimerDisplay();
                }
                this.updateFinalTimerDisplay();
            } else {
                clearInterval(this.finalTimerInterval);
                alert('O tempo do Teste Final encerrou! Entregando automaticamente a prova.');
                this.finalizarEProcessarTesteFinal();
            }
        }, 1000);

        this.updateFinalTimerDisplay();
        this.updateFinalQuestionTimerDisplay();
        this.renderFinalCurrentQuestion();
        this.renderFinalAnswerCard();

        document.getElementById('view-teste-final').classList.add('hidden');
        document.getElementById('view-teste-final-exec').classList.remove('hidden');
    },

    updateFinalTimerDisplay() {
        const m = Math.floor(this.finalTimeRemaining / 60).toString().padStart(2, '0');
        const s = (this.finalTimeRemaining % 60).toString().padStart(2, '0');
        const display = document.getElementById('final-timer-display');
        if (display) {
            display.textContent = `${m}:${s}`;
            if (this.finalTimeRemaining <= 300) { // menos de 5 min
                display.parentElement.classList.add('animate-pulse');
            } else {
                display.parentElement.classList.remove('animate-pulse');
            }
        }
    },

    updateFinalQuestionTimerDisplay() {
        if (!this.currentFinalTest) return;
        const idx = this.currentFinalTest.currentIndex;
        const segundos = this.currentFinalTest.temposPorQuestao[idx] || 0;
        const m = Math.floor(segundos / 60).toString().padStart(2, '0');
        const s = (segundos % 60).toString().padStart(2, '0');
        
        const display = document.getElementById('final-quest-timer-display');
        if (display) {
            display.textContent = `${m}:${s}`;
        }

        const cardDisplay = document.getElementById('final-quest-card-timer');
        if (cardDisplay) {
            cardDisplay.textContent = `${m}:${s}`;
        }

        const badge = document.getElementById('final-question-timer-badge');
        if (badge) {
            if (segundos >= 180) { // mais de 3 minutos
                badge.className = "bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse";
                badge.title = "Atenção: mais de 3 minutos nesta questão! Gerencie seu tempo com atenção.";
            } else {
                badge.className = "bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/40 text-primary dark:text-indigo-300 px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5";
                badge.title = "Tempo decorrido nesta questão";
            }
        }
    },

    renderFinalCurrentQuestion() {
        const test = this.currentFinalTest;
        if (!test) return;

        const idx = test.currentIndex;
        const q = test.questoes[idx];
        const container = document.getElementById('final-single-question-container');
        
        document.getElementById('final-quest-counter').textContent = `Questão ${idx + 1} de ${test.questoes.length}`;
        this.updateFinalQuestionTimerDisplay();

        // Atualiza estado do botão "Marcar para Revisar"
        const btnReview = document.getElementById('btn-final-review');
        if (btnReview) {
            if (test.marcadasParaRevisao.has(idx)) {
                btnReview.innerHTML = `<i class="fa-solid fa-bookmark"></i> Marcada para Revisar`;
                btnReview.className = "text-xs font-bold px-4 py-2 rounded-xl bg-amber-500 text-white transition flex items-center gap-1.5 shadow-sm";
            } else {
                btnReview.innerHTML = `<i class="fa-regular fa-bookmark"></i> Marcar para Revisar`;
                btnReview.className = "text-xs font-bold px-4 py-2 rounded-xl border border-amber-400 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition flex items-center gap-1.5";
            }
        }

        // Desabilita "Anterior" se for a primeira questão
        const btnPrev = document.getElementById('btn-final-prev');
        if (btnPrev) {
            btnPrev.disabled = idx === 0;
            btnPrev.style.opacity = idx === 0 ? '0.5' : '1';
        }

        // Texto do botão "Próxima" ou "Concluir"
        const btnNext = document.getElementById('btn-final-next');
        if (btnNext) {
            if (idx === test.questoes.length - 1) {
                btnNext.innerHTML = `Revisar Entrega <i class="fa-solid fa-check"></i>`;
            } else {
                btnNext.innerHTML = `Próxima <i class="fa-solid fa-arrow-right"></i>`;
            }
        }

        const respostaAtual = test.respostas[idx];

        container.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-black px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                            ${q.materia_nome}
                        </span>
                        <span class="text-xs text-gray-400 font-medium">${q.topico_nome}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/60 px-2.5 py-1 rounded-xl">
                        <i class="fa-solid fa-stopwatch text-indigo-500"></i>
                        <span>Nesta questão: <span id="final-quest-card-timer">00:00</span></span>
                    </div>
                </div>
                <h3 class="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-relaxed">${q.texto}</h3>
                <div class="space-y-3">
                    ${q.alternativas.map((alt, optIdx) => {
                        const checked = respostaAtual === optIdx;
                        return `
                        <label class="flex items-start gap-4 p-4 rounded-2xl border-2 ${checked ? 'border-primary bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'} cursor-pointer transition">
                            <input type="radio" name="final_active_q" value="${optIdx}" ${checked ? 'checked' : ''} onchange="App.responderQuestaoFinal(${idx}, ${optIdx})" class="mt-1 w-5 h-5 text-primary accent-indigo-600">
                            <span class="text-sm md:text-base leading-snug font-medium text-gray-800 dark:text-gray-200">${alt}</span>
                        </label>`;
                    }).join('')}
                </div>
            </div>
        `;
    },

    responderQuestaoFinal(qIndex, altIndex) {
        if (this.currentFinalTest) {
            this.currentFinalTest.respostas[qIndex] = altIndex;
            this.renderFinalAnswerCard();
        }
    },

    toggleMarkReviewCurrent() {
        if (!this.currentFinalTest) return;
        const idx = this.currentFinalTest.currentIndex;
        if (this.currentFinalTest.marcadasParaRevisao.has(idx)) {
            this.currentFinalTest.marcadasParaRevisao.delete(idx);
        } else {
            this.currentFinalTest.marcadasParaRevisao.add(idx);
        }
        this.renderFinalCurrentQuestion();
        this.renderFinalAnswerCard();
    },

    nextFinalQuestion() {
        if (!this.currentFinalTest) return;
        if (this.currentFinalTest.currentIndex < this.currentFinalTest.questoes.length - 1) {
            this.currentFinalTest.currentIndex++;
            this.renderFinalCurrentQuestion();
            this.renderFinalAnswerCard();
        } else {
            this.confirmarEntregaTesteFinal();
        }
    },

    prevFinalQuestion() {
        if (!this.currentFinalTest) return;
        if (this.currentFinalTest.currentIndex > 0) {
            this.currentFinalTest.currentIndex--;
            this.renderFinalCurrentQuestion();
            this.renderFinalAnswerCard();
        }
    },

    goToFinalQuestion(index) {
        if (!this.currentFinalTest) return;
        this.currentFinalTest.currentIndex = index;
        this.renderFinalCurrentQuestion();
        this.renderFinalAnswerCard();
    },

    renderFinalAnswerCard() {
        const test = this.currentFinalTest;
        if (!test) return;

        const grid = document.getElementById('final-card-grid');
        const progressLabel = document.getElementById('final-card-progress');
        
        let respondidas = 0;
        test.respostas.forEach(r => { if (r !== null) respondidas++; });
        if (progressLabel) progressLabel.textContent = `${respondidas}/${test.questoes.length}`;

        if (!grid) return;

        grid.innerHTML = test.questoes.map((_, idx) => {
            const isAtual = test.currentIndex === idx;
            const isRespondida = test.respostas[idx] !== null;
            const isRevisar = test.marcadasParaRevisao.has(idx);

            let corFundo = 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
            if (isRevisar) {
                corFundo = 'bg-amber-500 text-white font-bold';
            } else if (isRespondida) {
                corFundo = 'bg-primary text-white font-bold';
            }

            const bordaDestaque = isAtual ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-900 font-black' : '';

            return `
            <button onclick="App.goToFinalQuestion(${idx})" class="w-10 h-10 rounded-xl flex items-center justify-center text-xs transition transform hover:scale-105 ${corFundo} ${bordaDestaque}">
                ${idx + 1}
            </button>`;
        }).join('');
    },

    toggleRascunho() {
        const modal = document.getElementById('rascunho-modal');
        if (modal) modal.classList.toggle('hidden');
    },

    confirmarEntregaTesteFinal() {
        const test = this.currentFinalTest;
        if (!test) return;

        let pendentes = 0;
        test.respostas.forEach(r => { if (r === null) pendentes++; });
        const marcadas = test.marcadasParaRevisao.size;

        let msg = "Deseja realmente entregar o Teste Final?";
        if (pendentes > 0 || marcadas > 0) {
            msg = `Atenção!\nVocê ainda tem ${pendentes} questões em branco e ${marcadas} marcadas para revisar.\n\nDeseja entregar agora mesmo?`;
        }

        if (confirm(msg)) {
            this.finalizarEProcessarTesteFinal();
        }
    },

    finalizarEProcessarTesteFinal() {
        if (this.finalTimerInterval) clearInterval(this.finalTimerInterval);
        
        const test = this.currentFinalTest;
        const tempoGasto = test.tempoTotalSegundos - this.finalTimeRemaining;
        
        const resultado = Algorithms.processFinalTestResult(
            test.respostas, 
            test.questoes, 
            tempoGasto,
            test.temposPorQuestao
        );
        this.resultadoAtualDoTesteFinal = resultado;

        // Oculta tela de exame e renderiza o diagnóstico detalhado
        document.getElementById('view-teste-final-exec').classList.add('hidden');
        this.renderRelatorioTesteFinal(resultado);
        this.updateSidebar();
        this.navigate('teste-final-resultado');
    },

    renderRelatorioTesteFinal(res) {
        document.getElementById('final-report-pct').textContent = `${res.percentual}%`;
        document.getElementById('final-report-raw').textContent = `${res.acertos} de ${res.questoesTotal} acertos`;
        document.getElementById('final-report-tri').textContent = res.notaTRI;
        
        const mins = Math.floor(res.tempoSegundos / 60);
        const secs = res.tempoSegundos % 60;
        document.getElementById('final-report-tempo').textContent = `${mins}m ${secs}s`;

        // Tempo Médio por Questão
        const avgMins = Math.floor(res.tempoMedioSegundos / 60);
        const avgSecs = res.tempoMedioSegundos % 60;
        const tempoMedioEl = document.getElementById('final-report-tempo-medio');
        if (tempoMedioEl) {
            tempoMedioEl.textContent = `${avgMins}m ${avgSecs}s`;
        }
        const ritmoBadge = document.getElementById('final-report-ritmo-badge');
        if (ritmoBadge) {
            if (res.tempoMedioSegundos <= 180) {
                ritmoBadge.textContent = "Ritmo Ideal (≤3m)";
                ritmoBadge.className = "text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1";
            } else {
                ritmoBadge.textContent = "Atenção: Ritmo Lento (>3m)";
                ritmoBadge.className = "text-[11px] text-rose-600 dark:text-rose-400 font-bold block mt-1";
            }
        }

        const badgeEl = document.getElementById('final-report-badge');
        badgeEl.textContent = res.badge;
        badgeEl.className = `inline-block px-4 py-2 rounded-xl text-sm font-bold mb-4 ${res.corBadge}`;

        document.getElementById('final-report-veredito').textContent = res.veredito;

        // Renderiza barras de matérias
        const materiasContainer = document.getElementById('final-report-materias');
        materiasContainer.innerHTML = Object.keys(res.desempenhoPorMateria).map(matNome => {
            const st = res.desempenhoPorMateria[matNome];
            const pct = Math.round((st.acertos / st.total) * 100);
            return `
            <div>
                <div class="flex justify-between items-center text-sm font-semibold mb-1">
                    <span>${matNome}</span>
                    <span class="${pct >= 70 ? 'text-secondary' : 'text-rose-500'} font-bold">${pct}% (${st.acertos}/${st.total})</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div class="${pct >= 70 ? 'bg-secondary' : 'bg-rose-500'} h-2.5 rounded-full" style="width: ${pct}%"></div>
                </div>
            </div>`;
        }).join('');

        // Card de reforço: se não houver erros, oculta
        const reforcoCard = document.getElementById('final-reforco-card');
        if (res.erros === 0) {
            reforcoCard.classList.add('hidden');
        } else {
            reforcoCard.classList.remove('hidden');
            document.getElementById('final-reforco-desc').textContent = 
                `Identificamos ${res.erros} questões incorretas em ${res.topicosParaReforco.length} tópicos. Adicione esses tópicos à sua rotina para fixar os conteúdos imediatamente!`;
        }

        // Renderiza Gabarito Comentado com tempo gasto em cada questão
        const gabaritoContainer = document.getElementById('final-report-gabarito');
        gabaritoContainer.innerHTML = res.questoesDetalhadas.map((item, i) => {
            const q = item.questao;
            const acertou = item.acertou;
            const respDada = item.respostaDada !== null ? q.alternativas[item.respostaDada] : 'Não respondida';
            const corretaTexto = q.alternativas[q.correta];
            
            const tQ = item.tempoGasto || 0;
            const qM = Math.floor(tQ / 60);
            const qS = tQ % 60;
            const tempoQStr = `${qM}m ${qS}s`;

            return `
            <div class="p-5 rounded-2xl border ${acertou ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10'} space-y-3">
                <div class="flex flex-wrap justify-between items-center gap-2 text-xs">
                    <span class="font-bold text-gray-500 uppercase">${q.materia_nome} • ${q.topico_nome}</span>
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-full font-bold text-xs ${tQ > 180 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-indigo-50 text-primary dark:bg-indigo-950/50 dark:text-indigo-300'}">
                            <i class="fa-solid fa-stopwatch mr-1"></i> ${tempoQStr}
                        </span>
                        <span class="px-2.5 py-1 rounded-full font-bold ${acertou ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'}">
                            ${acertou ? 'Acertou' : 'Errou'}
                        </span>
                    </div>
                </div>
                <h4 class="font-bold text-base text-gray-900 dark:text-gray-100">${i+1}. ${q.texto}</h4>
                <div class="text-xs space-y-1">
                    <p class="${acertou ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}">
                        Sua Resposta: ${respDada}
                    </p>
                    ${!acertou ? `<p class="text-emerald-600 dark:text-emerald-400 font-semibold">Resposta Correta: ${corretaTexto}</p>` : ''}
                </div>
                <div class="mt-3 p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                    <span class="font-bold text-primary block mb-1"><i class="fa-solid fa-lightbulb"></i> Explicação Didática:</span>
                    ${q.explicacao}
                </div>
            </div>`;
        }).join('');
    },

    agendarReforcoDoTesteFinal() {
        if (!this.resultadoAtualDoTesteFinal || !this.resultadoAtualDoTesteFinal.topicosParaReforco) return;

        const materias = Store.get('materias') || [];
        const topicosErrados = this.resultadoAtualDoTesteFinal.topicosParaReforco;

        topicosErrados.forEach(errado => {
            materias.forEach(m => {
                m.topicos.forEach(t => {
                    if (t.id === errado.id) {
                        t.status = 'revisao_agendada';
                    }
                });
            });
        });

        Store.set('materias', materias);
        Algorithms.generateSchedule();

        alert(`${topicosErrados.length} tópicos foram reagendados como REVISÃO URGENTE na sua rotina diária com sucesso!`);
        this.navigate('dashboard');
    },

    // --- RECOMEÇAR ESTUDOS (MODAL & LÓGICA) ---
    abrirModalRecomecar() {
        const modal = document.getElementById('modal-recomecar');
        if (modal) modal.classList.remove('hidden');
    },

    fecharModalRecomecar() {
        const modal = document.getElementById('modal-recomecar');
        if (modal) modal.classList.add('hidden');
    },

    reiniciarEstudosERotina() {
        if (!confirm("Deseja realmente reiniciar os estudos e a rotina de testes?\n\n• Todos os tópicos do edital voltarão para 'Pendente'\n• Novas tarefas serão calculadas a partir de hoje\n• O histórico de simulados e testes será reiniciado\n\n(Suas configurações de meta e horas diárias serão mantidas)")) return;

        Store.resetEstudosERotinaTestes();
        this.renderDashboard();
        this.updateSidebar();
        this.updateEditalProgress();
        alert("Seus estudos e a rotina de testes foram reiniciados com sucesso! Seu novo cronograma está pronto.");
    },

    reiniciarTodosConteudosEstudados() {
        if (!confirm("Deseja reiniciar todos os conteúdos estudados? Os tópicos voltarão para 'Pendente' e serão re-agendados nas suas tarefas diárias.")) return;
        Store.resetAllConteudosEstudados();
        this.renderTrilha();
        this.updateSidebar();
        this.updateEditalProgress();
        alert("Todos os conteúdos estudados foram reiniciados com sucesso! Você pode estudá-los novamente.");
    },

    reiniciarMateria(materiaId) {
        if (!confirm("Deseja reiniciar os conteúdos estudados desta disciplina?")) return;
        Store.resetMateriaConteudos(materiaId);
        this.renderTrilha();
        this.updateSidebar();
        this.updateEditalProgress();
    },

    reiniciarTopicoIndividual(topicoId) {
        Store.resetTopicoIndividual(topicoId);
        this.renderTrilha();
        this.updateSidebar();
        this.updateEditalProgress();
    },

    executarReset(tipo) {
        if (tipo === 3) {
            this.fecharModalRecomecar();
            this.reiniciarTodosConteudosEstudados();
        } else if (tipo === 1) {
            if (!confirm("Tem certeza que deseja reiniciar o progresso da trilha? Suas tarefas serão recalculadas a partir de hoje.")) return;
            Store.resetProgressOnly();
            this.fecharModalRecomecar();
            this.updateSidebar();
            this.navigate('dashboard');
            alert("Trilha reiniciada com sucesso! Seu novo cronograma foi gerado.");
        } else if (tipo === 2) {
            if (!confirm("ATENÇÃO: Isso apagará todos os dados, notas de simulados e configurações de meta. Deseja continuar?")) return;
            Store.resetAllFactory();
            this.fecharModalRecomecar();
            this.navigate('onboarding');
            alert("Aplicativo restaurado para as configurações iniciais de fábrica.");
        }
    },

    // --- STATS GERAIS ---
    renderStats() {
        const simulados = Store.get('simulados') || [];
        const testesFinais = Store.get('testes_finais') || [];
        
        document.getElementById('stats-sim-total').textContent = simulados.length;
        document.getElementById('stats-final-total').textContent = testesFinais.length;
        
        if (simulados.length > 0) {
            const media = simulados.reduce((acc, s) => acc + s.nota, 0) / simulados.length;
            document.getElementById('stats-sim-media').textContent = Math.round(media);
        } else {
            document.getElementById('stats-sim-media').textContent = '0';
        }

        const tarefas = Store.get('tarefas') || [];
        const temRevisao = tarefas.some(t => t.status === 'pendente' && t.tipo.includes('URGENTE'));
        
        const recList = document.getElementById('recomenda-lista');
        let recs = [];
        
        if (temRevisao) {
            recs.push(`
                <li class="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5">
                    <i class="fa-solid fa-triangle-exclamation text-rose-500 mt-0.5"></i>
                    <div>
                        <span class="font-bold text-rose-700 dark:text-rose-300 block">Lacunas de Aprendizagem Detectadas</span>
                        Você errou questões recentes nos simulados. O algoritmo agendou tarefas de reforço prioritárias para hoje e os próximos dias.
                    </div>
                </li>
            `);
        }
        
        if (testesFinais.length > 0) {
            const ultimoTeste = testesFinais[testesFinais.length - 1];
            recs.push(`
                <li class="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
                    <i class="fa-solid fa-award text-amber-500 mt-0.5"></i>
                    <div>
                        <span class="font-bold text-amber-700 dark:text-amber-300 block">Último Teste Final: TRI ${ultimoTeste.notaTRI} (${ultimoTeste.percentual}%)</span>
                        ${ultimoTeste.veredito}
                    </div>
                </li>
            `);
        } else {
            recs.push(`
                <li class="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/50 flex items-start gap-2.5">
                    <i class="fa-solid fa-lightbulb text-primary mt-0.5"></i>
                    <div>
                        <span class="font-bold text-indigo-700 dark:text-indigo-300 block">Dica do Sistema</span>
                        Realize o Teste Final para obter uma estimativa confiável da sua nota TRI do ENEM e verificar sua prontidão para a prova.
                    </div>
                </li>
            `);
        }

        recList.innerHTML = recs.join('');
    },

    // --- POMODORO (TIMER AJUSTÁVEL) ---
    openPomodoro() {
        document.getElementById('pomodoro-modal').classList.remove('hidden');
        this.updatePomodoroDisplay();
    },
    closePomodoro() {
        document.getElementById('pomodoro-modal').classList.add('hidden');
    },
    setPomodoroMinutes(minutes) {
        const min = parseInt(minutes);
        if (isNaN(min) || min < 1) return;
        this.pausePomodoro();
        this.pomodoroInitialDuration = min * 60;
        this.pomodoroTime = min * 60;
        this.updatePomodoroDisplay();
        
        const input = document.getElementById('pom-custom-input');
        if (input) input.value = min;

        // Atualiza destaque visual dos botões pré-definidos
        document.querySelectorAll('.pom-preset-btn').forEach(btn => {
            if (parseInt(btn.dataset.min) === min) {
                btn.className = "pom-preset-btn px-3 py-1.5 text-xs font-bold rounded-xl border border-primary bg-primary/10 text-primary transition";
            } else {
                btn.className = "pom-preset-btn px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition";
            }
        });
    },
    applyCustomPomodoro() {
        const input = document.getElementById('pom-custom-input');
        if (input && input.value) {
            this.setPomodoroMinutes(input.value);
        }
    },
    resetPomodoro() {
        this.pausePomodoro();
        this.pomodoroTime = this.pomodoroInitialDuration || (25 * 60);
        this.updatePomodoroDisplay();
    },
    updatePomodoroDisplay() {
        const m = Math.floor(this.pomodoroTime / 60).toString().padStart(2, '0');
        const s = (this.pomodoroTime % 60).toString().padStart(2, '0');
        document.getElementById('pom-display').textContent = `${m}:${s}`;
    },
    startPomodoro() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.pomodoroInterval = setInterval(() => {
            if (this.pomodoroTime > 0) {
                this.pomodoroTime--;
                this.updatePomodoroDisplay();
            } else {
                this.pausePomodoro();
                alert('Pomodoro Finalizado! Excelente foco. Descanse 5 minutos.');
                this.pomodoroTime = this.pomodoroInitialDuration || (25 * 60);
                this.updatePomodoroDisplay();
            }
        }, 1000);
    },
    pausePomodoro() {
        this.isRunning = false;
        clearInterval(this.pomodoroInterval);
    }
};

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
