// Elementos del formulario Hero
const emailInputHero = document.getElementById("email-hero");
const successMessageHero = document.getElementById("success-message-hero");
const errorContainerHero = document.getElementById("error-container-hero");
const errorMessageHero = document.getElementById("error-message-hero");
const buttonHero = document.getElementById("button-hero");
const heroForm = document.getElementById("hero-form");

// Elementos del formulario CTA
const emailInputCta = document.getElementById("email-cta");
const successMessageCta = document.getElementById("success-message-cta");
const errorMessageCta = document.getElementById("error-message-cta");
const errorContainerCta = document.getElementById("error-container-cta");
const buttonCta = document.getElementById("button-cta");
const ctaForm = document.getElementById("cta-form");

// Elementos del banner y menú móvil
const bannerContainer = document.getElementById("announcement-banner");
const dismissButton = document.getElementById("dismiss-banner");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenuClose = document.getElementById("mobile-menu-close");

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para llamar la API
async function submitEmail(email) {
  try {
    const response = await fetch(
      "https://waitlist-server-five.vercel.app/api/waitlist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          project: "arxatec",
        }),
      }
    );

    if (response.ok) {
      return { success: true };
    } else {
      // Intentar parsear la respuesta JSON para obtener el mensaje de error
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `Error del servidor (${response.status})`,
        };
      } catch (parseError) {
        return {
          success: false,
          error: `Error del servidor (${response.status})`,
        };
      }
    }
  } catch (error) {
    return { success: false, error: "Error de conexión" };
  }
}

// Función para mostrar mensaje de error
function showError(errorMessageElement, errorContainerElement, message) {
  if (errorMessageElement && errorContainerElement) {
    errorMessageElement.textContent = message;
    errorContainerElement.style.display = "flex";
    errorContainerElement.classList.remove("hidden");
    errorContainerElement.classList.add("flex");
  }
}

// Función para mostrar mensaje de éxito
function showSuccess(successElement, message) {
  if (successElement) {
    const textElement = successElement.querySelector("span");
    if (textElement) {
      textElement.textContent = message;
    }
    successElement.style.display = "flex";
    successElement.classList.remove("hidden");
    successElement.classList.add("flex");
  }
}

// Función para ocultar mensajes
function hideMessages(errorContainer, successElement) {
  if (errorContainer) {
    errorContainer.style.display = "none";
    errorContainer.classList.add("hidden");
    errorContainer.classList.remove("flex");
  }
  if (successElement) {
    successElement.style.display = "none";
    successElement.classList.add("hidden");
    successElement.classList.remove("flex");
  }
}

// Función para mostrar loader en botón
function showButtonLoader(button, loadingText = "Reservando...") {
  if (button) {
    button.disabled = true;
    button.style.opacity = "0.7";
    button.style.cursor = "not-allowed";
    button.innerHTML = `<span class="loader"></span> ${loadingText}`;
  }
}

// Función para restaurar botón
function restoreButton(button, originalText = "Reservar mi mes gratis") {
  if (button) {
    button.disabled = false;
    button.style.opacity = "1";
    button.style.cursor = "pointer";
    button.innerHTML = originalText;
  }
}

// Función para manejar el envío del formulario
async function handleFormSubmit(
  emailInput,
  errorMessage,
  errorContainer,
  successMessage,
  button,
  formType
) {
  const email = emailInput.value.trim();

  // Ocultar mensajes previos
  hideMessages(errorContainer, successMessage);

  // Mostrar loader
  showButtonLoader(button);

  // Validar email
  if (!email) {
    showError(errorMessage, errorContainer, "Por favor ingresa tu email");
    restoreButton(button);
    return;
  }

  if (!isValidEmail(email)) {
    showError(
      errorMessage,
      errorContainer,
      "Por favor ingresa un email válido"
    );
    restoreButton(button);
    return;
  }

  // Llamar API
  const result = await submitEmail(email);

  // Restaurar botón
  restoreButton(button);

  if (result.success) {
    showSuccess(successMessage, "¡Gracias! Te hemos registrado correctamente.");
    emailInput.value = "";

    // Analytics tracking (si está disponible)
    if (typeof gtag !== "undefined") {
      gtag("event", "email_signup", {
        event_category: "engagement",
        event_label: formType,
        value: 1,
      });
    }
  } else {
    console.error(`Error en formulario ${formType}:`, result.error);
    showError(
      errorMessage,
      errorContainer,
      result.error || "Ocurrió un error. Inténtalo de nuevo."
    );
  }
}

