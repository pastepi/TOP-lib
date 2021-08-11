const bookcase = document.querySelector('.container-books');
const modalBox = document.getElementById('modalBox');

const addBookForm = document.getElementById('bookForm');
const inputTitle = document.getElementById('inputTitle');
const inputAuthor = document.getElementById('inputAuthor');
const inputPages = document.getElementById('inputPages');
const inputRead = document.getElementById('inputRead');

const btnModalClose = document.getElementById('modalBoxClose');
const btnSubmit = document.getElementById('btnSubmit');
const btnAddBook = document.getElementById('addBook');

const errorMsg = document.getElementById('errorPara');

btnAddBook.addEventListener('click', () => {
    modalBox.style.display = 'block';
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") { modalBox.style.display = 'none'; }
    });
    setTimeout(() => {
        inputTitle.focus();        
    }, 1200);
})

btnModalClose.addEventListener('click', () => { 
    modalBox.style.display = 'none';
})


addBookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (handleBtnSubmitBook(inputTitle.value, inputAuthor.value, inputPages.value, inputRead.checked)) {
        handleSubmitSuccess();
        modalBox.style.display = 'none';
    }
    
})


let myLibrary = [
    { 
        id: 1,
        title: "Hobbit",
        author: "J.R.R. Tolkien",
        pages: 695,
        read: false
    }, 
    {
        id: 2,
        title: "Naruto",
        author: "Masashi Kishimoto",
        pages: 435,
        read: true
    }
];

class Book {
    constructor(title, author, pages, read) {
        this.id = myLibrary.length;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

const createBookTile = (book, i) => {
    
    // Creating elements for Book Tile 
    const tile = document.createElement('div');

    const bookTrashBtn = document.createElement('button');
    const bookTitle = document.createElement('h2');
    const bookAuthor = document.createElement('p');
    const bookPages = document.createElement('p');

    const divToggle = document.createElement('div');
    const spanRead = document.createElement('span');
    const bookReadLabel = document.createElement('label');
    const bookRead = document.createElement('input');
    const spanSlider = document.createElement('span');

    // Adding classes
    tile.classList.add('tile');
    tile.dataset.index = `${i + 1}`;
    bookTrashBtn.classList.add('btn-close', 'tile__btn-trash');
    bookTitle.classList.add('book-title');
    bookAuthor.classList.add('book-author');
    bookPages.classList.add('book-pages');

    divToggle.classList.add('div-toggle');
    spanRead.classList.add('span-read-text');
    bookReadLabel.classList.add('status-switch');
    bookRead.classList.add('tile-book-read');
    
    spanSlider.classList.add('status-slider');

    // Toggle El structure
    bookReadLabel.appendChild(bookRead);
    bookReadLabel.appendChild(spanSlider);

    divToggle.appendChild(spanRead);
    divToggle.appendChild(bookReadLabel);

    // El-specific attributes
    bookTrashBtn.textContent = '+';
    bookTitle.textContent = `${book.title}`;
    bookAuthor.textContent = `${book.author}`;
    bookPages.textContent = `Pages: ${book.pages}`;
    bookRead.type = 'checkbox';
    spanRead.textContent = 'Completed:';
    bookRead.checked = book.read;

    // Display as unread
    if (!book.read) {
        tile.classList.add('unread');
        bookTitle.classList.add('text-unread');
        bookAuthor.classList.add('text-unread');
        bookPages.classList.add('text-unread');
        spanRead.classList.add('text-unread');
    }

    tile.appendChild(bookTrashBtn);
    tile.appendChild(bookTitle);
    tile.appendChild(bookAuthor);
    tile.appendChild(bookPages);
    tile.appendChild(divToggle);

    // Removing a book
    bookTrashBtn.addEventListener('click', handleTrashBook);

    // Toggling Read/Unread
    bookRead.addEventListener('click', function() {
        let bookTile = this.parentElement.parentElement.parentElement;
        let bookIndex = bookTile.dataset.index - 1;
        myLibrary[bookIndex].read = this.checked;
        bookTile.classList.toggle('unread');
        bookTitle.classList.toggle('text-unread');
        bookAuthor.classList.toggle('text-unread');
        bookPages.classList.toggle('text-unread');
        spanRead.classList.toggle('text-unread');
    })

    bookcase.appendChild(tile);
}

function displayBooks(collection) {
    collection.forEach(createBookTile)
}

displayBooks(myLibrary);



function handleBtnSubmitBook(title, author, pages, read) {
    if (myLibrary.some((book) => { 
        return book.title === title;
    })) {
        errorMsg.textContent = 'Book with the same title already in library';
        errorMsg.classList.add('active');
        return false;
    } else {
        let newPosition = new Book(title, author, parseInt(pages), read);
        createBookTile(newPosition, newPosition.id);
        myLibrary.push(newPosition);
        return true;
    }
}

function handleSubmitSuccess() {
    inputTitle.value = '';
    inputAuthor.value = '';
    inputPages.value = '';
    inputRead.checked = false;
    errorMsg.classList.remove('active');
}

function handleTrashBook() {
    
    const divConfirmDel = document.createElement('div');
    const containerDel = document.createElement('div');
    const spanConfirmText = document.createElement('span');
    const spanCheck = document.createElement('i');
    const spanCross = document.createElement('i');

    divConfirmDel.classList.add('div-confirm-del');
    containerDel.classList.add('container-del');
    spanConfirmText.classList.add('span-confirm-text');
    spanCheck.classList.add('far', 'fa-check-circle');
    spanCross.classList.add('far', 'fa-times-circle');

    spanConfirmText.textContent = 'Delete this book?';

    containerDel.appendChild(spanCheck);
    containerDel.appendChild(spanCross);

    divConfirmDel.append(spanConfirmText);
    divConfirmDel.appendChild(containerDel);

    this.parentElement.appendChild(divConfirmDel);

    spanCheck.addEventListener('click', () => {
        let bookIndex = this.parentElement.dataset.index - 1;
        myLibrary.splice(bookIndex, 1);
        this.parentElement.remove();
        
        let allBooks = document.querySelectorAll('.tile');  // Re-index the books
        allBooks.forEach((book, i) => {
            book.dataset.index = i + 1;
        })
    })

    spanCross.addEventListener('click', () => {
        divConfirmDel.remove();
    })

}