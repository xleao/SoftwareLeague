// Initialize Supabase Client
const supabaseUrl = 'https://gztpkalurwkfnruphnaq.supabase.co';
const supabaseKey = 'sb_publishable_mSuOFsknLaz3x2srGPv0LA_1-7VUTck';
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Typewriter Effect
const phrases = [
    "Compilando los mejores equipos...",
    "Ejecutando torneo_2026.exe...",
    "¡Solo puede quedar un campeón!",
    "function getChampion() { return 'Tú'; }"
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
const typewriterElement = document.getElementById('typewriter');

function type() {
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at the end
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before typing new phrase
    }

    setTimeout(type, typingSpeed);
}

// Initialize Typewriter
document.addEventListener('DOMContentLoaded', () => {
    if(typewriterElement) {
        setTimeout(type, 1000);
    }
});


// Smooth scrolling for anchor links (exclude admin link)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.id === 'footerAdminLink') return;
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - 40; // Sweet spot offset (perfect top margin)
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Interactive Bracket Advancement System
document.addEventListener('DOMContentLoaded', () => {
    // Store original default team text as data-default-text on load
    document.querySelectorAll('.bracket-node').forEach(node => {
        const teamEl = node.querySelector('.node-team');
        if (teamEl) {
            node.setAttribute('data-default-text', teamEl.textContent.trim());
        }
    });

    document.querySelectorAll('.bracket-node').forEach(node => {
        // Inject admin clear button
        const clearBtn = document.createElement('div');
        clearBtn.className = 'admin-clear-btn';
        clearBtn.innerHTML = '<i class="fa-solid fa-eraser"></i>';
        clearBtn.title = 'Limpiar equipo';
        node.appendChild(clearBtn);

        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!document.body.classList.contains('admin-mode-enabled')) return;
            const t = node.querySelector('.node-team');
            const s = node.querySelector('.node-score');
            const p = node.querySelector('.team-photo');
            const v = node.querySelector('.vote-count');
            
            const defaultText = node.getAttribute('data-default-text') || 'Por definir';
            
            if(t) t.textContent = defaultText;
            if(s) s.textContent = '_';
            if(p) {
                if (defaultText === 'Por definir') {
                    p.innerHTML = '<i class="fa-solid fa-code"></i>';
                    p.classList.remove('empty');
                } else {
                    p.innerHTML = '';
                    p.classList.add('empty');
                }
            }
            if(v) v.textContent = '0';
        });

        const teamEl = node.querySelector('.node-team');
        if (teamEl) {
            teamEl.addEventListener('click', (e) => {
                if (!document.body.classList.contains('admin-mode-enabled')) return;
                if (teamEl.querySelector('.admin-team-select')) return;
                
                e.stopPropagation();
                
                // Disable contenteditable to ensure browser renders select correctly
                teamEl.removeAttribute('contenteditable');
                
                const currentText = teamEl.textContent.trim();
                const select = document.createElement('select');
                select.className = 'admin-team-select';
                
                const defaultText = node.getAttribute('data-default-text') || 'Por definir';
                const options = ['SW 23-1', 'SW 23-2', 'SW 24-1', 'SW 24-2', 'SW 25-1', 'SW 25-2', 'SW 26-1', 'SW 26-2'];
                
                if (defaultText !== 'Por definir' && !options.includes(defaultText)) {
                    options.unshift(defaultText);
                }
                options.unshift('Por definir');
                
                options.forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt;
                    el.textContent = opt;
                    if (opt === currentText) el.selected = true;
                    select.appendChild(el);
                });
                
                teamEl.textContent = '';
                teamEl.appendChild(select);
                select.focus();
                
                const finishEdit = () => {
                    const val = select.value;
                    select.remove();
                    teamEl.textContent = val;
                };
                
                select.addEventListener('click', (e) => e.stopPropagation());
                select.addEventListener('blur', finishEdit);
                select.addEventListener('change', finishEdit);
            });
        }

        const scoreEl = node.querySelector('.node-score');
        if (scoreEl) {
            scoreEl.addEventListener('click', (e) => {
                if (!document.body.classList.contains('admin-mode-enabled')) return;
                if (scoreEl.querySelector('.admin-score-select')) return;
                
                e.stopPropagation();
                
                const currentText = scoreEl.textContent.trim();
                const select = document.createElement('select');
                select.className = 'admin-score-select';
                
                // Score options from '_' and '0' through '9'
                const options = ['_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                
                options.forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt;
                    el.textContent = opt;
                    if (opt === currentText) el.selected = true;
                    select.appendChild(el);
                });
                
                scoreEl.textContent = '';
                scoreEl.appendChild(select);
                select.focus();
                
                const finishEdit = () => {
                    const val = select.value;
                    select.remove();
                    scoreEl.textContent = val;
                };
                
                select.addEventListener('click', (e) => e.stopPropagation());
                select.addEventListener('blur', finishEdit);
                select.addEventListener('change', finishEdit);
            });
        }

    });

    // Load and Synchronize all Bracket Data from Supabase
    async function loadBracketData() {
        try {
            // Fetch all bracket nodes from Supabase
            const { data: nodes, error } = await supabaseClient
                .from('nodos_bracket')
                .select('*');
                
            if (error) throw error;
            
            // Create a fast map: id_nodo -> data
            const nodeMap = {};
            if (nodes) {
                nodes.forEach(n => {
                    nodeMap[n.id_nodo] = n;
                });
            }
            
            // Apply data to DOM
            document.querySelectorAll('.bracket-node').forEach(node => {
                const nodeId = getNodeUniqueId(node);
                if (nodeId && nodeMap[nodeId]) {
                    const data = nodeMap[nodeId];
                    
                    // Update Team Name
                    const teamEl = node.querySelector('.node-team');
                    if (teamEl && data.nombre_equipo !== null) {
                        teamEl.textContent = data.nombre_equipo.replace(/[\{\}]/g, '').trim();
                    }
                    
                    // Update Goals / Score
                    const scoreEl = node.querySelector('.node-score');
                    if (scoreEl && data.goles !== null) {
                        scoreEl.textContent = data.goles;
                    }
                }
            });
            
            // Initialize vote system for all nodes with the loaded values
            document.querySelectorAll('.bracket-node').forEach(node => {
                initVoteSystem(node, nodeMap);
            });
            
            // Highlight connector lines
            refreshBracketClassification();
            
            // Fetch Champion State
            const { data: stateData, error: stateError } = await supabaseClient
                .from('estado_torneo')
                .select('*')
                .eq('clave', 'champion_text_v2')
                .maybeSingle();
                
            if (!stateError && stateData) {
                const savedChampion = stateData.valor;
                const championSpan = document.querySelector('.champion-node span');
                const championBlock = document.querySelector('.champion-node');
                if (championSpan) {
                    championSpan.textContent = savedChampion;
                    if (savedChampion !== 'return Campeón;' && savedChampion !== 'return Por definir;' && !savedChampion.includes('Por definir')) {
                        if (championBlock) championBlock.style.animation = 'championGlow 1.2s infinite alternate';
                    }
                }
            }
        } catch (err) {
            console.error('Error al cargar datos de Supabase:', err);
            // Fallback: load at least an empty vote system so hearts aren't broken if offline
            document.querySelectorAll('.bracket-node').forEach(node => {
                initVoteSystem(node);
            });
            refreshBracketClassification();
        }
    }
    
    // Call load on startup
    loadBracketData();

    // Champion Node manual dropdown selection
    const championBlock = document.querySelector('.champion-node');
    if (championBlock) {
        const championSpan = championBlock.querySelector('span');
        if (championSpan) {
            championSpan.addEventListener('click', (e) => {
                if (!document.body.classList.contains('admin-mode-enabled')) return;
                if (championSpan.querySelector('.admin-team-select')) return;
                
                e.stopPropagation();
                
                const currentText = championSpan.textContent.replace('return ', '').replace(';', '').trim();
                const select = document.createElement('select');
                select.className = 'admin-team-select';
                
                const options = ['Campeón', 'SW 23-1', 'SW 23-2', 'SW 24-1', 'SW 24-2', 'SW 25-1', 'SW 25-2', 'SW 26-1', 'SW 26-2'];
                
                options.forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt;
                    el.textContent = opt;
                    if (opt === currentText) el.selected = true;
                    select.appendChild(el);
                });
                
                championSpan.textContent = '';
                championSpan.appendChild(select);
                select.focus();
                
                const finishEdit = () => {
                    const val = select.value;
                    select.remove();
                    if (val === 'Campeón') {
                        championSpan.textContent = 'return Campeón;';
                        championBlock.style.animation = 'none';
                    } else {
                        championSpan.textContent = `return ${val};`;
                        championBlock.style.animation = 'championGlow 1.2s infinite alternate';
                    }
                };
                
                select.addEventListener('click', (e) => e.stopPropagation());
                select.addEventListener('blur', finishEdit);
                select.addEventListener('change', finishEdit);
            });
        }
    }



    // --- Inline Admin Control Bar & Footer Access Logic ---
    const adminBar = document.getElementById('adminControlBar');
    const adminBarSaveBtn = document.getElementById('adminBarSaveBtn');
    const adminBarLockBtn = document.getElementById('adminBarLockBtn');
    
    const footerAdminLink = document.getElementById('footerAdminLink');
    const footerAdminPrompt = document.getElementById('footerAdminPrompt');
    const footerAdminPassword = document.getElementById('footerAdminPassword');
    const footerAdminUnlockBtn = document.getElementById('footerAdminUnlockBtn');
    const footerAdminError = document.getElementById('footerAdminError');
    
    // Toggle footer input display when clicking Admin Access
    if (footerAdminLink) {
        footerAdminLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // If already logged in, clicking acts as Logout!
            if (document.body.classList.contains('admin-mode-enabled')) {
                logoutAdminMode();
                return;
            }
            
            // Otherwise, show password prompt
            footerAdminLink.style.display = 'none';
            footerAdminPrompt.style.display = 'inline-flex';
            footerAdminPassword.value = '';
            footerAdminError.textContent = '';
            footerAdminPassword.focus();
        });
    }
    
    // Verify password from footer prompt securely via Supabase RPC
    if (footerAdminUnlockBtn) {
        footerAdminUnlockBtn.addEventListener('click', async () => {
            const password = footerAdminPassword.value.trim();
            
            try {
                // Call secure database function
                const { data: isValid, error } = await supabaseClient
                    .rpc('verificar_admin', { p_usuario: 'admin', p_password: password });
                
                if (error) throw error;
                
                if (isValid === true) {
                    loginAdminMode();
                } else {
                    footerAdminError.textContent = 'x';
                    footerAdminPassword.value = '';
                    footerAdminPassword.focus();
                }
            } catch (err) {
                console.error('Error de autenticación:', err);
                footerAdminError.textContent = '!';
            }
        });
        
        footerAdminPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') footerAdminUnlockBtn.click();
        });
    }
    
    function loginAdminMode() {
        document.body.classList.add('admin-mode-enabled');
        
        // Show active Admin top sticky bar
        if (adminBar) adminBar.style.display = 'block';
        
        // Reset footer text & prompt
        footerAdminPrompt.style.display = 'none';
        footerAdminLink.style.display = 'inline-block';
        footerAdminLink.innerHTML = '<i class="fa-solid fa-unlock text-yellow"></i> Admin Active';
        
        // Set vote elements contenteditable
        document.querySelectorAll('.vote-count').forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });
    }
    
    function logoutAdminMode() {
        document.body.classList.remove('admin-mode-enabled');
        
        // Hide active Admin top sticky bar
        if (adminBar) adminBar.style.display = 'none';
        
        // Reset footer link text
        footerAdminLink.innerHTML = '<i class="fa-solid fa-lock"></i> Admin Access';
        footerAdminLink.style.display = 'inline-block';
        footerAdminPrompt.style.display = 'none';
        footerAdminPassword.value = '';
        
        // Set elements non-editable
        document.querySelectorAll('.vote-count').forEach(el => {
            el.removeAttribute('contenteditable');
        });
    }
    
    // Lock / Logout Admin Mode from top bar button too
    if (adminBarLockBtn) {
        adminBarLockBtn.addEventListener('click', () => {
            logoutAdminMode();
        });
    }
    
    // Save Admin Modifications
    if (adminBarSaveBtn) {
        adminBarSaveBtn.addEventListener('click', async () => {
            const nodesToUpsert = [];
            
            document.querySelectorAll('.bracket-node').forEach(node => {
                const nodeId = getNodeUniqueId(node);
                if (nodeId) {
                    const teamEl = node.querySelector('.node-team');
                    const scoreEl = node.querySelector('.node-score');
                    const voteCountEl = node.querySelector('.vote-count');
                    
                    const cleanTeam = teamEl ? teamEl.textContent.replace(/[\{\}]/g, '').trim() : 'Por definir';
                    const cleanScore = scoreEl ? scoreEl.textContent.trim() : '_';
                    const newVotes = voteCountEl ? (parseInt(voteCountEl.textContent.trim()) || 0) : 0;
                    
                    nodesToUpsert.push({
                        id_nodo: nodeId,
                        nombre_equipo: cleanTeam,
                        goles: cleanScore,
                        corazones: newVotes
                    });
                }
            });
            
            try {
                // Bulk upsert all nodes to Supabase
                const { error: upsertError } = await supabaseClient
                    .from('nodos_bracket')
                    .upsert(nodesToUpsert);
                    
                if (upsertError) throw upsertError;
                
                // Save champion text
                const championSpan = document.querySelector('.champion-node span');
                if (championSpan) {
                    const championText = championSpan.textContent.trim();
                    const { error: champError } = await supabaseClient
                        .from('estado_torneo')
                        .upsert({ clave: 'champion_text_v2', valor: championText });
                        
                    if (champError) throw champError;
                }
                
                // Reload and refresh
                await loadBracketData();
                alert('¡Bracket de la Software League guardado y sincronizado con éxito en Supabase!');
            } catch (err) {
                console.error('Error al guardar datos:', err);
                alert('Hubo un error al guardar los datos en la base de datos: ' + err.message);
            }
        });
    }
    
    // Helper to evaluate and trigger connecting lines glows sequentially
    function refreshBracketClassification() {
        document.querySelectorAll('.bracket-match').forEach(match => {
            const nodes = Array.from(match.querySelectorAll('.bracket-node'));
            if (nodes.length < 2) return;
            
            const s1 = parseInt(nodes[0].querySelector('.node-score')?.textContent) || 0;
            const s2 = parseInt(nodes[1].querySelector('.node-score')?.textContent) || 0;
            
            const rConnector = match.querySelector('.bracket-connector.right');
            const lConnector = match.querySelector('.bracket-connector.left');
            
            if (rConnector) {
                if (s1 > s2 || s2 > s1) {
                    rConnector.style.opacity = '1';
                    rConnector.style.background = 'var(--group-a-color)';
                    rConnector.style.boxShadow = '0 0 10px var(--group-a-color)';
                } else {
                    rConnector.style.opacity = '0.4';
                }
            }
            if (lConnector) {
                if (s1 > s2 || s2 > s1) {
                    lConnector.style.opacity = '1';
                    lConnector.style.background = 'var(--group-b-color)';
                    lConnector.style.boxShadow = '0 0 10px var(--group-b-color)';
                } else {
                    lConnector.style.opacity = '0.4';
                }
            }
        });
    }
    
    // Initial run to highlight classification lines
    refreshBracketClassification();
    initFloatingCodeBackground();

    // Mobile App-Style Tabbed Bracket Navigation
    const mobileTabs = document.querySelectorAll('.m-tab');
    const bracketContainer = document.querySelector('.bracket-full');
    
    if (mobileTabs.length > 0 && bracketContainer) {
        mobileTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs
                mobileTabs.forEach(t => t.classList.remove('active'));
                
                // Add active to clicked tab
                tab.classList.add('active');
                
                // Change bracket visibility class
                const target = tab.getAttribute('data-target');
                bracketContainer.className = `bracket-full show-${target}`;
            });
        });
    }
});

