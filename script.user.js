// ==UserScript==
// @name         Torn Alliance Toolkit
// @version      1.0
// @description  Alliance warnings + profile badge (auto updating)
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////////
    // 🔧 CONFIG (EDIT THIS ONLY)
    /////////////////////////////

    const BASE_URL = "https://github.com/thompsoncict-jpg/Iron-Dome-alliance/tree/main"

    const CONFIG_URL = https://github.com/thompsoncict-jpg/Iron-Dome-alliance/edit/main/allince%20list;
    const BADGE_URL  = https://github.com/thompsoncict-jpg/Iron-Dome-alliance/blob/main/iron%20dome.gif;

    const SETTINGS = {
        blockAttack: false,
        cacheMinutes: 10
    };

    /////////////////////////////
    // 🧠 CACHE
    /////////////////////////////

    const CACHE_KEY = "torn_alliance_cache";
    const CACHE_TIME_KEY = "torn_alliance_cache_time";

    function getCache() {
        const data = localStorage.getItem(CACHE_KEY);
        const time = localStorage.getItem(CACHE_TIME_KEY);

        if (!data || !time) return null;

        const age = (Date.now() - parseInt(time)) / 60000;
        if (age > SETTINGS.cacheMinutes) return null;

        return JSON.parse(data);
    }

    function setCache(data) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now());
    }

    /////////////////////////////
    // 🌐 FETCH DATA
    /////////////////////////////

    function fetchAllianceData() {
        return new Promise((resolve) => {
            const cached = getCache();
            if (cached) return resolve(cached);

            GM_xmlhttpRequest({
                method: "GET",
                url: CONFIG_URL,
                onload: res => {
                    try {
                        const json = JSON.parse(res.responseText);
                        const factions = json.factions || [];
                        setCache(factions);
                        resolve(factions);
                    } catch {
                        resolve([]);
                    }
                },
                onerror: () => resolve([])
            });
        });
    }

    /////////////////////////////
    // 🔍 GET FACTION
    /////////////////////////////

    function getFactionId() {
        const link = document.querySelector('a[href*="factions.php?step=profile&ID="]');
        if (!link) return null;

        const url = new URL(link.href);
        return parseInt(url.searchParams.get("ID"));
    }

    /////////////////////////////
    // 🖼️ ADD BADGE
    /////////////////////////////

    function addBadge() {
        if (document.getElementById("alliance-badge")) return;

        const container = document.querySelector('.profile-wrapper, .user-profile');
        if (!container) return;

        const badge = document.createElement("div");
        badge.id = "alliance-badge";

        badge.innerHTML = `
            <div style="text-align:center; margin-bottom:10px;">
                <img src="${BADGE_URL}" style="
                    width:120px;
                    border-radius:10px;
                    box-shadow:0 0 10px rgba(0,0,0,0.5);
                ">
                <div style="
                    color:#4CAF50;
                    font-weight:bold;
                    margin-top:5px;
                ">
                    ALLIANCE MEMBER
                </div>
            </div>
        `;

        container.prepend(badge);
    }

    /////////////////////////////
    // ⚠️ WARNING
    /////////////////////////////

    function attachWarning(factionId) {
        const btn = document.querySelector('a[href*="loader.php?sid=attack"]');
        if (!btn) return;

        btn.addEventListener("click", function(e) {
            if (SETTINGS.blockAttack) {
                alert(`🚫 BLOCKED: Alliance member (${factionId})`);
                e.preventDefault();
                return;
            }

            if (!confirm(`⚠️ Alliance member (${factionId}) — Attack anyway?`)) {
                e.preventDefault();
            }
        });
    }

    /////////////////////////////
    // 🚀 MAIN
    /////////////////////////////

    async function init() {
        const factions = await fetchAllianceData();
        const factionId = getFactionId();

        if (!factionId) return;

        if (factions.includes(factionId)) {
            addBadge();
            attachWarning(factionId);
        }
    }

    /////////////////////////////
    // ⏱️ OBSERVER
    /////////////////////////////

    const observer = new MutationObserver(init);
    observer.observe(document, { childList: true, subtree: true });

})();

