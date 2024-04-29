function print(key) {console.log(key)}

class Debug {
    constructor(element) {
        this.parent_element = element;
        this.line_index = 1;
        this.new_line();
        
        document.addEventListener("keypress", (event) => {
            switch (event.key) {
                case "Enter":   this.new_line(); break;
                case "Space":   this.subline_element.innerHTML += " "; break;
                default:        
                    if (this.subline_element.innerHTML.length > 198) {
                        this.new_subline();
                    }
                    this.subline_element.innerHTML += event.key;
                    break;
            }
            console.log(event.code, event.key, this.subline_element.innerHTML.length, this.line_index)
        });
    }

    new_line() {
        this.line_number_element = document.createElement("div");
        this.line_number_element.classList.add("line-number");
        this.subline_content_container_element = document.createElement("div");
        this.subline_content_container_element.classList.add("subline-content-container");
        this.line_number_element.innerHTML = this.line_index;
        this.line_index++;
        this.line_element = document.createElement("div");
        this.line_element.classList.add("line");

        this.line_element.appendChild(this.line_number_element);
        this.line_element.appendChild(this.subline_content_container_element);
        
        this.new_subline();
        
        this.parent_element.appendChild(this.line_element);
    }

    new_subline() {
        this.subline_element = document.createElement("div");
        this.subline_element.classList.add("subline");

        this.subline_content_container_element.appendChild(this.subline_element);
    }
}