// Vote System Functions
function getNodeUniqueId(node) {
    const match = node.closest('.bracket-match');
    const column = node.closest('.bracket-column');
    if (!match || !column) return null;
    
    const columnsArray = Array.from(column.parentElement.children);
    const colIndex = columnsArray.indexOf(column);
    
    const matchesInCol = Array.from(column.querySelectorAll('.bracket-match'));
    const matchIndex = matchesInCol.indexOf(match);
    
    const nodesInMatch = Array.from(match.querySelectorAll('.bracket-node'));
    const nodeIndex = nodesInMatch.indexOf(node);
    
    return `node_${colIndex}_${matchIndex}_${nodeIndex}`;
}

function initVoteSystem(node, nodeMap = null) {
    const teamNameEl = node.querySelector('.node-team');
    if (!teamNameEl) return;
    
    const teamName = teamNameEl.textContent.trim();
    
    // Remove existing vote button if any
    const existingBtn = node.querySelector('.vote-btn');
    if (existingBtn) existingBtn.remove();
    
    // Hide vote buttons for default placeholders
    if (teamName === '_' || teamName === '' || teamName === 'Por definir' || teamName.startsWith('Ganador M') || teamName.startsWith('Finalista ') || teamName.startsWith('Ganador [')) {
        return;
    }
    
    const nodeId = getNodeUniqueId(node);
    if (!nodeId) return;
    
    const userVotedKey = nodeId + '_user_voted_v2';
    
    // Get initial hearts count from Supabase nodeMap if present, fallback to 0
    let currentCount = 0;
    if (nodeMap && nodeMap[nodeId]) {
        currentCount = parseInt(nodeMap[nodeId].corazones) || 0;
    }
    
    const isVoted = localStorage.getItem(userVotedKey) === 'true';
    
    const voteBtn = document.createElement('button');
    voteBtn.className = 'vote-btn';
    if (isVoted) voteBtn.classList.add('voted');
    voteBtn.title = 'Votar por este equipo';
    voteBtn.innerHTML = `
        <i class="${isVoted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        <span class="vote-count">${currentCount}</span>
    `;
    
    // Append inside node before score
    const scoreEl = node.querySelector('.node-score');
    if (scoreEl) {
        node.insertBefore(voteBtn, scoreEl);
    } else {
        node.appendChild(voteBtn);
    }
    
    // If admin mode is active, ensure elements are editable
    if (document.body.classList.contains('admin-mode-enabled')) {
        const countEl = voteBtn.querySelector('.vote-count');
        if (countEl) countEl.setAttribute('contenteditable', 'true');
    }
    
    // Attach listener
    voteBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // CRITICAL: Stop propagation so we don't trigger tournament classification
        
        // Bypassed if Admin Mode is active
        if (document.body.classList.contains('admin-mode-enabled')) {
            return;
        }
        
        if (voteBtn.disabled) return;
        voteBtn.disabled = true;
        
        const isCurrentlyVoted = voteBtn.classList.contains('voted');
        
        // Get user public IP securely
        let userIp = 'unknown_client';
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            userIp = ipData.ip;
        } catch (ipErr) {
            // Fallback: device-specific local UUID for ad-blockers
            let clientUuid = localStorage.getItem('software_league_client_uuid');
            if (!clientUuid) {
                clientUuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('software_league_client_uuid', clientUuid);
            }
            userIp = 'fallback_' + clientUuid;
        }
        
        try {
            if (!isCurrentlyVoted) {
                // USER WANTS TO VOTE
                // Try registering the IP/vote in Supabase
                const { error: regError } = await supabaseClient
                    .from('registro_votos')
                    .insert({ id_nodo: nodeId, ip_usuario: userIp });
                
                if (regError) {
                    if (regError.code === '23505') {
                        alert('¡Ya registraste tu voto por este equipo en este partido!');
                    } else {
                        throw regError;
                    }
                    voteBtn.disabled = false;
                    return;
                }
                
                // Get current database count to increment atomically
                const { data: nodeData } = await supabaseClient
                    .from('nodos_bracket')
                    .select('corazones')
                    .eq('id_nodo', nodeId)
                    .single();
                    
                const nextVotes = (nodeData?.corazones || 0) + 1;
                
                // Update counter in DB
                await supabaseClient
                    .from('nodos_bracket')
                    .update({ corazones: nextVotes })
                    .eq('id_nodo', nodeId);
                
                voteBtn.classList.add('voted');
                voteBtn.querySelector('i').className = 'fa-solid fa-heart';
                localStorage.setItem(userVotedKey, 'true');
                voteBtn.querySelector('.vote-count').textContent = nextVotes;
                triggerRisingHearts(e, voteBtn);
            } else {
                // USER WANTS TO UNVOTE
                // Delete register from database
                const { error: delError } = await supabaseClient
                    .from('registro_votos')
                    .delete()
                    .eq('id_nodo', nodeId)
                    .eq('ip_usuario', userIp);
                    
                if (delError) throw delError;
                
                // Get current DB count
                const { data: nodeData } = await supabaseClient
                    .from('nodos_bracket')
                    .select('corazones')
                    .eq('id_nodo', nodeId)
                    .single();
                    
                const nextVotes = Math.max(0, (nodeData?.corazones || 0) - 1);
                
                // Update counter in DB
                await supabaseClient
                    .from('nodos_bracket')
                    .update({ corazones: nextVotes })
                    .eq('id_nodo', nodeId);
                
                voteBtn.classList.remove('voted');
                voteBtn.querySelector('i').className = 'fa-regular fa-heart';
                localStorage.setItem(userVotedKey, 'false');
                voteBtn.querySelector('.vote-count').textContent = nextVotes;
            }
        } catch (err) {
            console.error('Error al procesar voto:', err);
            alert('No se pudo procesar tu voto. Por favor, inténtalo de nuevo.');
        } finally {
            voteBtn.disabled = false;
        }
    });
}

