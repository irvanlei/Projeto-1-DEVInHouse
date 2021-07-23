const date = document.getElementById('date');
const options = {month: "long", day: "numeric"}
const today = new Date();
date.innerHTML = today.toLocaleDateString("pt-BR", options);
const botaoDeAdicionar = document.querySelector(".adicionarTarefa button");

let id = 0;
const lista = document.querySelector('#lista');

class UI{
    static displayToDo(){
        const todos = Store.getToDos();
        todos.forEach((todo) => UI.adicionarALista(todo.text, todo.id, todo.completo));
    }

    static adicionarALista(toDo, id, seChecked){

        const completo = seChecked ? 'checkedLine' : '';
        const botaoCompleto = seChecked ? 'fa-check-circle' : 'fa-circle';
        const nLi = `<li>
        <i class="far ${botaoCompleto} co" action="complete" id="${id}"></i>
        <p class="text ${completo}">${toDo}</p>
        <i class="far fa-trash-alt" action="delete" id="${id}"></i>
        </li>`;
        const posicao = "beforeend";
        lista.insertAdjacentHTML(posicao, nLi);
    }

    static removerTarefa(element){

        element.parentNode.parentNode.removeChild(element.parentNode);

        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo, index) => {
            if(+todo.id === +curId){
                todos.splice(index, 1);
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }

    static completeToDo(element){
        const marcado = "fa-check-circle";
        const nMarcado = "fa-circle";
        element.classList.toggle(marcado);
        element.classList.toggle(nMarcado);
        element.parentNode.querySelector(".text").classList.toggle("checkedLine");

        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo, index) => {
            if(+todo.id === +curId){
                todos[index].completo = todos[index].completo ? false : true;
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }
    static limpar(){
        lista.innerHTML = '';
        localStorage.clear();
    }
}
class Store{
    static getToDos(){
        let todos;
        if(localStorage.getItem('toDo') === null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem('toDo'));
        }
        return todos;
    }

    static adicionarALista(toDo, id){

        const todos = Store.getToDos();

        todos.push({text: toDo, id: id, completo: false});

        localStorage.setItem('toDo', JSON.stringify(todos));
    }
}

botaoDeAdicionar.onclick = ()=>{
    const toDoItem = input.value;
    if(toDoItem){
        UI.adicionarALista(toDoItem, Date.now());
        Store.adicionarALista(toDoItem, Date.now());
        id++;
    }
    input.value = "";

}

document.addEventListener('DOMContentLoaded', UI.displayToDo);

document.addEventListener("keyup", function(){
    if(event.keyCode == 13){
        const toDoItem = input.value;
        if(toDoItem){
            UI.adicionarALista(toDoItem, Date.now());
            Store.adicionarALista(toDoItem, Date.now());
            id++;
        }
        input.value = "";
    }
});

lista.addEventListener("click", (event) => {
    
    const element = event.target;
    if(element.attributes.action){
        const elementAction = element.attributes.action.value;
        if(elementAction == "complete"){
            UI.completeToDo(element);
        }else if(elementAction == "delete"){
            UI.removerTarefa(element);
        }
    }
    
});

