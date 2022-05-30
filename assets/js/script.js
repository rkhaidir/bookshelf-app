const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form-input-book");
  const searchBook = document.getElementById("form-search-book");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTitle = document.getElementById("search-book-title").value;
    bookSearch(searchTitle);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const titleBook = document.getElementById("input-book-title").value;
  const authorBook = document.getElementById("input-book-author").value;
  const yearBook = document.getElementById("input-book-year").value;
  const bookIsCompleted = document.getElementById(
    "input-book-isComplete"
  ).checked;

  const id = +new Date();
  const bookObject = {
    id: id,
    title: titleBook,
    author: authorBook,
    year: yearBook,
    isCompleted: bookIsCompleted,
  };
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  snackbar("Buku Berhasil Disimpan");
  clearForm();
}

function makeBook(bookObject) {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = bookObject.title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = `Penulis : ${bookObject.author}`;

  const textBookYear = document.createElement("p");
  textBookYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book-list");
  textContainer.append(textBookTitle, textBookAuthor, textBookYear);

  const container = document.createElement("div");
  container.classList.add("card");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const unreadButton = document.createElement("button");
    unreadButton.setAttribute("class", "btn btn-success");
    unreadButton.innerText = "Belum Selesai Dibaca";

    unreadButton.addEventListener("click", function () {
      addBookUncompleted(bookObject.id);
    });

    container.append(unreadButton);
  } else {
    const readButton = document.createElement("button");
    readButton.setAttribute("class", "btn btn-success");
    readButton.innerText = "Selesai Dibaca";

    readButton.addEventListener("click", function () {
      addBookCompleted(bookObject.id);
    });

    container.append(readButton);
  }

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "btn btn-danger");
  deleteButton.innerText = "Hapus Buku";

  deleteButton.addEventListener("click", function () {
    if (confirm("Apakah kamu yakin?")) deleteBook(bookObject.id);
  });
  container.append(deleteButton);

  return container;
}

function addBookCompleted(bookId) {
  const bookTarget = findBook(bookId);

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  snackbar("Buku Selesai Dibaca");
}

function addBookUncompleted(bookId) {
  const bookTarget = findBook(bookId);

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  snackbar("Buku Belum Selesai Dibaca");
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  snackbar("Buku Berhasil Dihapus");
}

function bookSearch(title) {
  const filter = title.toUpperCase();
  const titles = document.getElementsByTagName("h3");

  for (let i = 0; i < titles.length; i++) {
    const titlesText = titles[i].textContent || titles[i].innerText;

    if (titlesText.toUpperCase().indexOf(filter) > -1) {
      titles[i].closest(".card").style.display = "";
    } else {
      titles[i].closest(".card").style.display = "none";
    }
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) return index;
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function clearForm() {
  document.getElementById("input-book-title").value = "";
  document.getElementById("input-book-author").value = "";
  document.getElementById("input-book-year").value = "";
  document.getElementById("input-book-isComplete").checked = false;
}

function snackbar(message) {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerText = message;
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

document.addEventListener(SAVED_EVENT, function () {});

document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById("books");
  unreadBookList.innerHTML = "";

  const readBookList = document.getElementById("completed-books");
  readBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) unreadBookList.append(bookElement);
    else readBookList.append(bookElement);
  }
});
