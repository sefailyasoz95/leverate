import { TableColumnType } from "Constants/types";
import { ReactNode, useState } from "react";

type Props = {
	columns: TableColumnType[];
	rows: any[];
};

const Table: React.FC<Props> = ({ columns, rows }: Props) => {
	const [sortOrder, setSortOrder] = useState({
		column: "",
		direction: "",
	});

	const handleSort = (columnName: string) => {
		let direction = "asc";

		if (sortOrder.column === columnName && sortOrder.direction === "asc") {
			direction = "desc";
		}

		setSortOrder({ column: columnName, direction });
	};

	const sortedRows = rows.slice().sort((a, b) => {
		let result = 0;

		if (sortOrder.direction === "asc") {
			result = a[sortOrder.column] > b[sortOrder.column] ? 1 : -1;
		} else if (sortOrder.direction === "desc") {
			result = a[sortOrder.column] < b[sortOrder.column] ? 1 : -1;
		}

		return result;
	});

	return (
		<div className='table-container'>
			<div className='table-content'>
				<table className='table'>
					<thead>
						<tr>
							{columns.map((column) => (
								<th key={column.column} onClick={() => handleSort(column.column)} className='th'>
									{column.displayValue}
									{sortOrder.column === column.column && (sortOrder.direction === "asc" ? " ▲" : " ▼")}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sortedRows.map((row, index) => (
							<tr className='tr' key={index}>
								{columns.map((column) => (
									<td key={`${index}-${column.column}`} className={`td`}>
										{column?.dataType === "date" ? (
											new Date(row[column.column]).toLocaleDateString()
										) : column?.dataType === "age" ? (
											(new Date().getFullYear() - new Date(row[column.column]).getFullYear()).toString()
										) : column?.dataType === "image" ? (
											<img
												src={row[column.column]}
												width={30}
												height={30}
												className='image'
												alt={row[column.displayValue]}
											/>
										) : (
											row[column.column]
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Table;