function triggerRisingHearts(e, btn) {
    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top;
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const heart = document.createElement('i');
            heart.className = 'fa-solid fa-heart floating-heart';
            
            const offsetLeft = (Math.random() - 0.5) * 30; // -15px to 15px
            const size = Math.random() * 0.35 + 0.65; // 0.65rem to 1.0rem
            const duration = Math.random() * 0.25 + 0.55; // 0.55s to 0.8s
            const colors = ['#ff4757', '#ff6b81', '#ffa502', '#9b59b6', '#e056fd'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            heart.style.left = `${btnCenterX + offsetLeft + window.scrollX}px`;
            heart.style.top = `${btnCenterY + window.scrollY}px`;
            heart.style.fontSize = `${size}rem`;
            heart.style.color = color;
            heart.style.animationDuration = `${duration}s`;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, duration * 1000);
        }, i * 70);
    }
}

// Secret Hacker Riddle Array
const riddles = [
    { q: "Tengo que llamarme a mí mismo para resolver problemas más pequeños. Sin mi caso base, tu memoria explotará. ¿Qué soy?", a: "recursividad" },
    { q: "Soy el lenguaje de los transistores, hablo solo con dos palabras. Si me sumas uno a uno, obtendrás diez en mi mundo. ¿Qué soy?", a: "binario" },
    { q: "Viajo en el tiempo para salvar tu código. Registro tus commits pero le temo a los conflictos de fusión. ¿Qué soy?", a: "git" },
    { q: "Nací de una polilla atrapada en un relé de Harvard en 1947. Si me encuentras te alegras, pero si me oculto tu programa fallará. ¿Qué soy?", a: "bug" },
    { q: "Soy la pila de platos que creció tanto que tocó el techo y desbordó la cocina. Los desarrolladores me buscan cuando están desesperados. ¿Qué soy?", a: "stack overflow" }
];
let currentRiddleIndex = -1;

