// Importaciones necesarias
import { mount } from "@vue/test-utils";
import HomeView from "../views/HomeView.vue";
import { describe, it, expect } from "vitest";

// Suite de tests
describe("HomeView.vue", () => {
  it("debería renderizar el título principal correctamente", () => {
    const wrapper = mount(HomeView);
    const title = wrapper.find("#main-title");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("GrowStudio");
  });

  it("debería renderizar la tagline correctamente", () => {
    const wrapper = mount(HomeView);
    const tagline = wrapper.find(".tagline");
    expect(tagline.exists()).toBe(true);
    expect(tagline.text()).toBe("Creciendo día a día");
  });

  it("debería tener un enlace para reservar", () => {
    const wrapper = mount(HomeView);
    const reserveLink = wrapper.find('router-link[to="/reserva"]');
    expect(reserveLink.exists()).toBe(true);
    expect(reserveLink.text()).toContain("Reserva aquí");
  });

  it("el enlace de reserva debería tener la clase de botón correcta", () => {
    const wrapper = mount(HomeView);
    const reserveLink = wrapper.find('router-link[to="/reserva"]');
    expect(reserveLink.classes()).toContain("btn-warning");
  });

  it("debería renderizar la sección de reseñas con el título adecuado", () => {
    const wrapper = mount(HomeView);
    const reviewsTitle = wrapper.find("#reviews-title");
    expect(reviewsTitle.exists()).toBe(true);
    expect(reviewsTitle.text()).toBeTruthy(); // Puede ser más específico si conocemos el texto
  });

  it("debería tener contenedores de reseñas en la sección de reseñas", () => {
    const wrapper = mount(HomeView);
    const reviewCards = wrapper.findAll(".review-card");
    expect(reviewCards.length).toBeGreaterThan(0); // Asegura que existen reseñas
  });

  it("debería aplicar las clases de estilo principales en la sección hero", () => {
    const wrapper = mount(HomeView);
    const heroSection = wrapper.find(".hero-section");
    expect(heroSection.exists()).toBe(true);
    expect(heroSection.classes()).toContain("text-center");
  });

  it("debería aplicar clases de estilo principales en la sección de reseñas", () => {
    const wrapper = mount(HomeView);
    const reviewsSection = wrapper.find(".reviews-section");
    expect(reviewsSection.exists()).toBe(true);
    expect(reviewsSection.classes()).toContain("pb-5");
  });

  it("debería tener un botón accesible en el enlace de reserva", () => {
    const wrapper = mount(HomeView);
    const reserveButton = wrapper.find('router-link[to="/reserva"]');
    expect(reserveButton.attributes("aria-label")).toBe("Reserva tu cita ahora");
  });
});
