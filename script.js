"use strict";

const lessonItems = Array.from(document.querySelectorAll(".lesson-item"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const searchInput = document.querySelector("#lessonSearch");
const countLabel = document.querySelector("#lessonCount");
const emptyState = document.querySelector("#emptyState");
const clearButton = document.querySelector("#clearFilters");

let activeFilter = "all";

function normalizeText(value) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function updateLessons() {
  const query = normalizeText(searchInput.value.trim());
  let visibleCount = 0;

  lessonItems.forEach((item) => {
    const inCategory =
      activeFilter === "all" || item.dataset.category === activeFilter;
    const matchesSearch =
      query.length === 0 || normalizeText(item.textContent).includes(query);
    const isVisible = inCategory && matchesSearch;

    item.classList.toggle("d-none", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  countLabel.textContent =
    visibleCount === lessonItems.length
      ? "Mostrando " + visibleCount + " lecciones"
      : "Mostrando " + visibleCount + " de " + lessonItems.length + " lecciones";
  emptyState.classList.toggle("d-none", visibleCount !== 0);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    updateLessons();
  });
});

searchInput.addEventListener("input", updateLessons);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  activeFilter = "all";

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === "all";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateLessons();
  searchInput.focus();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("has-motion");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -48px 0px",
      threshold: 0.08,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

updateLessons();
