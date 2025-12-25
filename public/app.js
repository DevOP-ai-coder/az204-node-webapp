async function fetchTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  todos.forEach(todo => {
    const li = document.createElement("li");
    li.textContent = todo.text;
    li.onclick = async () => {
      await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
      fetchTodos();
    };
    list.appendChild(li);
  });
}
async function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input.value) return;
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value })
  });
  input.value = "";
  fetchTodos();
}
fetchTodos();
