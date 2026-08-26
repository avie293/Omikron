document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('a[href="#issues"]').forEach(link => {
        link.href = 'https://github.com/avie293/Omikron/issues';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });

    const MODRINTH_SLUG = 'avies-ping-display';
    const CURSEFORGE_DOWNLOADS = 0;

    const MODRINTH_SLUG_TRANSLATOR = 'omikron-translator';
    const CURSEFORGE_DOWNLOADS_TRANSLATOR = 0;

    async function fetchDiscordWidgetHtml() {
        const discordHeading = `
            <div class="mt-6 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">Discord</h3>
            </div>
        `;

        try {
            const res = await fetch('https://discord.com/api/guilds/1525996949554073640/widget.json');
            if (!res.ok) throw new Error('Failed to fetch Discord widget');
            const data = await res.json();
            
            const serverName = escapeHtml(data.name || 'Discord Server');
            const onlineCount = data.presence_count || 0;
            const inviteUrl = data.instant_invite || 'https://discord.gg/1525996949554073640';
            const members = data.members || [];

            let membersHtml = '';
            if (members.length === 0) {
                membersHtml = '<p class="text-xs text-gray-400 italic py-1">No members online right now.</p>';
            } else {
                membersHtml = members.slice(0, 10).map(m => {
                    const statusColor = m.status === 'online' ? 'bg-green-500' : m.status === 'idle' ? 'bg-yellow-500' : m.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500';
                    const activity = m.game ? `<span class="text-[11px] text-gray-400 truncate block">Playing ${escapeHtml(m.game.name)}</span>` : '';
                    return `
                        <div class="flex items-center gap-2.5 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                            <div class="relative shrink-0">
                                <img src="${escapeHtml(m.avatar_url)}" alt="${escapeHtml(m.username)}" class="w-8 h-8 rounded-full object-cover border border-white/20">
                                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${statusColor} border border-black/50"></span>
                            </div>
                            <div class="overflow-hidden flex-1 min-w-0">
                                <h4 class="text-xs font-bold text-white truncate">${escapeHtml(m.username)}</h4>
                                ${activity}
                            </div>
                        </div>
                    `;
                }).join('');
            }

            return discordHeading + `
                <div class="w-full bg-white/5 p-3.5 rounded-xl border border-white/10 shadow-lg overflow-hidden">
                    <div class="flex justify-between items-center mb-3">
                        <div class="min-w-0 mr-2">
                            <h3 class="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                                <i data-lucide="message-square" class="w-4 h-4 text-indigo-400 shrink-0"></i> <span class="truncate">${serverName}</span>
                            </h3>
                            <p class="text-xs text-gray-400 mt-0.5"><span class="w-2 h-2 inline-block rounded-full bg-green-500 mr-1 animate-pulse"></span> ${onlineCount} Members Online</p>
                        </div>
                        <a href="${inviteUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow shrink-0">
                            Join
                        </a>
                    </div>
                    <div class="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        ${membersHtml}
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("Error loading custom discord widget:", e);
            return discordHeading + `
                <div class="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                    <p class="text-xs text-gray-400 mb-3">Join our server for updates & chat!</p>
                    <a href="https://discord.com/invite/1525996949554073640" target="_blank" rel="noopener noreferrer" class="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition">
                        Join Discord
                    </a>
                </div>
            `;
        }
    }

    async function fetchProjectStats() {
        const downloadCountEl = document.getElementById('download-count');
        let modrinthDownloads = 0;
        try {
            const response = await fetch(`https://api.modrinth.com/v2/project/${MODRINTH_SLUG}`, { headers: { Accept: 'application/json' } });
            if (response.ok) {
                const project = await response.json();
                modrinthDownloads = Number(project.downloads) || 0;
            }
        } catch (error) {
            console.error("Error loading download count for main project:", error);
        }

        const totalDownloads = modrinthDownloads + CURSEFORGE_DOWNLOADS;
        if (downloadCountEl) {
            downloadCountEl.textContent = `${totalDownloads.toLocaleString('en-US')} Downloads`;
        }
    }

    async function updateDownloadLink() {
        const downloadBtn = document.getElementById('download-btn');
        const downloadOmikronOpt = document.getElementById('download-omikron-opt');
        const mobileDownloadOmikron = document.getElementById('mobile-download-omikron');
        const infoVersionEl = document.getElementById('info-version');
        const infoLoadersEl = document.getElementById('info-loaders');
        const infoMcVersionsEl = document.getElementById('info-mc-versions');
        const infoRequiresEl = document.getElementById('info-requires');

        try {
            const response = await fetch(`https://api.modrinth.com/v2/project/${MODRINTH_SLUG}/version`);
            if (!response.ok) throw new Error('Modrinth versions request failed for main project');
            
            const versions = await response.json();
            
            if (versions && versions.length > 0) {
                const latestVersion = versions[0];
                const primaryFile = latestVersion.files.find(file => file.primary) || latestVersion.files[0];
                
                if (primaryFile && primaryFile.url) {
                    if (downloadBtn) downloadBtn.href = primaryFile.url;
                    if (downloadOmikronOpt) downloadOmikronOpt.href = primaryFile.url;
                    if (mobileDownloadOmikron) mobileDownloadOmikron.href = primaryFile.url;
                }

                if (infoVersionEl) {
                    const versionName = latestVersion.version_number || latestVersion.name || 'Release';
                    infoVersionEl.textContent = `Version: ${versionName}`;
                }

                if (infoLoadersEl && latestVersion.loaders && Array.isArray(latestVersion.loaders)) {
                    const loadersFormatted = latestVersion.loaders
                        .map(l => l.charAt(0).toUpperCase() + l.slice(1))
                        .join(', ');
                    infoLoadersEl.textContent = `Modloader: ${loadersFormatted || 'Unknown'}`;
                }

                if (infoRequiresEl) {
                    if (latestVersion.dependencies && latestVersion.dependencies.length > 0) {
                        const requiredDeps = latestVersion.dependencies.filter(d => d.dependency_type === 'required');
                        
                        if (requiredDeps.length > 0) {
                            const depPromises = requiredDeps.map(async dep => {
                                try {
                                    const projRes = await fetch(`https://api.modrinth.com/v2/project/${dep.project_id}`);
                                    if (projRes.ok) {
                                        const projData = await projRes.json();
                                        return projData.title || projData.slug;
                                    }
                                } catch (e) {
                                    console.error("Error fetching dependency name:", e);
                                }
                                return null;
                            });

                            const depNames = (await Promise.all(depPromises)).filter(Boolean);
                            if (depNames.length > 0) {
                                infoRequiresEl.textContent = `Requires: ${depNames.join(', ')}`;
                            } else {
                                infoRequiresEl.textContent = `Requires: None`;
                            }
                        } else {
                            infoRequiresEl.textContent = `Requires: None`;
                        }
                    } else {
                        infoRequiresEl.textContent = `Requires: None`;
                    }
                }

                if (infoMcVersionsEl) {
                    const releaseVersions = new Set();
                    const snapshotVersions = [];

                    versions.forEach(v => {
                        if (v.game_versions && Array.isArray(v.game_versions)) {
                            v.game_versions.forEach(gv => {
                                const lowerGv = gv.toLowerCase();
                                if (lowerGv.includes('snapshot') || lowerGv.includes('pre') || lowerGv.includes('rc') || /[0-9]{2}w[0-9]{2}[a-z]/i.test(gv)) {
                                    snapshotVersions.push(gv);
                                } else {
                                    const parts = gv.split('.');
                                    if (parts.length >= 2) {
                                        releaseVersions.add(`${parts[0]}.${parts[1]}.x`);
                                    } else {
                                        releaseVersions.add(gv);
                                    }
                                }
                            });
                        }
                    });

                    const finalBadges = [];
                    const sortedReleases = Array.from(releaseVersions).sort().reverse();
                    sortedReleases.forEach(r => finalBadges.push(r));

                    if (snapshotVersions.length > 0) {
                        const uniqueSnapshots = Array.from(new Set(snapshotVersions)).sort();
                        if (uniqueSnapshots.length === 1) {
                            finalBadges.push(uniqueSnapshots[0]);
                        } else if (uniqueSnapshots.length > 1) {
                            finalBadges.push(`${uniqueSnapshots[0]} - ${uniqueSnapshots[uniqueSnapshots.length - 1]}`);
                        }
                    }

                    if (finalBadges.length > 0) {
                        infoMcVersionsEl.innerHTML = finalBadges
                            .map(gv => `<span class="mc-version-badge">${gv}</span>`)
                            .join('');
                    } else {
                        infoMcVersionsEl.innerHTML = '<span class="text-gray-400 text-sm">No data available</span>';
                    }
                }
            } else {
                throw new Error('No versions found for main project');
            }
        } catch (error) {
            console.error("Error loading download links for main project:", error);
            if (infoVersionEl) infoVersionEl.textContent = 'Version: Not available';
            if (infoLoadersEl) infoLoadersEl.textContent = 'Modloader: Not available';
            if (infoRequiresEl) infoRequiresEl.textContent = 'Requires: Not available';
            if (infoMcVersionsEl) infoMcVersionsEl.innerHTML = '<span class="text-gray-400 text-sm">Could not load versions</span>';
        }
    }

    async function fetchTranslatorProjectStats() {
        const downloadCountEl = document.getElementById('download-count-translator');
        let modrinthDownloads = 0;
        try {
            const response = await fetch(`https://api.modrinth.com/v2/project/${MODRINTH_SLUG_TRANSLATOR}`, { headers: { Accept: 'application/json' } });
            if (response.ok) {
                const project = await response.json();
                modrinthDownloads = Number(project.downloads) || 0;
            }
        } catch (error) {
            console.error("Error loading download count for translator project:", error);
        }

        const totalDownloads = modrinthDownloads + CURSEFORGE_DOWNLOADS_TRANSLATOR;
        if (downloadCountEl) {
            downloadCountEl.textContent = `${totalDownloads.toLocaleString('en-US')} Downloads`;
        }
    }

    async function updateTranslatorDownloadLink() {
        const downloadBtn = document.getElementById('download-btn-translator');
        const downloadOpt = document.getElementById('download-translator-opt');
        const mobileDownload = document.getElementById('mobile-download-translator');
        const infoVersionEl = document.getElementById('info-version-translator');
        const infoLoadersEl = document.getElementById('info-loaders-translator');
        const infoMcVersionsEl = document.getElementById('info-mc-versions-translator');
        const infoRequiresEl = document.getElementById('info-requires-translator');

        try {
            const response = await fetch(`https://api.modrinth.com/v2/project/${MODRINTH_SLUG_TRANSLATOR}/version`);
            if (!response.ok) throw new Error('Modrinth versions request failed for translator project');
            
            const versions = await response.json();
            
            if (versions && versions.length > 0) {
                const latestVersion = versions[0];
                const primaryFile = latestVersion.files.find(file => file.primary) || latestVersion.files[0];
                
                if (primaryFile && primaryFile.url) {
                    if (downloadBtn) downloadBtn.href = primaryFile.url;
                    if (downloadOpt) downloadOpt.href = primaryFile.url;
                    if (mobileDownload) mobileDownload.href = primaryFile.url;
                }

                if (infoVersionEl) {
                    const versionName = latestVersion.version_number || latestVersion.name || 'Release';
                    infoVersionEl.textContent = `Version: ${versionName}`;
                }

                if (infoLoadersEl && latestVersion.loaders && Array.isArray(latestVersion.loaders)) {
                    const loadersFormatted = latestVersion.loaders
                        .map(l => l.charAt(0).toUpperCase() + l.slice(1))
                        .join(', ');
                    infoLoadersEl.textContent = `Modloader: ${loadersFormatted || 'Unknown'}`;
                }

                if (infoRequiresEl) {
                    if (latestVersion.dependencies && latestVersion.dependencies.length > 0) {
                        const requiredDeps = latestVersion.dependencies.filter(d => d.dependency_type === 'required');
                        
                        if (requiredDeps.length > 0) {
                            const depPromises = requiredDeps.map(async dep => {
                                try {
                                    const projRes = await fetch(`https://api.modrinth.com/v2/project/${dep.project_id}`);
                                    if (projRes.ok) {
                                        const projData = await projRes.json();
                                        return projData.title || projData.slug;
                                    }
                                } catch (e) {
                                    console.error("Error fetching dependency name for translator:", e);
                                }
                                return null;
                            });

                            const depNames = (await Promise.all(depPromises)).filter(Boolean);
                            if (depNames.length > 0) {
                                infoRequiresEl.textContent = `Requires: ${depNames.join(', ')}`;
                            } else {
                                infoRequiresEl.textContent = `Requires: None`;
                            }
                        } else {
                            infoRequiresEl.textContent = `Requires: None`;
                        }
                    } else {
                        infoRequiresEl.textContent = `Requires: None`;
                    }
                }

                if (infoMcVersionsEl) {
                    const releaseVersions = new Set();
                    const snapshotVersions = [];

                    versions.forEach(v => {
                        if (v.game_versions && Array.isArray(v.game_versions)) {
                            v.game_versions.forEach(gv => {
                                const lowerGv = gv.toLowerCase();
                                if (lowerGv.includes('snapshot') || lowerGv.includes('pre') || lowerGv.includes('rc') || /[0-9]{2}w[0-9]{2}[a-z]/i.test(gv)) {
                                    snapshotVersions.push(gv);
                                } else {
                                    const parts = gv.split('.');
                                    if (parts.length >= 2) {
                                        releaseVersions.add(`${parts[0]}.${parts[1]}.x`);
                                    } else {
                                        releaseVersions.add(gv);
                                    }
                                }
                            });
                        }
                    });

                    const finalBadges = [];
                    const sortedReleases = Array.from(releaseVersions).sort().reverse();
                    sortedReleases.forEach(r => finalBadges.push(r));

                    if (snapshotVersions.length > 0) {
                        const uniqueSnapshots = Array.from(new Set(snapshotVersions)).sort();
                        if (uniqueSnapshots.length === 1) {
                            finalBadges.push(uniqueSnapshots[0]);
                        } else if (uniqueSnapshots.length > 1) {
                            finalBadges.push(`${uniqueSnapshots[0]} - ${uniqueSnapshots[uniqueSnapshots.length - 1]}`);
                        }
                    }

                    if (finalBadges.length > 0) {
                        infoMcVersionsEl.innerHTML = finalBadges
                            .map(gv => `<span class="mc-version-badge">${gv}</span>`)
                            .join('');
                    } else {
                        infoMcVersionsEl.innerHTML = '<span class="text-gray-400 text-sm">No data available</span>';
                    }
                }
            } else {
                throw new Error('No versions found for translator project');
            }
        } catch (error) {
            console.error("Error loading download links for translator project:", error);
            if (infoVersionEl) infoVersionEl.textContent = 'Version: Not available';
            if (infoLoadersEl) infoLoadersEl.textContent = 'Modloader: Not available';
            if (infoRequiresEl) infoRequiresEl.textContent = 'Requires: Not available';
            if (infoMcVersionsEl) infoMcVersionsEl.innerHTML = '<span class="text-gray-400 text-sm">Could not load versions</span>';
        }
    }

    async function loadTeamMembers() {
        const containers = [
            document.getElementById('team-container-desktop'),
            document.getElementById('team-container-mobile')
        ];

        const discordWidgetHtml = await fetchDiscordWidgetHtml();

        try {
            const response = await fetch(`https://api.modrinth.com/v2/project/${MODRINTH_SLUG}/members`);
            if (!response.ok) throw new Error('Failed to fetch project members');
            
            const members = await response.json();
            
            const memberDetailsPromises = members.map(async (m) => {
                const user = m.user;
                if (!user) return null;

                let totalDownloads = 0;
                try {
                    const projRes = await fetch(`https://api.modrinth.com/v2/user/${user.id}/projects`);
                    if (projRes.ok) {
                        const projects = await projRes.json();
                        totalDownloads = projects.reduce((sum, p) => sum + (Number(p.downloads) || 0), 0);
                    }
                } catch (e) {
                    console.error("Error fetching projects for member:", e);
                }

                return {
                    name: user.name || user.username,
                    avatar: user.avatar_url || 'https://cdn.modrinth.com/data/placeholder.png',
                    downloads: totalDownloads,
                    profileUrl: `https://modrinth.com/user/${user.username}`
                };
            });

            const teamData = (await Promise.all(memberDetailsPromises)).filter(Boolean);

            containers.forEach(container => {
                if (!container) return;

                let membersHtml = '';
                if (teamData.length === 0) {
                    membersHtml = '<p class="text-gray-400 text-sm">No team members found.</p>';
                } else {
                    membersHtml = teamData.map(member => `
                        <a href="${member.profileUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition group overflow-hidden">
                            <img src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.name)}" class="w-10 h-10 rounded-full object-cover shrink-0 border border-white/20">
                            <div class="overflow-hidden min-w-0 flex-1">
                                <h3 class="text-sm font-bold text-white truncate group-hover:text-blue-400 transition">${escapeHtml(member.name)}</h3>
                                <p class="text-xs text-gray-400 truncate">Downloads: <span class="text-gray-200 font-medium">${member.downloads.toLocaleString('en-US')}</span></p>
                            </div>
                        </a>
                    `).join('');
                }

                container.innerHTML = membersHtml + discordWidgetHtml;
            });

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error loading team members:', error);
            containers.forEach(container => {
                if (container) {
                    container.innerHTML = '<p class="text-gray-400 text-sm">Failed to load team.</p>' + discordWidgetHtml;
                }
            });
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    function loadAnnouncements() {
        const containers = [
            document.getElementById('announcements-container-desktop'),
            document.getElementById('announcements-container-mobile')
        ];

        try {
            const stored = localStorage.getItem('omikron_announcements');
            const posts = stored ? JSON.parse(stored) : [];
            
            containers.forEach(container => {
                if (!container) return;

                if (posts.length === 0) {
                    container.innerHTML = '<p class="text-gray-400 text-sm">No announcements yet.</p>';
                    return;
                }

                const latestPosts = posts.slice(0, 10);

                container.innerHTML = latestPosts.map(post => {
                    const iconName = getCategoryIconName(post.category);
                    return `
                        <div class="border-b border-white/10 pb-3 last:border-b-0 last:pb-0 overflow-hidden">
                            <div class="flex justify-between items-center mb-1 gap-2">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <i data-lucide="${iconName}" class="w-4 h-4 text-blue-400 shrink-0"></i>
                                    <h3 class="text-sm font-bold text-white truncate">${linkifyAndEscape(post.title)}</h3>
                                </div>
                                <span class="text-xs text-gray-400 shrink-0">${escapeHtml(post.date)}</span>
                            </div>
                            <p class="text-sm text-gray-300 leading-relaxed break-words">${linkifyAndEscape(post.content)}</p>
                        </div>
                    `;
                }).join('');
            });

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
            containers.forEach(container => {
                if (container) container.innerHTML = '<p class="text-gray-400 text-sm">Failed to load announcements.</p>';
            });
        }
    }

    function getCategoryIconName(category) {
        switch(category) {
            case 'Update': return 'refresh-cw';
            case 'Important': return 'alert-triangle';
            case 'Event': return 'calendar';
            case 'Info': default: return 'info';
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function linkifyAndEscape(str) {
        if (!str) return '';
        const escaped = escapeHtml(str);
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return escaped.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300 break-all">$1</a>');
    }

    fetchProjectStats();
    updateDownloadLink();

    fetchTranslatorProjectStats();
    updateTranslatorDownloadLink();

    loadTeamMembers();
    loadAnnouncements();

    setupModal('btn-privacy', 'modal-privacy', 'close-privacy');
    setupModal('btn-disclaimer', 'modal-disclaimer', 'close-disclaimer');
});

function setupModal(btnId, modalId, closeId) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (btn && modal) {
        btn.addEventListener('click', () => modal.classList.remove('hidden'));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
}