function initFloatingCodeBackground() {
    const bgContainer = document.getElementById('floatingCodeContainer') || document.querySelector('.bg-elements');
    if (!bgContainer) return;
    
    // Console Welcome Message
    console.log("%c🔓 [Software League Easter Egg] %cSe han ocultado 5 acertijos informáticos en los fragmentos de código del fondo. ¡Encuéntralos y haz clic en ellos para revelarlos!", "color: #f5b041; font-weight: bold; font-size: 1.1rem; font-family: 'Fira Code', monospace;", "color: #2eb3d9; font-family: 'Poppins', sans-serif;");

    const codeTokens = [
        '<html>', '<body>', 'const champion = "UNDEFINED";', 'for(let i=0; i<teams.length; i++)',
        'playMatch();', 'function getChampion()', 'return winner;', 'if (scoreA > scoreB)',
        'const bracket = new Tournament();', 'import { bracket } from "software-league";',
        'console.log("Compiling...");', 'async function fetchScores()', 'await match.start();',
        'team.votes++', 'document.getElementById("champion")', '{ status: 200, ok: true }',
        'const root = createRoot(document);', 'export default function SoftwareLeague()',
        'const activeTeams = ["SW 23-1", "SW 24-2"];', '<li>{team.name}</li>', 'const adminMode = true;',
        'Object.freeze(bracket);', 'Math.max(...scores)', 'localStorage.getItem("champion_text_v2")'
    ];
    
    for (let i = 0; i < 20; i++) {
        const token = document.createElement('div');
        token.className = 'floating-code-particle';
        token.textContent = codeTokens[Math.floor(Math.random() * codeTokens.length)];
        
        // Frame distribution: place elements in screen margins to keep the central Hero texts 100% clear
        let leftPercent, topPercent;
        const placementZone = Math.floor(Math.random() * 4);
        if (placementZone === 0) {
            // Left margin
            leftPercent = Math.random() * 20; // 0% to 20%
            topPercent = Math.random() * 90;  // 0% to 90%
        } else if (placementZone === 1) {
            // Right margin
            leftPercent = Math.random() * 20 + 78; // 78% to 98%
            topPercent = Math.random() * 90;       // 0% to 90%
        } else if (placementZone === 2) {
            // Top margin
            leftPercent = Math.random() * 90; // 0% to 90%
            topPercent = Math.random() * 15;  // 0% to 15%
        } else {
            // Bottom margin
            leftPercent = Math.random() * 90;      // 0% to 90%
            topPercent = Math.random() * 15 + 80;  // 80% to 95%
        }
        
        token.style.left = `${leftPercent}%`;
        token.style.top = `${topPercent}%`;
        token.style.fontSize = `${Math.random() * 0.3 + 0.75}rem`;
        
        // Faint slow floating animation
        const duration = Math.random() * 45 + 45; 
        const delay = Math.random() * -90;
        token.style.animation = `floatParticle ${duration}s infinite ease-in-out`;
        token.style.animationDelay = `${delay}s`;
        
        // Assign a secret riddle index to this particle
        const riddleIdx = Math.floor(Math.random() * riddles.length);
        token.setAttribute('data-riddle-index', riddleIdx);
        token.title = "🔓 Clic para hackear acertijo";
        
        // Trigger riddle card on click
        token.addEventListener('click', (e) => {
            e.stopPropagation();
            openRiddleCard(riddleIdx);
        });
        
        bgContainer.appendChild(token);
    }
    
    // Wire up riddle card interactive elements
    const card = document.getElementById('riddleCard');
    const closeBtn = document.getElementById('riddleCloseBtn');
    const submitBtn = document.getElementById('riddleSubmitBtn');
    const input = document.getElementById('riddleInput');
    const feedback = document.getElementById('riddleFeedback');
    
    if (closeBtn && card) {
        closeBtn.addEventListener('click', () => {
            card.classList.remove('active');
        });
    }
    
    if (submitBtn && input && feedback && card) {
        const checkAnswer = () => {
            if (currentRiddleIndex === -1) return;
            const answer = input.value.trim().toLowerCase();
            const correctAnswer = riddles[currentRiddleIndex].a;
            
            if (answer === correctAnswer || answer.includes(correctAnswer)) {
                feedback.textContent = "✔ ¡CORRECTO! Sistema hackeado con éxito.";
                feedback.className = "riddle-feedback success";
                
                // Rising sparkles/hearts celebration effect!
                triggerRisingHearts(null, submitBtn);
                
                setTimeout(() => {
                    card.classList.remove('active');
                }, 2000);
            } else {
                feedback.textContent = "✘ RESPUESTA INCORRECTA. Intenta de nuevo.";
                feedback.className = "riddle-feedback error";
            }
        };
        
        submitBtn.addEventListener('click', checkAnswer);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer();
        });
    }
}

function openRiddleCard(index) {
    const card = document.getElementById('riddleCard');
    const text = document.getElementById('riddleText');
    const input = document.getElementById('riddleInput');
    const feedback = document.getElementById('riddleFeedback');
    if (!card || !text || !input || !feedback) return;
    
    currentRiddleIndex = index;
    text.textContent = riddles[index].q;
    input.value = '';
    feedback.textContent = '';
    feedback.className = 'riddle-feedback';
    
    card.classList.add('active');
    input.focus();
}
