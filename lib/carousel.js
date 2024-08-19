class Carousel {
  constructor({ carouselSelector, slideSelector, enablePagination = true }) {
    this.carouselSelector = carouselSelector;
    this.slideSelector = slideSelector;
    this.enablePagination = enablePagination;

    this.currentSlideIndex = 0;
    this.prevBtn = null;
    this.nextBtn = null;
    this.paginationContainer = null;

    this.carousel = document.querySelector(this.carouselSelector);

    if (!this.carousel) {
      console.error("Specify a valid selector for the carousel.");
      return null;
    }

    this.slides = this.carousel.querySelectorAll(this.slideSelector);

    if (!this.slides.length) {
      console.error("Specify a valid selector for slides.");
      return null;
    }
  }

  addElement(tag, attributes, children) {
    const element = document.createElement(tag);

    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (children) {
      if (typeof children === "string") {
        element.textContent = children;
      } else {
        children.forEach((child) => {
          if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
          } else {
            element.appendChild(child);
          }
        });
      }
    }

    return element;
  }

  tweakStructure() {
    this.carousel.setAttribute("tabindex", "0");

    const carouselInner = this.addElement("div", { class: "carousel-inner" });
    this.carousel.insertBefore(carouselInner, this.slides[0]);

    this.slides.forEach((slide) => {
      carouselInner.appendChild(slide);
    });

    this.prevBtn = this.addElement(
      "button",
      {
        class: "carousel-btn carousel-btn--prev-next carousel-btn--prev",
        "aria-label": "Previous Slide",
      },
      "<"
    );
    this.carousel.appendChild(this.prevBtn);

    this.nextBtn = this.addElement(
      "button",
      {
        class: "carousel-btn carousel-btn--prev-next carousel-btn--next",
        "aria-label": "Next Slide",
      },
      ">"
    );
    this.carousel.appendChild(this.nextBtn);

    if (this.enablePagination) {
      this.paginationContainer = this.addElement("nav", {
        class: "carousel-pagination",
        role: "tablist",
      });
      this.carousel.appendChild(this.paginationContainer);
    }

    this.slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
      if (this.enablePagination) {
        const paginationBtn = this.addElement(
          "button",
          {
            class: `carousel-btn carousel-btn--${index + 1}`,
            role: "tab",
          },
          `${index + 1}`
        );

        this.paginationContainer.appendChild(paginationBtn);

        if (index === 0) {
          paginationBtn.classList.add("carousel-btn--active");
          paginationBtn.setAttribute("aria-selected", true);
        }

        paginationBtn.addEventListener("click", () =>
          this.handlePaginationBtnClick(index)
        );
      }
    });
  }

  adjustSlidePosition() {
    this.slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${
        100 * (i - this.currentSlideIndex)
      }%)`;
    });
  }

  updatePaginationBtns() {
    const paginationBtns = this.paginationContainer.children;
    const prevActiveBtns = Array.from(paginationBtns).filter((btn) =>
      btn.classList.contains("carousel-btn--active")
    );
    prevActiveBtns.forEach((btn) => {
      btn.classList.remove("carousel-btn--active");
      btn.removeAttribute("aria-selected");
    });

    const currActiveBtns = paginationBtns[this.currentSlideIndex];
    if (currActiveBtns) {
      currActiveBtns.classList.add("carousel-btn--active");
      currActiveBtns.setAttribute("aria-selected", true);
    }
  }

  updateCarouselState() {
    if (this.enablePagination) {
      this.updatePaginationBtns();
    }
    this.adjustSlidePosition();
  }

  moveSlide(direction) {
    const newSlideIndex =
      direction === "next"
        ? (this.currentSlideIndex + 1) % this.slides.length
        : (this.currentSlideIndex - 1 + this.slides.length) %
          this.slides.length;
    this.currentSlideIndex = newSlideIndex;
    this.updateCarouselState();
  }

  handlePaginationBtnClick(index) {
    this.currentSlideIndex = index;
    this.updateCarouselState();
  }

  handlePrevBtnClick = () => this.moveSlide("prev");

  handleNextBtnClick = () => this.moveSlide("next");

  attachEventListeners() {
    this.prevBtn.addEventListener("click", this.handlePrevBtnClick);
    this.nextBtn.addEventListener("click", this.handleNextBtnClick);
  }

  create() {
    this.tweakStructure();
    this.attachEventListeners();
  }

  destroy() {
    this.prevBtn.removeEventListener("click", this.handlePrevBtnClick);
    this.nextBtn.removeEventListener("click", this.handleNextBtnClick);

    if (this.enablePagination) {
      const paginationBtns =
        this.paginationContainer.querySelectorAll(".carousel-btn");
      paginationBtns.forEach((btn) => {
        btn.removeEventListener("click", this.handlePaginationBtnClick);
      });
    }
  }
}

export { Carousel };
