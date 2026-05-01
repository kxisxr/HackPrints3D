document.addEventListener("DOMContentLoaded", () => {
    const ADMIN_PASSWORD = "HackPrints3D!2026";
    const ADMIN_ACCESS_KEY = "hp3d_admin_access";
    const ADMIN_ACCESS_TTL_MS = 1000 * 60 * 60 * 8;
    const SECRET_CLICK_TARGET = 5;
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");
    const brand = document.querySelector(".brand");
    const revealItems = document.querySelectorAll(".reveal");
    const counterItems = document.querySelectorAll("[data-count]");
    const quickCalcButton = document.getElementById("quick-calc-button");
    const quickLength = document.getElementById("quick-length");
    const quickSummary = document.getElementById("quick-summary");
    const filterButtons = document.querySelectorAll(".filter-chip");
    const galleryCards = document.querySelectorAll(".gallery-card");
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDetails = document.getElementById("modal-details");
    const modalClose = document.querySelector(".modal-close");
    const modalTriggers = document.querySelectorAll(".project-modal-trigger");
    const isInternalPage = document.body.dataset.internalPage === "true";
    let secretClickCount = 0;
    let secretClickTimer = null;

    const hasAdminAccess = () => {
        const raw = localStorage.getItem(ADMIN_ACCESS_KEY);
        if (!raw) return false;

        try {
            const access = JSON.parse(raw);
            if (Date.now() > access.expiresAt) {
                localStorage.removeItem(ADMIN_ACCESS_KEY);
                return false;
            }
            return access.granted === true;
        } catch {
            localStorage.removeItem(ADMIN_ACCESS_KEY);
            return false;
        }
    };

    const grantAdminAccess = () => {
        localStorage.setItem(ADMIN_ACCESS_KEY, JSON.stringify({
            granted: true,
            expiresAt: Date.now() + ADMIN_ACCESS_TTL_MS
        }));
    };

    const buildAccessModal = () => {
        if (document.getElementById("admin-access-modal")) {
            return document.getElementById("admin-access-modal");
        }

        const wrapper = document.createElement("div");
        wrapper.id = "admin-access-modal";
        wrapper.className = "admin-access-modal";
        wrapper.innerHTML = `
            <div class="admin-access-card">
                <button class="admin-access-close" type="button" aria-label="Cerrar acceso">&times;</button>
                <p class="eyebrow">Acceso interno</p>
                <h2>HackPrints3D Studio Tools</h2>
                <p>Ingresa la clave para abrir las herramientas internas de produccion.</p>
                <form class="admin-access-form">
                    <div class="field-group">
                        <label for="admin-password">Clave</label>
                        <input id="admin-password" name="admin-password" type="password" autocomplete="current-password" placeholder="Escribe tu clave">
                    </div>
                    <p class="admin-access-feedback" id="admin-access-feedback"></p>
                    <div class="admin-access-actions">
                        <button class="btn btn-primary" type="submit">Entrar</button>
                        <button class="btn btn-secondary" type="button" data-admin-cancel>Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(wrapper);
        return wrapper;
    };

    const openAccessModal = ({ force = false } = {}) => {
        const accessModal = buildAccessModal();
        const closeButton = accessModal.querySelector(".admin-access-close");
        const cancelButton = accessModal.querySelector("[data-admin-cancel]");
        const form = accessModal.querySelector(".admin-access-form");
        const passwordInput = accessModal.querySelector("#admin-password");
        const feedback = accessModal.querySelector("#admin-access-feedback");

        const closeModal = () => {
            if (force) return;
            accessModal.classList.remove("is-open");
            accessModal.setAttribute("aria-hidden", "true");
            feedback.textContent = "";
            passwordInput.value = "";
        };

        if (!accessModal.dataset.bound) {
            closeButton?.addEventListener("click", closeModal);
            cancelButton?.addEventListener("click", closeModal);
            accessModal.addEventListener("click", (event) => {
                if (event.target === accessModal) closeModal();
            });

            form?.addEventListener("submit", (event) => {
                event.preventDefault();
                if (passwordInput.value !== ADMIN_PASSWORD) {
                    feedback.textContent = "Clave incorrecta. Intenta de nuevo.";
                    return;
                }

                grantAdminAccess();
                feedback.textContent = "";
                passwordInput.value = "";
                accessModal.classList.remove("is-open");
                accessModal.setAttribute("aria-hidden", "true");
                document.body.classList.remove("internal-locked");

                if (isInternalPage) {
                    window.location.reload();
                } else {
                    window.location.href = "studio-tools.html";
                }
            });

            accessModal.dataset.bound = "true";
        }

        accessModal.classList.add("is-open");
        accessModal.setAttribute("aria-hidden", "false");
        if (force) {
            document.body.classList.add("internal-locked");
            cancelButton?.setAttribute("hidden", "hidden");
            closeButton?.setAttribute("hidden", "hidden");
        } else {
            cancelButton?.removeAttribute("hidden");
            closeButton?.removeAttribute("hidden");
        }
        setTimeout(() => passwordInput?.focus(), 40);
    };

    if (isInternalPage && !hasAdminAccess()) {
        openAccessModal({ force: true });
    }

    const updateHeader = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader);

    if (menuToggle && siteNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.toggle("is-open");
            menuToggle.classList.toggle("is-open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    if (brand) {
        const brandImage = brand.querySelector("img");

        brandImage?.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            secretClickCount += 1;
            window.clearTimeout(secretClickTimer);

            if (secretClickCount >= SECRET_CLICK_TARGET) {
                secretClickCount = 0;
                openAccessModal();
                return;
            }

            secretClickTimer = window.setTimeout(() => {
                secretClickCount = 0;
            }, 1400);
        });
    }

    if (revealItems.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    if (counterItems.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                const target = Number(element.dataset.count || 0);
                const duration = 1300;
                const start = performance.now();

                const tick = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const current = Math.floor(target * progress);
                    element.textContent = `${current}+`;
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        element.textContent = `${target}+`;
                    }
                };

                requestAnimationFrame(tick);
                counterObserver.unobserve(element);
            });
        }, { threshold: 0.45 });

        counterItems.forEach((item) => counterObserver.observe(item));
    }

    const calculateKeychainEstimate = (quantity, size) => {
        const basePrices = { 5: 62, 8: 82, 10: 99 };

        const discountMultiplier = quantity >= 50
            ? 0.32
            : quantity >= 30
                ? 0.38
                : quantity >= 10
                    ? 0.48
                    : quantity >= 5
                        ? 0.72
                        : 1;

        const unitPrice = (basePrices[size] || 62) * discountMultiplier;
        return {
            unitPrice,
            total: unitPrice * quantity
        };
    };

    if (quickCalcButton && quickLength && quickSummary) {
        quickCalcButton.addEventListener("click", () => {
            const quantity = Number(document.getElementById("quick-quantity")?.value || 0);
            const size = Number(document.getElementById("quick-size")?.value || 0);

            if (quantity <= 0 || size <= 0) {
                quickLength.textContent = "$0 MXN";
                quickSummary.textContent = "Revisa cantidad y tamano para obtener una estimacion valida.";
                return;
            }

            const estimate = calculateKeychainEstimate(quantity, size);
            quickLength.textContent = new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                maximumFractionDigits: 2
            }).format(estimate.total);
            quickSummary.textContent = `${quantity} llaveros de ${size} cm quedan cerca de ${estimate.total.toFixed(0)} MXN, con una referencia aproximada de ${estimate.unitPrice.toFixed(0)} MXN por pieza.`;
        });

        quickCalcButton.click();
    }

    if (filterButtons.length && galleryCards.length) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter;
                filterButtons.forEach((chip) => chip.classList.remove("is-active"));
                button.classList.add("is-active");

                galleryCards.forEach((card) => {
                    const category = card.dataset.category;
                    const visible = filter === "all" || category === filter;
                    card.classList.toggle("is-hidden", !visible);
                });
            });
        });
    }

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
    };

    if (modal && modalTitle && modalDetails) {
        modalTriggers.forEach((trigger) => {
            trigger.addEventListener("click", () => {
                modalTitle.textContent = trigger.dataset.project || "Proyecto";
                modalDetails.textContent = trigger.dataset.details || "Sin detalle disponible.";
                modal.classList.add("is-open");
                modal.setAttribute("aria-hidden", "false");
            });
        });

        modalClose?.addEventListener("click", closeModal);
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeModal();
        });
    }
});
