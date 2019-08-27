const card = post => {
    return `
        <div class="card z-depth-4">
            <div class="card-content">
                <span class="card-title">${post.title}</span>
                <p style="white-space: pre-line">${post.text}</p>
                <small>${new Date(post.date).toLocaleString()}</small>
            </div>
            <div class="card-action">
                <button class="btn btn-small red js-remove" data-id="${post._id}">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
    `;
};

let posts = [], modal;
const $title = document.querySelector('#title'), $text = document.querySelector('#text');

class PostApi {
    static fetch = () => fetch('/api/post', {method: 'get'}).then(res => res.json());
    static create = post => {
        return fetch('/api/post', {
            method: 'post', body: JSON.stringify(post),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }).then(res => res.json());
    };
    static delete = id => fetch(`/api/post/${id}`, {method: 'delete'}).then(res => res.json());
}

document.addEventListener('DOMContentLoaded', () => {
    PostApi.fetch().then(backendPosts => {
        posts = backendPosts.concat();
        return renderPosts(posts);
    });
    modal = M.Modal.init(document.querySelector('.modal'));
    document.addEventListener('click', onClick);
    document.querySelector('#cancel').addEventListener('click', onCancel);
    document.querySelector('#createPost').addEventListener('click', onCreatePost);
    document.querySelector('#posts').addEventListener('click', onDeletePost);
    document.addEventListener('keydown', onKeyDown);
});

function renderPosts(_posts = []) {
    document.querySelector("#posts").innerHTML = _posts.length
        ? _posts.map(post => card(post)).join(' ') : `<div class="center"><h3>No posts available yet</h3></div>`;
}

function closeModal() { modal.close(); $title.value = ''; $text.value = ''; M.updateTextFields(); }
function onCancel() { closeModal(); }
function onClick(event) { if (event.target.className === 'modal-overlay') closeModal(); }

function onCreatePost() {
    if ($title.value && $text.value) {
        const newPost = { title: $title.value, text: $text.value };
        PostApi.create(newPost).then(post => { posts.push(post); renderPosts(posts); });
        closeModal();
    }
}

function onDeletePost(event) {
    if (event.target.classList.contains('js-remove')) {
        if (confirm('Do you really want to delete the post?')) {
            const id = event.target.getAttribute('data-id');
            PostApi.delete(id).then(() => {
                posts.splice(posts.findIndex(post => post._id === id), 1);
                renderPosts(posts);
            });
        }
    }
}

function onKeyDown(event) { if (event.which === 27) closeModal(); }
