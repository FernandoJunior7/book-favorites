import { BookSearch } from './BookSearch.js';

export class Books {
	constructor(root) {
		this.root = document.querySelector(root);
		this.load();
	}

	load() {
		this.entries = JSON.parse(localStorage.getItem('@books-favorites')) || [];
	}

	save() {
		localStorage.setItem('@books-favorites', JSON.stringify(this.entries));
	}

	async add(isbn) {
		try {
			const bookExists = this.entries.find(
				(entry) => entry.industryIdentifiers[0].identifier === isbn
			);

			if (bookExists) {
				throw new Error('Livro já existe na sua tabela');
			}

			const book = await BookSearch.search(isbn);

			if (book === undefined) {
				throw new Error('Livro não encontrado');
			}

			this.entries = [book, ...this.entries];

			this.update();
			this.save();
		} catch (error) {
			alert(error.message);
		}
	}

	delete(book) {
		const filteredEntries = this.entries.filter(
			(entry) =>
				entry.industryIdentifiers[0].identifier ===
				book.industryIdentifiers.isbn_13
		);

		this.entries = filteredEntries;

		this.update();
		this.save();
	}
}

export class BooksView extends Books {
	constructor(root) {
		super(root);

		this.tbody = this.root.querySelector('tbody');

		this.update();
		this.onadd();
	}

	onadd() {
		const button = this.root.querySelector('header button');

		button.onclick = () => {
			const { value } = this.root.querySelector('#input-search');

			this.add(value);
		};
	}

	createRow() {
		const tr = document.createElement('tr');

		tr.innerHTML = `
		<tr>
			<td class="book">
				<img src="" alt="" class="book-img" />
				<p class="book-name"></p>
			</td>
			<td class="authors"></td>
			<td class="page-count"></td>
			<td class="published-date"></td>
			<td><button class="remove">&times;</button></td>
		</tr>`;

		return tr;
	}

	deleteAllTr() {
		const tr = this.tbody.querySelectorAll('tr');

		if (tr !== null) {
			this.tbody.querySelectorAll('tr').forEach((tr) => {
				tr.remove();
			});
		}
	}

	update() {
		this.deleteAllTr();

		this.entries.forEach((book) => {
			console.log(book);

			const row = this.createRow();

			row.querySelector('.book img').src = book.imageLinks.smallThumbnail;

			row.querySelector('.book img').alt = 'Imagem da capa do livro';

			row.querySelector('.book p').textContent = book.title;

			row.querySelector('.authors').textContent = book.authors;

			row.querySelector('.page-count').textContent = book.pageCount;

			row.querySelector('.published-date').textContent = book.publishedDate;

			row.querySelector('.remove').onclick = () => {
				const isOk = confirm(`Deseja mesmo excluir esse livro da sua lista?`);

				if (isOk) {
					this.delete(book);
				}
			};

			this.tbody.append(row);
		});
	}
}
