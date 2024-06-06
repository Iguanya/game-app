document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', function(event) {
            event.preventDefault();
            login();
        });

        document.getElementById('signup-form').addEventListener('submit', function(event) {
            event.preventDefault();
            signup();
        });
    } else if (document.getElementById('character')) {
        fetch('/characters')
            .then(response => response.json())
            .then(data => {
                const characterSelect = document.getElementById('character');
                if (characterSelect) {
                    data.forEach(character => {
                        const option = document.createElement('option');
                        option.value = character.name;
                        option.textContent = character.name;
                        characterSelect.appendChild(option);
                    });
                } else {
                    console.error('Character select element not found');
                }
            })
            .catch(error => console.error('Error:', error));

        window.selectCharacter = function() {
            const character = document.getElementById('character').value;
            const token = localStorage.getItem('token');

            fetch('/characters/selectCharacter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ character })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message + '. Blockchain Address: ' + data.blockchainAddress);
                    console.log('Room:', 'Room1');
                    console.log('User ID:', localStorage.getItem('username'));
                    console.log('Blockchain Address:', data.blockchainAddress);
                    document.getElementById('info').innerText = `Room: Room1\nUser ID: ${localStorage.getItem('username')}\nBlockchain Address: ${data.blockchainAddress}`;
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
});

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('blockchainAddress', data.blockchainAddress);
            alert('Login successful. Blockchain Address: ' + data.blockchainAddress);
            window.location.href = 'lobby.html';
        }
    })
    .catch(error => console.error('Error:', error));
}

function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Sign up successful. Please log in.');
        }
    })
    .catch(error => console.error('Error:', error));
}
