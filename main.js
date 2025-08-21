// Do your work here...
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const completeBookList = document.getElementById("completeBookList");
  const incompleteBookList = document.getElementById("incompleteBookList");

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (editingBookId) {
      updateBook(editingBookId);
    } else {
      addBook();
    }
  });

  const searchSubmit = document.getElementById("searchSubmit");

  searchSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    displayBook();
  });

  function generateId() {
    return Number(new Date());
  }

  function Book(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }
  let editingBookId = null;
  let isFunction = false;
  function deleteDefaultTemplate() {
    if (!isFunction) {
      const bookItems = document.querySelectorAll('[data-testid="bookItem"]');
      if (bookItems.length > 0) {
        bookItems[0].remove();
        bookItems[1].remove();
      }
    } else {
      displayBook();
    }
  }

  deleteDefaultTemplate();

  let books = JSON.parse(localStorage.getItem("books")) || [];
  const RENDER_EVENT = "render-book";

  function displayBook() {
    completeBookList.innerHTML = "";
    incompleteBookList.innerHTML = "";
    const searchTitle = document.getElementById("searchBookTitle").value;
    const filteredBooks = books.filter((book) => {
      return book.title.toLowerCase().includes(searchTitle.toLowerCase());
    });
    filteredBooks.map((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book-item");
      bookItem.setAttribute("data-bookid", book.id);
      bookItem.setAttribute("data-testid", "bookItem");
      bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button class'buttons' data-testid="bookItemIsCompleteButton">Selesai dibaca</button>
          <button class'buttons' data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button class'buttons' data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

      const deleteButton = bookItem.querySelector(
        '[data-testid="bookItemDeleteButton"]'
      );
      deleteButton.addEventListener("click", function () {
        deleteBook(book.id);
      });

      const editButton = bookItem.querySelector(
        '[data-testid="bookItemEditButton"]'
      );
      editButton.addEventListener("click", function () {
        editBook(book.id);
      });

      const isCompleteButton = bookItem.querySelector(
        '[data-testid="bookItemIsCompleteButton"]'
      );
      if (book.isComplete) {
        isCompleteButton.textContent = "Belum Selesai dibaca";
      }
      isCompleteButton.addEventListener("click", function () {
        book.isComplete = !book.isComplete;
        localStorage.setItem("books", JSON.stringify(books));
        document.dispatchEvent(new Event(RENDER_EVENT));
      });
      completeBookList.append(bookItem);

      if (book.isComplete) {
        completeBookList.append(bookItem);
      } else {
        incompleteBookList.append(bookItem);
      }
    });
  }
  function addBook() {
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const id = generateId();
    const bookObject = new Book(id, title, author, year, isComplete);

    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));

    localStorage.setItem("books", JSON.stringify(books));
    bookForm.reset();
    editingBookId = null;
  }

  function editBook(bookId) {
    const book = books.find((book) => book.id === bookId);
    if (!book) {
      return;
    }

    const title = document.getElementById("bookFormTitle");
    const author = document.getElementById("bookFormAuthor");
    const year = document.getElementById("bookFormYear");
    const isComplete = document.getElementById("bookFormIsComplete");
    title.value = book.title;
    author.value = book.author;
    year.value = book.year;
    isComplete.checked = book.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    editingBookId = bookId;

    isComplete.disabled = true;
  }

  function updateBook(bookId) {
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete");
    isComplete.checked;

    const book = books.find((book) => book.id === bookId);
    if (!book) {
      return;
    }
    book.title = title;
    book.author = author;
    book.year = year;
    book.isComplete = isComplete;

    document.dispatchEvent(new Event(RENDER_EVENT));

    localStorage.setItem("books", JSON.stringify(books));
    bookForm.reset();

    isComplete.disabled = false;
    editingBookId = null;
  }

  function deleteBook(bookId) {
    books = books.filter((book) => book.id !== bookId);
    localStorage.setItem("books", JSON.stringify(books));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(RENDER_EVENT, () => {
    displayBook();
  });

  displayBook();
});
