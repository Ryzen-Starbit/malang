(() => {
    // Config
    const batchSize = 15;
    const gallery = document.getElementById('gallery');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const loader = document.getElementById('loader');
    const noneDiv = document.getElementById('none');
    const filtersContainer = document.getElementById('filtersContainer'); // parent container
    const copyBtn = document.getElementById('copyFiltersBtn');
    const copyIcon = document.getElementById('copyFiltersIcon');
    const heading = document.getElementById('heading');

    // State
    let currentMode = 'artworks'; // 'artworks' | 'photographs'
    let imageMeta = {};           // metadata loaded from JSON
    let allImages = [];           // master ordered array of image objects for currentMode
    let scanIndex = 0;            // index into allImages for the next scanning position
    let displayedIds = new Set(); // to avoid duplicates
    let selectedType = 'all';
    let selectedArtist = 'all';

    // Utility: parse URL query params
    function parseQuery() {
        const q = new URLSearchParams(window.location.search);
        return {
            mode: q.get('mode') || undefined,
            type: q.get('type') || undefined,
            artist: q.get('artist') || undefined
        };
    }

    // Utility: update URL (replace state so back button is sane)
    function updateURL({ mode, type, artist }, replace = true) {
        const params = new URLSearchParams();
        if (mode && mode !== 'artworks') params.set('mode', mode); // default artworks — only include if not default (optional)
        if (type && type !== 'all') params.set('type', type);
        if (artist && artist !== 'all') params.set('artist', artist);
        const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}${location.hash || ''}`;
        if (replace) history.replaceState({}, '', newUrl); else history.pushState({}, '', newUrl);
    }

    // Utility: copy link to clipboard
    async function copyShareableURL() {
        try {
            const params = new URLSearchParams();
            if (currentMode && currentMode !== 'artworks') params.set('mode', currentMode);
            if (selectedType && selectedType !== 'all') params.set('type', selectedType);
            if (selectedArtist && selectedArtist !== 'all') params.set('artist', selectedArtist);

            const parentUrl = `${window.location.origin}/index.html${params.toString() ? '?' + params.toString() : ''}`;

            await navigator.clipboard.writeText(parentUrl);
            copyIcon.src = '/resrc/images/icons/tick.webp';
            setTimeout(() => (copyIcon.src = '/resrc/images/icons/link.webp'), 1500);
        } catch (err) {
            window.prompt('Copy this link:', parentUrl);
        }
    }


    // Load metadata JSON for current mode
    async function loadMetadata(mode) {
        const path = mode === 'artworks'
            ? '../../resrc/data/artworks.json'
            : '../../resrc/data/photographs.json';

        try {
            const res = await fetch(path);
            const data = await res.json();
            imageMeta = data || {};
        } catch (err) {
            console.warn('Failed to load metadata for', mode, err);
            imageMeta = {};
        }
    }

    // Build the ordered allImages array for currentMode
    function buildAllImages(mode) {
        // artwork count and photograph count
        const total = mode === 'artworks' ? 68 : 42;

        allImages = Array.from({ length: total }, (_, i) => {
            const imageId = String(i);
            const src = mode === 'artworks'
                ? `/resrc/images/artworks/${imageId}.webp`
                : `/resrc/images/photographs/${imageId}.webp`;

            const meta = imageMeta[imageId] || {};
            const typeToken = (meta.type || 'unknown').replace(/\s+/g, '-');
            const artistToken = (meta.artist || 'unknown').replace(/\s+/g, '-');

            return {
                imageId,
                src,
                alt: meta.title || 'Untitled',
                typeToken,
                artistToken,
                meta
            };
        });

        // Reset scanning state; we only scan forward from scanIndex to keep previous order stable.
        scanIndex = 0;
        displayedIds = new Set();
    }

    // Populate filter buttons (type & artist) and attach delegated event handler
    function populateFiltersAndBind() {
        // collect tokens
        const types = new Set();
        const artists = new Set();
        allImages.forEach(img => {
            if (img.meta && img.meta.type) types.add(img.meta.type);
            if (img.meta && img.meta.artist) artists.add(img.meta.artist);
        });

        // Build type HTML
        const typeContainer = document.getElementById('filters-type');
        typeContainer.innerHTML = '<p>Type: </p>';
        typeContainer.insertAdjacentHTML('beforeend', `<button class="filter-btn type" data-filter="all">All</button>`);
        Array.from(types).sort().forEach(t => {
            const token = t.replace(/\s+/g, '-');
            typeContainer.insertAdjacentHTML('beforeend', `<button class="filter-btn type" data-filter="${token}">${t}</button>`);
        });

        // Build artist HTML
        const artistContainer = document.getElementById('filters-artist');
        artistContainer.innerHTML = currentMode === 'artworks' ? '<p>Artist: </p>' : '<p>Shot By: </p>';
        artistContainer.insertAdjacentHTML('beforeend', `<button class="filter-btn artist" data-filter="all">All</button>`);
        Array.from(artists).sort().forEach(a => {
            const token = a.replace(/\s+/g, '-');
            artistContainer.insertAdjacentHTML('beforeend', `<button class="filter-btn artist" data-filter="${token}">${a}</button>`);
        });

        // Highlight selected buttons
        highlightSelectedFilterButtons();

        // Delegated click handler (single listener)
        filtersContainer.removeEventListener('click', filtersClickHandler);
        filtersContainer.addEventListener('click', filtersClickHandler);
    }

    // Highlight currently selected buttons
    function highlightSelectedFilterButtons() {
        document.querySelectorAll('.filter-btn.type').forEach(b => {
            b.classList.toggle('selected', b.dataset.filter === selectedType);
        });
        document.querySelectorAll('.filter-btn.artist').forEach(b => {
            b.classList.toggle('selected', b.dataset.filter === selectedArtist);
        });
    }

    // Delegated handler for filter clicks
    function filtersClickHandler(e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        if (btn.classList.contains('type')) {
            selectedType = btn.dataset.filter || 'all';
        } else if (btn.classList.contains('artist')) {
            selectedArtist = btn.dataset.filter || 'all';
        } else {
            return;
        }

        highlightSelectedFilterButtons();
        // Save in URL + reload gallery content (reset displayed)
        updateURL({ mode: currentMode, type: selectedType, artist: selectedArtist }, true);
        resetGalleryAndLoad(currentMode);
    }

    // Append a batch of images that match current filters
    function loadImagesBatch() {
        if (!allImages || allImages.length === 0) {
            viewMoreBtn.style.display = 'none';
            noneDiv.style.display = 'flex';
            return;
        }

        const batch = [];
        // scan forward until we collect batchSize matches or exhaust list
        while (batch.length < batchSize && scanIndex < allImages.length) {
            const img = allImages[scanIndex];
            scanIndex++; // advance scan pointer no matter match or not (ensures stability)
            const matchesType = selectedType === 'all' || img.typeToken === selectedType;
            const matchesArtist = selectedArtist === 'all' || img.artistToken === selectedArtist;
            if (matchesType && matchesArtist && !displayedIds.has(img.imageId)) {
                batch.push(img);
                displayedIds.add(img.imageId);
            }
        }

        if (batch.length === 0) {
            // If nothing in this scan, either no matches remaining or exhausted
            if (scanIndex >= allImages.length) {
                // exhausted the list
                if (gallery.children.length === 0) {
                    noneDiv.style.display = 'flex';
                    viewMoreBtn.style.display = 'none';
                } else {
                    // no more matches; hide view more
                    viewMoreBtn.style.display = 'none';
                }
            }
            return;
        }

        // Append batch to DOM
        const fragment = document.createDocumentFragment();
        const imagePromises = [];

        for (const item of batch) {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-item same';

            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            img.className = `${item.typeToken} ${item.artistToken}`;

            wrapper.appendChild(img);
            fragment.appendChild(wrapper);

            // image loaded promise
            imagePromises.push(new Promise(resolve => {
                if (img.complete) return resolve();
                img.onload = img.onerror = () => resolve();
            }));
        }

        gallery.appendChild(fragment);

        // hide loader when loaded (if shown)
        Promise.all(imagePromises).then(() => {
            loader.style.display = 'none';
            applyTheme?.();
        });

        // control view more visibility
        // If scanIndex exhausted and no matches left, hide
        if (scanIndex >= allImages.length) {
            viewMoreBtn.style.display = 'none';
        } else {
            viewMoreBtn.style.display = 'block';
        }

        // match/no match for noneDiv
        const currentlyVisibleCount = gallery.querySelectorAll('.gallery-item').length;
        noneDiv.style.display = currentlyVisibleCount === 0 ? 'flex' : 'none';
    }

    // Reset gallery and load first batch
    async function resetGalleryAndLoad(mode) {
        noneDiv.style.display = 'none';
        loader.style.display = 'flex';
        gallery.innerHTML = '';
        displayedIds = new Set();
        scanIndex = 0;
        viewMoreBtn.style.display = 'none';

        currentMode = mode;
        await loadMetadata(mode);
        buildAllImages(mode);
        populateFiltersAndBind();

        // Set selected filters from URL (if present), else keep defaults
        const q = parseQuery();
        if (q.type) selectedType = q.type;
        if (q.artist) selectedArtist = q.artist;

        // Highlight selected (after populate)
        highlightSelectedFilterButtons();

        // Load initial batch
        loadImagesBatch();

        // Hide loader when stable or shortly
        setTimeout(() => {
            loader.style.display = 'none';
        }, 3000);
    }

    // Attach main event listeners
    function bindUI() {
        const photographsBtn = document.getElementById('photographs');
        const artworksBtn = document.getElementById('artworks');

        photographsBtn.addEventListener('click', () => {
            currentMode = 'photographs'; // Set current mode immediately
            selectedType = 'all';
            selectedArtist = 'all';
            updateURL({ mode: currentMode, type: selectedType, artist: selectedArtist }, true);
            resetGalleryAndLoad(currentMode);
            updateHeading();
        });

        artworksBtn.addEventListener('click', () => {
            currentMode = 'artworks'; // Set current mode immediately
            selectedType = 'all';
            selectedArtist = 'all';
            updateURL({ mode: currentMode, type: selectedType, artist: selectedArtist }, true);
            resetGalleryAndLoad(currentMode);
            updateHeading();
        });

        // view more
        viewMoreBtn.addEventListener('click', () => {
            loadImagesBatch();
        });

        // copy url
        if (copyBtn) {
            copyBtn.addEventListener('click', copyShareableURL);
        }

        // Modal (delegated from gallery)
        gallery.addEventListener('click', (e) => {
            const img = e.target.closest('img');
            if (!img) return;
            openModalWithImage(img);
        });

        // Close modal handlers are unchanged from your previous code: keep your existing modal close logic in the page (not duplicated here)
    }

    // Modal helper (keeps your existing modal DOM IDs)
    function openModalWithImage(img) {
        const modal = document.getElementById("image-modal");
        const modalImg = document.getElementById("modal-image");
        const modalTitle = document.getElementById("modal-title");
        const modalArtist = document.getElementById("modal-artist");

        const fileName = img.src.split("/").pop();
        const imageId = fileName.split('.')[0];
        const meta = imageMeta[imageId] || {};

        modalImg.src = img.src;
        // Check for title and clear if none is present, or set it if present.
        if (meta.title) {
            modalTitle.innerHTML = `<h4><i>${meta.title}</i></h4>`;
        } else {
            modalTitle.innerHTML = ''; // IMPORTANT: Clear the title if meta.title is falsy
        }
        modalArtist.textContent = `~ ${meta.artist || 'NA'}`;
        document.querySelector("section").classList.add("modal-active");

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";

        document.querySelector(".modal-close")?.addEventListener("click", () => {
            document.querySelector("section").classList.remove("modal-active");
            document.getElementById("image-modal").style.display = "none";
            document.body.style.overflow = "auto";
        });

        window.addEventListener("click", (e) => {
            if (e.target.id === "image-modal") {
                document.querySelector("section").classList.remove("modal-active");
                document.getElementById("image-modal").style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }

    // On initial load: read URL params to set mode/type/artist
    function updateHeading() {
        const q = parseQuery();
        const currentModeText = currentMode.charAt(0).toUpperCase() + currentMode.slice(1); // 'Artworks' or 'Photographs'

        // Get the artist from URL or current state (URL is more reliable here)
        const artist = q.artist;

        // Get the mode name to append, or default to 'work'
        const modeText = currentMode || 'work';

        if (artist && artist !== 'all') {
            const displayArtist = artist.replace(/-/g, ' ');

            heading.textContent = `${displayArtist}'s ${modeText.charAt(0).toUpperCase() + modeText.slice(1)}`;
        } else {
            // Default heading: "Artworks" or "Photographs"
            heading.textContent = currentModeText;
        }
    }


    // Delegated handler for filter clicks (UPDATED)
    function filtersClickHandler(e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        if (btn.classList.contains('type')) {
            selectedType = btn.dataset.filter || 'all';
        } else if (btn.classList.contains('artist')) {
            selectedArtist = btn.dataset.filter || 'all';
        } else {
            return;
        }

        highlightSelectedFilterButtons();

        // 1. Update the URL
        updateURL({ mode: currentMode, type: selectedType, artist: selectedArtist }, true);

        // 2. Update the heading immediately based on the new filters
        updateHeading();

        // 3. Reset and load new gallery content
        resetGalleryAndLoad(currentMode);
    }


    // On initial load: read URL params to set mode/type/artist (UPDATED)
    async function init() {
        bindUI();

        const q = parseQuery();
        const initialMode = q.mode === 'photographs' ? 'photographs' : 'artworks';
        // assign selected tokens if provided
        selectedType = q.type || 'all';
        selectedArtist = q.artist || 'all';

        // Update URL to normalized form (so default params are hidden)
        updateURL({ mode: initialMode, type: selectedType, artist: selectedArtist }, true);

        await resetGalleryAndLoad(initialMode);

        // *** CALL THE NEW HEADING FUNCTION HERE ***
        updateHeading();

        // handle browser navigation (back/forward)
        window.addEventListener('popstate', () => {
            const q2 = parseQuery();
            selectedType = q2.type || 'all';
            selectedArtist = q2.artist || 'all';
            const mode = q2.mode === 'photographs' ? 'photographs' : 'artworks';
            resetGalleryAndLoad(mode);
            // Also update heading on popstate
            updateHeading();
        });
    }

    // start
    init();
})();

const secureAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showAlert("⚠️ Warning", "All artworks and photographs displayed on this page are the exclusive property of Malang and are subject to copyright protection. Unauthorized copying, downloading or use of these images may result in legal proceedings.", [{ text: "OK" }]);
    navigator.vibrate(150);
    try { navigator.clipboard?.writeText?.(""); } catch { }
};

document.addEventListener("keydown", function (e) {
    const k = (e.key || "").toLowerCase();
    const isControlOrMeta = e.ctrlKey || e.metaKey;

    const blocked = (
        // Copy, Save, View Source, Inspect
        (isControlOrMeta && (k === "c" || k === "s" || k === "u" || k === "j" || k === "i")) ||
        k === "f12" || // Dev Tools
        // Common Screenshot Keys
        k === "printscreen" || k === "print" || k === "snapshot" ||
        (e.altKey && k === "printscreen") ||
        (e.shiftKey && k === "printscreen") ||
        (e.key === "Meta" && e.shiftKey && (k === "3" || k === "4")) // Mac Screenshot Cmd+Shift+3/4
    );

    if (blocked) {
        secureAction(e);
    }
});

// Block right-click/long-press context menu (Desktop & Mobile)
document.addEventListener("contextmenu", function (e) {
    secureAction(e);
});

// Block text selection
document.addEventListener("selectstart", function (e) {
    e.preventDefault();
});

// Block image dragging
document.querySelectorAll("img").forEach(img => {
    img.setAttribute("draggable", "false");
    img.addEventListener("dragstart", secureAction);
});

function toggleFilters() {
    const filtersContainer = document.getElementById('filtersContainer');
    if (!filtersContainer) {
        return;
    }
    const currentVisibility = filtersContainer.style.visibility;
    if (currentVisibility === 'hidden') {
        filtersContainer.style.visibility = 'visible';
        filtersContainer.style.opacity = '1';
        filtersContainer.style.filter = 'blur(0)';
    } else {
        filtersContainer.style.visibility = 'hidden';
        filtersContainer.style.opacity = '0';
        filtersContainer.style.filter = 'blur(5px)';
    }
    vibrate();
}