/* ==========================================================================
   MAIN.JS — Tương tác giao diện Website Trà Gạo Lứt Lá Sen - Hà Nội Xưa
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initStickyHeader();
  initMobileNav();
  initTabs();
  initLightbox();
  initBackToTop();
  initScrollReveal();
});

/**
 * 1. Đổ bóng thanh Header khi người dùng cuộn trang
 */
function initStickyHeader() {
  var header = document.getElementById("siteHeader");
  if (!header) {
    return;
  }

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
}

/**
 * 2. Menu điều hướng trên thiết bị di động (Hamburger Toggle)
 */
function initMobileNav() {
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  if (!navToggle || !primaryNav) {
    return;
  }

  function closeMenu() {
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  }

  navToggle.addEventListener("click", function () {
    var isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  var navLinks = primaryNav.querySelectorAll(".nav-link");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
      closeMenu();
      navToggle.focus();
    }
  });
}

/**
 * 3. Hệ thống chuyển đổi Tab (Trang 2: Cấu trúc bao bì & Trang 3: Gạo lứt / Lá sen)
 */
function initTabs() {
  var tabContainers = document.querySelectorAll("[data-tabs]");

  for (var i = 0; i < tabContainers.length; i++) {
    setupTabGroup(tabContainers[i]);
  }
}

function setupTabGroup(container) {
  var buttons = container.querySelectorAll(".tab-btn");
  if (!buttons.length) {
    return;
  }

  function activateTab(selectedBtn) {
    var targetId = selectedBtn.getAttribute("data-tab-target");

    for (var j = 0; j < buttons.length; j++) {
      var btn = buttons[j];
      var panelId = btn.getAttribute("data-tab-target");
      var panel = document.getElementById(panelId);
      var isSelected = btn === selectedBtn;

      btn.classList.toggle("active", isSelected);
      btn.setAttribute("aria-selected", String(isSelected));

      if (panel) {
        panel.classList.toggle("active", isSelected);
        if (isSelected) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      }
    }

    var targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      var revealEls = targetPanel.querySelectorAll("[data-reveal]");
      for (var k = 0; k < revealEls.length; k++) {
        revealEls[k].classList.add("is-revealed");
      }
    }
  }

  for (var i = 0; i < buttons.length; i++) {
    (function (index) {
      buttons[index].addEventListener("click", function () {
        activateTab(buttons[index]);
      });

      buttons[index].addEventListener("keydown", function (event) {
        var nextIndex = -1;
        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % buttons.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + buttons.length) % buttons.length;
        }

        if (nextIndex !== -1) {
          event.preventDefault();
          buttons[nextIndex].focus();
          activateTab(buttons[nextIndex]);
        }
      });
    })(i);
  }
}

/**
 * 4. Lightbox xem phóng to hình ảnh sản phẩm, bao bì và món ăn thực dưỡng
 */
function initLightbox() {
  var modal = document.getElementById("lightboxModal");
  var modalImg = document.getElementById("lightboxImg");
  var modalCaption = document.getElementById("lightboxCaption");
  var closeBtn = document.getElementById("lightboxClose");
  var closeTargets = document.querySelectorAll("[data-close-lightbox]");
  var lightboxImages = document.querySelectorAll("img[data-lightbox]");
  var lastFocusedElement = null;

  if (!modal || !modalImg || !modalCaption || !lightboxImages.length) {
    return;
  }

  function openLightbox(img) {
    lastFocusedElement = document.activeElement;
    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt || "";

    var captionText = img.alt || "";
    var figure = img.closest("figure");
    if (figure) {
      var figcaption = figure.querySelector("figcaption");
      if (figcaption && figcaption.textContent.trim()) {
        captionText = figcaption.textContent.trim();
      }
    }

    modalCaption.textContent = captionText;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeLightbox() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalImg.src = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  for (var i = 0; i < lightboxImages.length; i++) {
    (function (img) {
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", function () {
        openLightbox(img);
      });
      img.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(img);
        }
      });
    })(lightboxImages[i]);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  for (var j = 0; j < closeTargets.length; j++) {
    closeTargets[j].addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

/**
 * 5. Nút cuộn nhanh lên đầu trang
 */
function initBackToTop() {
  var backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) {
    return;
  }

  function toggleButton() {
    if (window.scrollY > 360) {
      backToTopBtn.classList.add("is-visible");
    } else {
      backToTopBtn.classList.remove("is-visible");
    }
  }

  toggleButton();
  window.addEventListener("scroll", toggleButton, { passive: true });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/**
 * 6. Hiệu ứng hiển thị mượt mà khi cuộn tới từng phần nội dung
 */
function initScrollReveal() {
  var revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < revealElements.length; i++) {
      revealElements[i].classList.add("is-revealed");
    }
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add("is-revealed");
          obs.unobserve(entries[j].target);
        }
      }
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  for (var k = 0; k < revealElements.length; k++) {
    observer.observe(revealElements[k]);
  }
}