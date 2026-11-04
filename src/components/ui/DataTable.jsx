import { ChevronUp, ChevronDown } from "lucide-react";

// columns: [{ key, header, render?, sortable?, mobile?: "title"|"hide", align? }]
// On narrow screens each row becomes a card (CSS), so there is never horizontal overflow.
export function DataTable({ columns, rows, rowKey, sort, onSort, onRowClick, caption }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{columns.map((c) => (
            <th key={c.key} scope="col" className={c.align === "right" ? "ta-r" : ""}
              aria-sort={sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}>
              {c.sortable && onSort ? (
                <button className="th-btn" onClick={() => onSort(c.key)}>{c.header}
                  {sort?.key === c.key && (sort.dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                </button>) : c.header}
            </th>))}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)} className={onRowClick ? "row-click" : ""} onClick={() => onRowClick?.(r)}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.header} className={`${c.align === "right" ? "ta-r" : ""} ${c.mobile ? `m-${c.mobile}` : ""}`}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>))}
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}
