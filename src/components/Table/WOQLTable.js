import React,{useState} from 'react';
import { useTable, usePagination } from 'react-table'
import { Table,Container,Row, Col, Pagination, PaginationItem, PaginationLink} from "reactstrap";

const WOQLTable = ({bindings, view})=>{
    
    const {
	    getTableProps,
	    getTableBodyProps,
	    headerGroups,
	    prepareRow,
	    page, // Instead of using 'rows', we'll use page,
	    // which has only the rows for the active page

	    // The rest of these things are super handy, too ;)
	    canPreviousPage,
	    canNextPage,
	    pageOptions,
	    pageCount,
	    gotoPage,
	    nextPage,
	    previousPage,
	    setPageSize,
	    state: { pageIndex, pageSize },
	  } = useTable(
	   {
	      columns,
	      data,
	      initialState: { pageIndex: 1 },
	    },
	    usePagination
  	)

    return (<span>hell sss</span>)

/*
	return(
		<>
		<Table {...getTableProps()} borderTop={true} hover>
       { }
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Row md={12}>
        <Col md={6} >
        <Pagination className="pagination">
            <PaginationItem>
                <PaginationLink previous href="#" onClick={() => previousPage()} disabled={!canPreviousPage}/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#" onClick={() => nextPage()} disabled={!canNextPage}/>
            </PaginationItem>
          </Pagination>
          </Col>
          <Col md={6} className="justify-content-end">
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        </Col>
      </Row>
      </>
	)*/
}

export default WOQLTable
