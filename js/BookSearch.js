export class BookSearch {
	static search(isbn) {
		const endpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

		// coloquei ; ao invés de , para retornar as propriedades desestruturadas e esqueci de por o return
		return fetch(endpoint)
			.then((data) => data.json())
			.then((data) => data.items[0])
			.then((data) => data.volumeInfo)
			.then(
				({
					title,
					authors,
					pageCount,
					publishedDate,
					industryIdentifiers,
					imageLinks,
				}) => ({
					title,
					authors,
					pageCount,
					publishedDate,
					industryIdentifiers,
					imageLinks,
				})
			);
	}
}
