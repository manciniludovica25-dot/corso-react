type Props = {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    disabled?: boolean;
};

const ITEMS_PER_PAGE_OPTIONS = [4, 8, 12];

// component che si occupa di mostrare i controlli per l' impaginazione: selezione del numero di elementi per pagina, pulsanti per navigare tra le pagine e
// indicazione della pagina corrente. tutti i controlli sono disabilitati al momento del caricamento dei dati e in caso di errore
function Pagination({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    disabled = false,
}: Readonly<Props>) {
    return (
        <div className="pagination">
            <div className="pagination__page-size">
                <label htmlFor="items-per-page" className="pagination__label">
                    Elementi per pagina:
                </label>
                <select
                    id="items-per-page"
                    className="pagination__select"
                    value={itemsPerPage}
                    onChange={e => onItemsPerPageChange(Number(e.target.value))}
                    disabled={disabled}
                >
                    {ITEMS_PER_PAGE_OPTIONS.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pagination__controls">
                <button
                    className="pagination__btn"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1 || disabled}
                    aria-label="Prima pagina"
                >
                    «
                </button>

                <button
                    className="pagination__btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || disabled}
                    aria-label="Pagina precedente"
                >
                    ‹
                </button>

                <span className="pagination__info">
                    {currentPage} / {totalPages}
                </span>

                <button
                    className="pagination__btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || disabled}
                    aria-label="Pagina successiva"
                >
                    ›
                </button>

                <button
                    className="pagination__btn"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || disabled}
                    aria-label="Ultima pagina"
                >
                    »
                </button>
            </div>
        </div>
    );
}

export default Pagination;
