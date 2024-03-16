// Book Class: Represent a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI task
class UI {
    static DisplayBooks() {
        // db
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        // table body
        const tableBody = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><span class="material-symbols-rounded text-danger cursor-pointer delete">delete</span></td>
        `;

        tableBody.appendChild(row);
    }

    static removeBookFromList(row) {
        const tableBody = document.getElementById('book-list');
        
        tableBody.removeChild(row);
    }

    static resetUI(form) {
        // reset the input values
        form.forEach((input) => input.value = '');
    }

    static showAlert(type, message) {
        // create html
        let alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type.toString().toLowerCase()}`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.appendChild(document.createTextNode(message));

        let containerDiv = document.querySelector('.container')
        containerDiv.appendChild(alertDiv);

        setTimeout(() => {
            containerDiv.removeChild(alertDiv);
        }, 2000);
    }
}

// Store Class: Handles storage
class Store {
    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    static getBooks() {
        let books = [];
        books = Store.getItem('books') ?? [];
        return books;
    }

    static addBook(book) {
        if(book != null) {
            let books = Store.getBooks();
            books.push(book);
            Store.setItem('books', books);
        }
    }

    static removeBook(isbn) {
        let books = Store.getBooks();
        if(books.length) {
            books.forEach((item, index) => {
                if(item.isbn == isbn) {
                    books.splice(index, 1);
                }
            })
            Store.setItem('books', books);
        }
    }
}

// Events: Displays books
document.addEventListener('DOMContentLoaded', UI.DisplayBooks());

// Event: Add a book
document.getElementById('book-form').addEventListener('submit', (e) => {
    // prevent refreshing
    e.preventDefault();

    // Get form values
    const formValues = document.querySelectorAll('#book-form input');
    
    const title = formValues[0].value;
    const author = formValues[1].value;
    const isbn = formValues[2].value;

    // validate
    if(title === '' || author === '' || isbn === '') {
        // alert('Please fill all the details !');
        UI.showAlert('danger', 'Please fill all the details')
    } else {
        // instantiate a book
        const book = new Book(title, author, isbn);

        // add
        UI.addBookToList(book);

        // show success message
        UI.showAlert('success', 'Book added successfully');

        // add to store
        Store.addBook(book);

        // reset
        UI.resetUI(formValues);
    }
});

// Event= Remove a book
document.getElementById('book-list').addEventListener('click', (e) => {
    // if click on delete icon
    if(e.target.classList.contains('delete')) {
        const rowToDelete = e.target.parentNode.parentNode;
        UI.removeBookFromList(rowToDelete)

        // show alert
        UI.showAlert('success', 'Book Deleted Successfully')

        // remove from store
        Store.removeBook(e.target.parentNode.previousElementSibling.textContent)
    }
});