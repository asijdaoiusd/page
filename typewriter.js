class Typewriter {
    constructor(element, options) {
      this.element = element;
      this.text = Array.isArray(options.text) ? options.text : [];
      this.delay = options.delay || 100;
      this.loop = options.loop || false;
      this.cursor = options.cursor || "|";
      this.isDeleting = false;
      this.loopCount = 0;
      this.typingIndex = 0;
      this.cursorTimeout = null;
      this.clearText();
      this.startTyping();
    }
  
    clearText() {
      this.element.textContent = "";
    }
  
    startTyping() {
      this.typing();
    }
  
    typing() {
      if (this.text.length !== 0) {
        let currentText = this.text[this.typingIndex];
        let currentContent = this.element.textContent;
        let contentLength = currentContent.length;
        let newText = "";
  
        if (this.isDeleting) {
          newText = currentContent.substring(0, contentLength - 1);
        } else {
          newText = currentText.substring(0, contentLength + 1);
        }
  
        this.element.textContent = newText;
  
        if (
          this.isDeleting ||
          (newText !== currentText && !this.isDeleting)
        ) {
          if (this.isDeleting && newText === "") {
            this.isDeleting = false;
  
            if (this.typingIndex === this.text.length - 1) {
              if (this.loop) {
                this.typingIndex = 0;
                this.loopCount++;
              } else {
                this.stopTyping();
                return;
              }
            } else {
              this.typingIndex++;
            }
          }
        } else {
          this.isDeleting = true;
        }
  
        clearTimeout(this.cursorTimeout);
        this.cursorTimeout = setTimeout(() => this.typing(), this.delay);
      }
    }
  
    stopTyping() {
      clearTimeout(this.cursorTimeout);
    }
  }
  
  const element = document.getElementById("typewriter");
  const options = {
    text: [
      "Argentina",
      "@ceroocho",
      "donrouch.ar",
      "0800",
      "discord.gg/tussi"
    ],
    delay: 150,
    loop: true,
    cursor: "|"
  };
  
  const typewriter = new Typewriter(element, options);
  typewriter.typing();
  