// Event listeners para el formulario Hero
if (heroForm && buttonHero) {
  heroForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmit(
      emailInputHero,
      errorMessageHero,
      errorContainerHero,
      successMessageHero,
      buttonHero,
      "hero"
    );
  });
}

// Event listeners para el formulario CTA
if (ctaForm && buttonCta) {
  ctaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmit(
      emailInputCta,
      errorMessageCta,
      errorContainerCta,
      successMessageCta,
      buttonCta,
      "cta"
    );
  });
}

// Funcionalidad para cerrar el banner
if (dismissButton && bannerContainer) {
  dismissButton.addEventListener("click", () => {
    bannerContainer.style.display = "none";
    // Guardar en localStorage para recordar que se cerró
    localStorage.setItem("arxatec-banner-dismissed", "true");
  });

  // Verificar si el banner fue cerrado previamente
  if (localStorage.getItem("arxatec-banner-dismissed") === "true") {
    bannerContainer.style.display = "none";
  }
}

// Funcionalidad del menú móvil
if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenuButton.setAttribute("aria-expanded", "true");
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", () => {
    if (mobileMenuButton) {
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }
  });
}

// Smooth scroll para enlaces de navegación
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Verificar que no sea solo "#"
      if (href !== "#") {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Cerrar menú móvil si está abierto
          const mobileMenu = document.getElementById("mobile-menu");
          if (mobileMenu && mobileMenu.open) {
            mobileMenu.close();
            if (mobileMenuButton) {
              mobileMenuButton.setAttribute("aria-expanded", "false");
            }
          }

          // Scroll suave al elemento
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Enfocar el elemento para accesibilidad
          targetElement.focus();
        }
      }
    });
  });
});

// Mejorar accesibilidad del teclado para los FAQ
document.addEventListener("DOMContentLoaded", function () {
  const faqButtons = document.querySelectorAll('[command="--toggle"]');

  faqButtons.forEach((button) => {
    button.addEventListener("keydown", function (e) {
      // Permitir activación con Enter y Space
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
});

// Validación en tiempo real para los campos de email
function setupRealTimeValidation(emailInput, errorMessage, errorContainer) {
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const email = this.value.trim();

      if (email && !isValidEmail(email)) {
        showError(
          errorMessage,
          errorContainer,
          "Por favor ingresa un email válido"
        );
      } else if (email && isValidEmail(email)) {
        hideMessages(errorContainer, null);
      }
    });

    emailInput.addEventListener("input", function () {
      // Limpiar errores mientras el usuario escribe
      if (errorContainer && !errorContainer.classList.contains("hidden")) {
        hideMessages(errorContainer, null);
      }
    });
  }
}

// Configurar validación en tiempo real para ambos formularios
setupRealTimeValidation(emailInputHero, errorMessageHero, errorContainerHero);
setupRealTimeValidation(emailInputCta, errorMessageCta, errorContainerCta);

// Manejo de errores globales
window.addEventListener("error", function (e) {
  console.error("Error global capturado:", e.error);
});

// Manejo de promesas rechazadas
window.addEventListener("unhandledrejection", function (e) {
  console.error("Promesa rechazada no manejada:", e.reason);
});

// Función para mejorar la experiencia en dispositivos táctiles
function setupTouchEnhancements() {
  // Mejorar el feedback táctil en botones
  const buttons = document.querySelectorAll('button, a[role="button"]');

  buttons.forEach((button) => {
    button.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.98)";
    });

    button.addEventListener("touchend", function () {
      this.style.transform = "scale(1)";
    });
  });
}

// Configurar mejoras táctiles cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", setupTouchEnhancements);

// Función para detectar y manejar conexión lenta
function setupConnectionHandling() {
  if ("connection" in navigator) {
    const connection = navigator.connection;

    function updateUIForConnection() {
      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        // Mostrar indicador de conexión lenta
        console.log("Conexión lenta detectada, optimizando experiencia...");

        // Reducir animaciones
        document.documentElement.style.setProperty(
          "--animation-duration",
          "0.1s"
        );
      }
    }

    connection.addEventListener("change", updateUIForConnection);
    updateUIForConnection();
  }
}

// Configurar manejo de conexión
setupConnectionHandling();

console.log("Arxatec JavaScript cargado correctamente ✅");
