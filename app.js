//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.
let amigos = []
document.getElementById('button-add').addEventListener('adicionarAmigo', function() {
    let nome = document.getElementById('nome').value
    amigos.push(nome)
    document.getElementById('nome').value = ''
    document.getElementById('amigos-list').innerHTML = amigos.join(', ')

    document.getElementById('amigos-list').style.display = 'block'
    document.getElementById('button-add').style.display = 'none'
    document.getElementById('button-remove').style.display = 'block'
    document.getElementById('button-remove').addEventListener('click', function() {
        amigos.pop()
        document.getElementById('amigos-list').innerHTML = amigos.join(', ')
        if (amigos.length === 0) {
            document.getElementById('amigos-list').style.display = 'none'
            document.getElementById('button-remove').style.display = 'none'
            document.getElementById('button-add').style.display = 'block'
        }
    })
})