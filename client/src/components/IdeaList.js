import ideasApi from "../services/ideasApi";
class IdeaList {
  constructor() {
    this._ideaListElement = document.querySelector("#idea-list");
    this._ideas = [];
    this.getIdeas();
    this._validTags = new Set();
    this._validTags.add("technology");
    this._validTags.add("business");
    this._validTags.add("education");
    this._validTags.add("health");
    this._validTags.add("inventions");
  }

  addEventListeners() {
    this._ideaListElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-times")) {
        e.stopImmediatePropagation();
        const ideaId = e.target.parentElement.parentElement.dataset.id;
        this.deleteIdea(ideaId);
        this.getIdeas();
      }
    });
  }

  async getIdeas() {
    try {
      const res = await ideasApi.getIdeas();
      this._ideas = res.data.data; //gives response
      this.render();
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong" });
    }
  }

  async deleteIdea(ideaId) {
    try {
      //delete from server
      await ideasApi.deleteIdea(ideaId);
      //delete from DOM
      this._ideas = this._ideas.filter((idea) => {
        return idea._id !== ideaId;
        
    
      });
    } catch (error) {
      alert("You can not delete this idea");
    }
  }

  addIdeaToList(idea) {
    this._ideas.push(idea);
    this.render();
  }

  getTagClass(tag) {
    tag = tag.toLowerCase();
    let tagClass = "";
    if (this._validTags.has(tag)) {
      tagClass = `tag-${tag}`;
    } else {
      tagClass = "";
    }
    return tagClass;
  }

  render() {
    this._ideaListElement.innerHTML = this._ideas
      .map((idea) => {
        const tagClass = this.getTagClass(idea.tag);
        const deleteBtn =
          localStorage.getItem("username") === idea.username
            ? `<button class="delete"><i class="fas fa-times"></i></button>`
            : "";
        return `
            <div class="card" data-id="${idea._id}">
            ${deleteBtn}
          <h3>
            ${idea.text}
          </h3>
          <p class='tag ${tagClass}' >${idea.tag.toUpperCase()}</p>
          <p>
            Posted on <span class="date">${idea.date}</span> by
            <span class="author">${idea.username}</span>
          </p>
        </div>
            `;
      })
      .join("");
    this.addEventListeners();
  }
}

export default IdeaList;
